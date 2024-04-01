import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';
import { ContentComponent } from 'src/app/content/content.component';
import { UserService } from 'src/app/shared/service/user_service';
import { EscolaridadeService } from 'src/app/shared/service/escolaridade_service';
import { Escolaridade } from 'src/app/shared/utilitarios/escolaridade';

@Component({
  selector: 'app-leitor-qt',
  templateUrl: './leitor-qt.component.html',
  styleUrls: ['./leitor-qt.component.css']
})
export class LeitorQTComponent implements OnInit {
  professores: any[] = []; // Array para armazenar os professores
  fileData: { file: string,index:number, professors: any[],error:any }[] = []; // Array to store file and professors data
  escolaridades: Escolaridade[] = [];
  professoresCompilado: any[] = []; // Array para armazenar os professores
  cursoEscolhido: Curso | undefined ; 
  selectedFiles: File[] = [];
  objMensagem: any = {
    totalHoras: 0,
    totalHorasUtilizadas: 0,
    horasRestantes: 0
  };
  exceededLimit = false;

  constructor(private toastr: ToastrService, 
    private cursoService: CursoService,
    private contentComponent: ContentComponent, 
    private userService: UserService,
    private escolaridadeService:EscolaridadeService) {}

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;
        const isDuplicate = this.selectedFiles.some(selectedFile => selectedFile.name === fileName);
        if (!isDuplicate) {
          this.selectedFiles.push(file);
        } else {
          this.toastr.warning(`Arquivo duplicado ou com nome inválido: ${fileName}`);
        }
      }
      this.readFiles();
    }
  }

  ngOnInit(): void {
    this.cursoEscolhido = this.cursoService.getCursoEscolhido();
    this.objMensagem.totalHoras = this.cursoEscolhido?.haiCurso;
    if(this.cursoEscolhido && this.cursoEscolhido.qtsFiles && this.cursoEscolhido.qtsFiles.length>0){
      this.selectedFiles = this.cursoEscolhido.qtsFiles;
      this.readFiles();
    }
    this.escolaridadeService.getEscolaridades().subscribe(
      (escolaridades: Escolaridade[]) => {
        this.escolaridades = escolaridades;
      },
      (error) => {
        console.log('Erro ao obter a lista de usuários:', error);
      }
    );

  }
  ngAfterViewInit() {
    this.isFormValid();
  }

  isFormValid(): void {
    if (this.professoresCompilado.length > 0) {
      this.contentComponent.changeValidityByComponentName(LeitorQTComponent, true);
    } else {
      this.contentComponent.changeValidityByComponentName(LeitorQTComponent, false);
    }
  }



  deleteFile(index: number): void {
    if (index >= 0 && index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
      this.readFiles();
    }
  }
  
  readFiles(): void {
    this.fileData = []; // Clear previous file data

    // Use a list of Promises to track the completion of each file processing
    const promises: Promise<void>[] = [];
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const promise = new Promise<void>((resolve) => {
        this.readFile(this.selectedFiles[i], i, resolve);
      });
      promises.push(promise);
    }
        // Use Promise.all to wait for all promises to be resolved
        Promise.all(promises).then(() => {
          // All promises are resolved
          
          let soma = 0;
          this.professoresCompilado = [];
          const seenFileNames = new Set(); // Conjunto para armazenar nomes de arquivos já vistos
        
          for (let i = 0; i < this.fileData.length; i++) {
            const fileName = this.fileData[i].file;
        
            // Verifica se o nome do arquivo já foi visto
            if (seenFileNames.has(fileName)) {
              this.toastr.warning(`Arquivo duplicado: ${fileName}`);
              this.deleteFile(i); // Remove o arquivo duplicado
            } else {
              seenFileNames.add(fileName);
        
              // Tratamento de erros
              const error = this.fileData[i].error;
              if (error.status) {
                this.toastr.error(error.message);
                this.deleteFile(i);
              } else {
                const professorsAux = this.fileData[i].professors;
                professorsAux.forEach(professor => {
                  const professorAux = this.professoresCompilado.find(professorCompilado => professorCompilado.mtcl === professor.mtcl);
                  if (!professorAux) {
                    soma += 1;
                    this.professoresCompilado.push({ ...professor, hai: 1 });
                  } else {
                    soma += 1;
                    const index = this.professoresCompilado.indexOf(professorAux);
                    this.professoresCompilado[index].hai = this.professoresCompilado[index].hai + 1;
                  }
                });
              }
            }
          }
          this.objMensagem.totalHorasUtilizadas = soma;
          this.enviarDadosCursoEscolhido();
          if( this.objMensagem.totalHoras - soma<0){
            this.toastr.error("Removido último QT pois a quantidade de horas ultrapassa a quantidade restante!");
            this.deleteFile(this.fileData.length-1);
          }else{
            this.objMensagem.horasRestantes = this.objMensagem.totalHoras - soma;
          }

        });
        
  }
  
  
  readFile(file: File, index: number, resolve: () => void): void {
    const reader: FileReader = new FileReader();
    const fileName = file.name; // Get the filename

    reader.onload = (e: any) => {
      const data = e.target.result;
      const professorsAux: any[] = [];
      this.processFileData(data, professorsAux, fileName, index);
      resolve();
    };

    reader.readAsBinaryString(file);
  }
  processFileData(data: string, professorsAux: any[], fileName: string, index: number): void {
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    // Limpar dados anteriores
    professorsAux = [];
    let error = this.processWorksheet(jsonData, professorsAux);
    this.fileData.push({ file: jsonData[2][8],index:index, professors: professorsAux, error: error });
  }
   excelSerialToDate(serial:number):any {
    const msPerDay = 24 * 60 * 60 * 1000; // Número de milissegundos por dia
    const excelStartDate = new Date(1899, 11, 30); // Ajuste para levar em conta o deslocamento

    // Calcula a data adicionando o número de dias ao início do Excel
    const startDate = new Date(excelStartDate.getTime() + serial * msPerDay);

    const dateArray = [];
    
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate.getTime() + i * msPerDay);
        dateArray.push(currentDate.toLocaleDateString());
    }

    return dateArray;
  }
  
  processWorksheet(jsonData: any[][], professorsAux: any[]): any {
    let errorArquivo = {status:false,message:"Sem erros"};
    const dias = this.excelSerialToDate(jsonData[3][2])
    let errorAux=false;
    const indexes = [6, 8, 10, 12, 14];
    var regex = /\b\d+(\.\d+)+\b/;
    var numeroProcesso = jsonData[0][0].match(regex);

    if (numeroProcesso[0] != this.cursoEscolhido?.numeroProcesso) {
      errorArquivo.status = true;
      errorArquivo.message = "Esse QT não pertence a esse processo.";
      
    } 
    
      jsonData.forEach((row: any, rowIndex: number) => {
      if (rowIndex >= 6 && rowIndex <= 75) {
        const diaIndex = Math.floor((rowIndex - 6) / 10);
        const dia = dias[diaIndex];
        
        indexes.forEach(index => {
          if (row[index]) {
            if(!errorAux){
              errorArquivo = this.addOrUpdateProfessor(index, row, dia, professorsAux);
              if(errorArquivo.status){
                errorAux = true;
              }
            }
          }
        });
      }
    });

    return errorArquivo;
  }
  


