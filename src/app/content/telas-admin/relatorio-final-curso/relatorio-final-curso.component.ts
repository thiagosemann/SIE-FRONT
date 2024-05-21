import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DocumentosCriadosService } from 'src/app/shared/service/documentosCriados_service';
import { PgeService } from 'src/app/shared/service/pge_service';
import { RFCService } from 'src/app/shared/service/rfc_service';
import { RFC } from 'src/app/shared/utilitarios/rfc';

@Component({
  selector: 'app-relatorio-final-curso',
  templateUrl: './relatorio-final-curso.component.html',
  styleUrls: ['./relatorio-final-curso.component.css']
})
export class RelatorioFinalCursoComponent implements OnInit  {
  searchTerm: string = '';  // Para a caixa de pesquisa principal
  addAuth: string = '';  // Para a caixa de pesquisa AUTH
  loading: boolean = false;  // Variável para controlar o estado de carregamento
  dataEntrada: string = ''; 
  rfcs:RFC[]=[];
  telaEdicao: boolean = false;
  editForm: FormGroup;
  editedRFCId: number | undefined;
  editedRFCNumeroProcesso: string | undefined;
  editedRFCPgeId :number | undefined;
  editedDocumentoCriadoId :number | undefined;


  constructor(private rfcService:RFCService, private toastr: ToastrService, private documentosCriadosService: DocumentosCriadosService,private formBuilder: FormBuilder,private pgeService: PgeService  )
  {
    this.editForm = this.formBuilder.group({
      auth: ['', Validators.required],
      numeroProcesso: ['', Validators.required],
      statusCertificado: ['', Validators.required],
      statusDrive: ['', Validators.required],
      statusNb: ['', Validators.required],
      statusFinalizacao: ['', Validators.required],
      sgpe: ['', Validators.required],
      haCurso: ['', Validators.required],
      haiCurso: ['', Validators.required],
      dataEntrada: ['', Validators.required],
      sigla: ['', Validators.required],
      bbm: ['', Validators.required],
      iniCur: ['', Validators.required],
      fimCur: ['', Validators.required],
 
    });
  }

  ngOnInit(): void {
    this.getRFCs();
  }


  getRFCs(): void {
    this.rfcService.getRFCs().subscribe({
      next: (rfcs: RFC[]) => {
        this.rfcs = rfcs;

      },
      error: (error: any) => {
        console.error('Erro ao obter RFCs:', error);
        this.toastr.error('Erro ao obter RFCs');
      }
    });
  }


  addRFC():void{
    this.loading = true;
    if (this.addAuth === "") {
      // Exibir mensagem de erro
      this.toastr.info("Digite um código de autenticação!");
      this.loading = false;
      return;
    }
    // Verificar se o edital com o mesmo auth já existe na lista
    const authExistente = this.rfcs.find(rfc => rfc.auth === this.addAuth); 
    if (authExistente) {
      // Exibir mensagem de erro
      this.toastr.error("Já existe um RFC com este AUTH na lista!");
      this.loading = false;
      return;
    }
    if (this.dataEntrada === "") {
      // Exibir mensagem de erro
      this.toastr.info("Digite a data de entrada no sgpe!");
      this.loading = false;
      return;
    }
    console.log(this.addAuth)
    this.documentosCriadosService.getCursoByAuth(this.addAuth).subscribe({
      next: (resp: any) => {
        console.log(resp)
        if(resp.tipo=="parcial"){
          // Exibir mensagem de erro
          this.toastr.info("Esse autenticação pertence a uma parcial!");
          this.loading = false;
          return;
        }
        console.log(resp)
       const novoRFC : RFC={
          documentosCriadosId: resp.id,
          numeroProcesso: resp.dados.numeroProcesso,
          auth: resp.auth,
          dataEntrada:  this.formatDateFromInput(this.dataEntrada),
          matriculados: resp.dados.alunosMatriculados,
          excluidos: resp.dados.alunosExcluidos,
          desistentes: resp.dados.alunosDesistentes,
          reprovados: resp.dados.alunosReprovados,
          aprovados: resp.dados.alunosAprovados,
          statusCertificado: "Pendente",
          statusDrive:"Pendente",
          statusNb: "Pendente",
          statusFinalizacao: "Pendente",
          sigla: resp.dados.sigla,
          compiladoHoraAula: false,
          compiladoHoraAulaNr: 0,
          compiladoDiariaCurso: false,
          compiladoDiariaCursoNr: 0,
          iniCur: resp.dados.iniCur,
          fimCur: resp.dados.fimCur,
          haCurso:resp.dados.haCurso,
          haiCurso:resp.dados.haiCurso,
          bbm:resp.dados.bbm,
          observacoes: ""
        }
        // Chamar o serviço para criar o edital
        this.rfcService.addRFC(novoRFC).subscribe({
          next: (rfcCriado: any) => {
            console.log(rfcCriado)
            this.toastr.success('Edital criado com sucesso!');
          },
          error: (error: any) => {
            console.error('Erro ao criar edital:', error);
            this.toastr.error('Erro ao criar edital');
          },
          complete: () => {
            this.loading = false;
            this.addAuth = "";
          }
        });
        
      },
      error: (error: any) => {
        console.log('Erro ao buscar curso:', error);
        this.toastr.error("Auth não encontrado!");
      }
    });
  }