addOrUpdateProfessor(mtclIndex: number, row: any, dia: string, professoresAux: any[]): any {
  const mtcl = row[mtclIndex];
  const hora = row[1];
  let errorArquivo = {status:false,message:"Sem erros"};

  const verificacaoProfessor = professoresAux.find(professor => professor.mtcl === mtcl && professor.dia === dia && professor.hora === hora);
  if(!row[1]){
    errorArquivo.status = true;
    errorArquivo.message = "O QT contém uma linha sem hora definida.";
    return errorArquivo;
  }
  if(!row[3]){
    errorArquivo.status = true;
    errorArquivo.message = "O QT contém uma linha sem disciplina definida.";
    return errorArquivo;
  }
  if(!row[4]){
    errorArquivo.status = true;
    errorArquivo.message = "O QT contém uma linha sem sintese definida.";
    return errorArquivo;
  }
  if(!row[5] && row[5]!="0"){
    errorArquivo.status = true;
    errorArquivo.message = "O QT contém uma linha sem faltas definidas.";
    return errorArquivo;
  }
  if (!verificacaoProfessor) {
    professoresAux.push(this.createProfessorObj(mtclIndex, row, dia));
    return errorArquivo;
  } else {
    errorArquivo.status = true;
    errorArquivo.message = "O arquivo apresenta erro na mtcl: "+mtcl+" na hora: "+ hora;
    return errorArquivo;
  }
}

createProfessorObj(mtclIndex: number, row: any, dia: string): any {
  return {
    processo: "",
    mtcl: row[mtclIndex],
    name: row[mtclIndex + 1],
    hai: 1,
    dia: dia,
    hora: row[1]? row[1]:"",
    disp: row[3]? row[3]:"",
    sintese:row[4]? row[4]:"",
    falta: row[5]? row[5]:"0"
    
  };
}


enviarDadosCursoEscolhido(){
  let arrayAux:any[] =[];
  let objAux:any[] =[];
  
  let cabecalho=["Posto/Grad","Mtcl/Cpf","Nome completo","Escolaridade","D.M Valor","H/A Qtd","H/A Valor","Alimentação","Soma"];
  arrayAux.push(cabecalho)
  for (const professor of this.professoresCompilado) {
    this.userService.getUserByMtcl(professor.mtcl).subscribe(
      (professorAux) => {
        const escolaridade = this.escolaridades.find(escolaridade => escolaridade.id === professorAux.escolaridade_id);
        if(escolaridade){
          arrayAux.push(this.createProfessorArray(professorAux,professor,escolaridade)); 
          objAux.push(this.createObjForBD(professorAux,professor,escolaridade))
        }
      },
      (error) => {
        console.error('Erro ao obter usuário:', error);
      }
    );
  }

  this.cursoService.setAtributoByCursoEscolhidoID('docentesQTS',arrayAux)
  this.cursoService.setAtributoByCursoEscolhidoID('docentesQTSObj',objAux)
  this.cursoService.setAtributoByCursoEscolhidoID('qtsFiles',this.selectedFiles)
  
}
createObjForBD(professorAux:any,professor:any,escolaridade:Escolaridade): any {
  const alimentacao =0;
  const diariaMilitar =0;
  let resp:any={};

  if(escolaridade.valor ){
    resp={
      usersId:professorAux.id,
      diariaMilitar:diariaMilitar,
      horaAulaQtd:professor.hai,
      horaAulaValor:professor.hai*escolaridade.valor,
      alimentacao:alimentacao
    }
  }
  console.log(resp)
  return resp
}

createProfessorArray(professorAux:any,professor:any,escolaridade:Escolaridade): any {
  let resp:any[]=[];
  if(escolaridade.valor ){
    resp=[
      professorAux.graduacao,
      professorAux.mtcl,
      professorAux.name,
      escolaridade.nome,
      "R$ 0,00",
      professor.hai,
      (professor.hai*escolaridade.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      "R$ 0,00",
      (professor.hai*escolaridade.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })  
    ];
  }
  return resp
}
  
}