  formatDateFromInput(date: string): string {

    const dia = date[8] + date[9]; 
    const mes = date[5] + date[6];
    const ano = date[0] + date[1] + date[2] + date[3];
    
    return `${dia}/${mes}/${ano}`

  }
  formatDateForInput(date: string): string {
    const parts = date.split('/');
    if (parts.length === 3) {
        // Rearrange the parts to match the YYYY-MM-DD format accepted by the input type="date"
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        return formattedDate;
    } else {
        // Handle invalid date format
        console.error('Invalid date format. Expected format: DD/MM/YYYY');
        return '';
    }
  }

  startEditing(rfc: any): void {
    console.log(rfc)
    this.telaEdicao = true;
    this.editedRFCId = rfc.id;
    this.editedRFCNumeroProcesso = rfc.numeroProcesso;
    this.editedRFCPgeId = rfc.pgeId;
    this.editedDocumentoCriadoId = rfc.documentosCriadosId;

    console.log(rfc)
    this.editForm.patchValue({
      auth: rfc.auth,
      numeroProcesso: rfc.numeroProcesso,
      statusCertificado: rfc.statusCertificado,
      statusDrive: rfc.statusDrive,
      statusNb: rfc.statusNb,
      statusFinalizacao: rfc.statusFinalizacao,
      sigla: rfc.sigla,
      bbm: rfc.bbm,
      dataEntrada: this.formatDateForInput(rfc.dataEntrada),
      iniCur: this.formatDateForInput(rfc.iniCur),
      fimCur: this.formatDateForInput(rfc.fimCur),
      haCurso: rfc.haCurso,
      haiCurso: rfc.haiCurso
    });
    this.editForm.disable();
    this.editForm.get('statusCertificado')?.enable(); 
    this.editForm.get('statusDrive')?.enable(); 
    this.editForm.get('statusNb')?.enable(); 
    this.editForm.get('statusFinalizacao')?.enable(); 

  }

  cancelEdit(): void {
    // Volte para a tela principal sem salvar as alterações
    this.telaEdicao = false;
  }


  updateRFC():void{
    const updatedRFCData = this.editForm.value;
    updatedRFCData.id = this.editedRFCId;
    updatedRFCData.numeroProcesso = this.editedRFCNumeroProcesso;
    this.rfcService.updateRFC(updatedRFCData).subscribe({
      next: (result: any) => {
        
      },
      error: (error: any) => {
        console.error('Erro ao atualizar edital:', error);
        this.toastr.error('Erro ao atualizar edital');
      },
      complete: () => {
        // Reset the form and toggle the editing state
        this.editForm.reset();
        this.telaEdicao = false;
        this.toastr.success("RFC atualizado!")
        const index = this.rfcs.findIndex(rfc => rfc.id === this.editedRFCId);
        console.log(index)
        this.rfcs[index].statusCertificado = updatedRFCData.statusCertificado;
        this.rfcs[index].statusDrive = updatedRFCData.statusDrive;
        this.rfcs[index].statusNb = updatedRFCData.statusNb;
        this.rfcs[index].statusFinalizacao = updatedRFCData.statusFinalizacao;
        const pgeObj = {
          situacao: "",
          editalId: this.editedRFCId,
          documentoCriadoId: this.editedDocumentoCriadoId,
        };
        console.log(this.editedRFCPgeId)
        if(updatedRFCData.statusFinalizacao =="Finalizado" ){
          console.log(pgeObj)
          this.updatePgeOnServer(this.rfcs[index].numeroProcesso,"FINALIZADO")
        }else{

          this.updatePgeOnServer(this.rfcs[index].numeroProcesso,"ANDAMENTO")
        }
       
      }
    });

  }
  updatePgeOnServer(procNum:string,situacao:any): void {
    this.pgeService.updatePgeByProcNum(procNum, {situacao:situacao}).subscribe({
      next: (pgeResult: any) => {
        // Handle PGE update success
        console.log(pgeResult)
      },
      error: (pgeError: any) => {
        console.error('Erro ao atualizar PGE:', pgeError);
        this.toastr.error('Erro ao atualizar PGE');
      }
    });
  }


   
}
