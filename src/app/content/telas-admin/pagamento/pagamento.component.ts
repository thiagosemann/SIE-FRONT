import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AlunosByDocumentoService } from 'src/app/shared/service/alunosByDocumento_service';
import { CompiladoPagamentoService } from 'src/app/shared/service/compiladoPagamento_service';
import * as XLSX from 'xlsx';
import { Observable, forkJoin } from 'rxjs';
import { PagamentoDiariaDeCursoService } from 'src/app/shared/service/pagamentoDiariaDeCurso_service';
import { PagamentoHoraAulaService } from 'src/app/shared/service/pagamentoHoraAula_service';
import { ProfessoresByDocumentoService } from 'src/app/shared/service/professoresByDocumento_service';
import { RFCService } from 'src/app/shared/service/rfc_service';
import { rpcService } from 'src/app/shared/service/rpc_service';
import { CompiladoPagamento } from 'src/app/shared/utilitarios/compiladoPagamento';
import { Discente } from 'src/app/shared/utilitarios/discente';
import { Docente } from 'src/app/shared/utilitarios/docente';
import { PagamentoDiariaDeCurso } from 'src/app/shared/utilitarios/pagamentoDiariaDeCurso';
import { PagamentoHoraAula } from 'src/app/shared/utilitarios/pagamentoHoraAula';
import { RFC } from 'src/app/shared/utilitarios/rfc';
import { RPC } from 'src/app/shared/utilitarios/rpc';
import { UserService } from 'src/app/shared/service/user_service';
import { User } from 'src/app/shared/utilitarios/user';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.css']
})
export class PagamentoComponent implements OnInit {
  rfcs: RFC[] = [];
  rpcs: RPC[] = [];
  processos: any[] = [];
  alunos: Discente[] = []; // Certifique-se de declarar a propriedade 'alunos'
  docentes: Docente[] = []; // Certifique-se de declarar a propriedade 'alunos'
  totalHai:number = 0;
  valorTotalHai:number = 0;
  valorTotalHaiFormatado:string = "";
  totalDC:number = 0;
  valorTotalDC:number = 0;
  valorTotalDCFormatado:string = "";
  pagamentoHoraAula : PagamentoHoraAula[]=[];
  pagamentoDiariaDeCurso : PagamentoDiariaDeCurso[]=[];
  qtdProfessores:number = 0;
  qtdAlunos:number = 0;
  compilados: CompiladoPagamento[] = [];
  compiladoSelected:CompiladoPagamento | undefined;
  uniqueProfessors: any[]=[];
  uniqueAlunos: any[]=[];

  


  constructor(private rfcService: RFCService,
    private rpcService: rpcService,
    private toastr: ToastrService,
    private alunosByDocumentoService: AlunosByDocumentoService,
    private professoresByDocumentoService: ProfessoresByDocumentoService,
    private pagamentoHoraAulaService: PagamentoHoraAulaService,
    private pagamentoDiariaDeCursoService: PagamentoDiariaDeCursoService,
    private compiladoPagamentoService: CompiladoPagamentoService,
    private userService: UserService,
    
  ) { }

  ngOnInit(): void {
    this.getRpcAndRFC()
    this.getCompilados();
  }

  getRpcAndRFC():void{
    this.rpcs=[];
    this.rfcs=[];
    this.rpcService.getRpcs().subscribe({
      next: (rpcs: RPC[]) => {
        rpcs.forEach(rpc=>{
          if(!rpc.compilado_id){
            this.rpcs.push(rpc);
          }
        })
        this.rfcService.getRFCs().subscribe({
          next: (rfcs: RFC[]) => {
            rfcs.forEach(rfc=>{
              if(!rfc.compilado_id && rfc.statusFinalizacao=="Finalizado"){
                this.rfcs.push(rfc);
              }
            })
         
            this.combineProcessos();
          },
          error: (error: any) => {
            console.error('Erro ao obter RFCs:', error);
            this.toastr.error('Erro ao obter RFCs');
          }
        });
      },
      error: (error: any) => {
        console.error('Erro ao obter RFCs:', error);
        this.toastr.error('Erro ao obter RFCs');
      }
    });
  }

  combineProcessos(): void {
    const rfcsMapped = this.rfcs.map(rfc => ({ numeroProcesso: rfc.numeroProcesso, sigla: rfc.sigla, tipo: 'RFC', auth:rfc.auth,documentosCriadosId:rfc.documentosCriadosId, rfc_id:rfc.id }));
    const rpcsMapped = this.rpcs.map(rpc => ({ numeroProcesso: rpc.numeroProcesso, sigla: rpc.sigla, tipo: 'RPC', auth:rpc.auth,documentosCriadosId:rpc.documentosCriadosId, rpc_id:rpc.id }));
    this.processos = [...rfcsMapped, ...rpcsMapped];
    this.getInfoProcessos();
    console.log(this.rfcs)
    console.log(this.rpcs)
    
  }

  getInfoProcessos(): void {
    this.docentes = [];
    this.totalHai =0;
    this.valorTotalHai =0;
    this.qtdProfessores=0;
    console.log( this.processos);
    this.processos.forEach(processo => {
      this.professoresByDocumentoService.getDocentesByDocumentoId(processo.documentosCriadosId).subscribe({
        next: (docentes: Docente[]) => { 
          processo.qtdProfessores = docentes.length;
          this.qtdProfessores += docentes.length;
          let hai=0;
          let haiValor=0;
          docentes.forEach(docente=>{
            this.docentes.push(docente)
            if(docente && docente.horaAulaQtd && docente.horaAulaValor){
              hai+=docente.horaAulaQtd;
              haiValor+= Number(docente.horaAulaValor)
            }
          })
          processo.hai = hai
          processo.haiValor = haiValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          this.totalHai +=hai;
          this.valorTotalHai +=haiValor;
          this.valorTotalHaiFormatado = this.valorTotalHai.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        },
        error: (error: any) => {
          console.error('Erro ao obter aluno:', error);
          this.toastr.error('Erro ao obter aluno');
        }
      });
      
      this.alunosByDocumentoService.getAlunosByDocumentoId(processo.documentosCriadosId).subscribe({
        next: (alunos: Discente[]) => { // Alterado para 'aluno' para aceitar apenas um Discente
          processo.qtdAlunos = alunos.length;
          this.qtdAlunos += alunos.length;
          let qtdDC=0;
          let qtdDCValor=0;
          alunos.forEach(aluno=>{
            this.alunos.push(aluno)
            if(aluno && aluno.diariaDeCursoQtd && aluno.diariaDeCurso ){
              qtdDC += aluno.diariaDeCursoQtd;
              qtdDCValor += Number(aluno.diariaDeCurso);
            }
          })
          console.log(this.alunos)
          processo.qtdDC = qtdDC
          processo.qtdDCValor = qtdDCValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          this.totalDC +=qtdDC;
          this.valorTotalDC +=qtdDCValor;
          this.valorTotalDCFormatado = this.valorTotalDC.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        },
        error: (error: any) => {
          console.error('Erro ao obter aluno:', error);
          this.toastr.error('Erro ao obter aluno');
        }
      });

    });
    
  }

  async generateCompilado(): Promise<void> {
    try {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      // Pegar o nome do compilado
      const name = this.compilados[0].name ;
      
      // Criar o novo compilado
      const compilado_id = await this.createCompilado(name, formattedDate);

      // Formatar as váriavies pagamentoDiariaDeCurso e pagamentoHoraAula
      this.formatarPagamentoHoraAula(compilado_id);
      this.formatarDiariaDeCurso(compilado_id);

      // Inserir os dados nas planilhas pagamentoDiariaDeCurso e pagamentoHoraAula
      this.insertPagamentoHoraAula();
      this.insertPagamentoDiariaDeCurso();

      // Inserir o compilado_id nos processos que foram compilados para pagamento
      this.rfcs.forEach(rfc=>{
        rfc.compilado_id = compilado_id;
        this.rfcService.updateRFC(rfc).subscribe(
          () => {
            this.toastr.success("Usuário atualizado com sucesso!")
          },
          (error) => {
            this.toastr.error('Erro ao atualizar o RFC:',error)
            // Trate o erro conforme necessário
          }
        );
      })
      this.rpcs.forEach(rpc=>{
        rpc.compilado_id = compilado_id;
        this.rpcService.updateRpc(rpc).subscribe(
          () => {
            this.toastr.success("Usuário atualizado com sucesso!")
          },
          (error) => {
            this.toastr.error('Erro ao atualizar o RFC:',error)
            // Trate o erro conforme necessário
          }
        );
      })  

      this.clearValores();  
      this.getCompilados();
    } catch (error) {
      console.error('Erro ao gerar o compilado de pagamento:', error);
      this.toastr.error('Erro ao gerar o compilado de pagamento');
    }
  }


  
  clearValores():void{
    this.processos= [];
    this.alunos= [];
    this.docentes= [];
    this.totalHai= 0;
    this.valorTotalHai= 0;
    this.valorTotalHaiFormatado= "";
    this.totalDC= 0;
    this.valorTotalDC= 0;
    this.valorTotalDCFormatado= "";
    this.pagamentoHoraAula=[];
    this.pagamentoDiariaDeCurso=[];
    this.qtdProfessores= 0;;
    this.qtdAlunos= 0;
    this.uniqueProfessors=[];
    this.uniqueAlunos=[];
  }

  sumUniqueProfessors(): Observable<void> {
    return new Observable<void>((observer) => {
      const professorMap: { [userId: number]: { hai: number, haiValor: number, name: string, escolaridade: string } } = {};
  
      this.pagamentoHoraAula.forEach(pagamento => {
        const userId = pagamento.user_id;
        const hai = pagamento.hai;
        const haiValor = parseFloat(pagamento.haiValor);
  
        if (professorMap[userId]) {
          professorMap[userId].hai += hai;
          professorMap[userId].haiValor += haiValor;
        } else {
          // Encontrar o professor correspondente na lista de docentes
          const professor = this.docentes.find(docente => docente.usersId === userId);
          if (professor) {
            professorMap[userId] = { hai, haiValor, name: professor.name!, escolaridade: professor.escolaridade! };
          }
        }
      });
  
      this.uniqueProfessors = Object.keys(professorMap).map(userId => ({
        user_id: Number(userId),
        hai: professorMap[Number(userId)].hai,
        haiValor: professorMap[Number(userId)].haiValor,
        name: professorMap[Number(userId)].name,
        escolaridade: professorMap[Number(userId)].escolaridade
      }));
  
      const requests = this.uniqueProfessors.map(professor =>
        this.userService.getUserById(professor.user_id)
      );
  
      forkJoin(requests).subscribe(
        (professors: User[]) => {
          professors.forEach((professor, index) => {
            this.uniqueProfessors[index].mtcl = professor.mtcl;
          });
          observer.next();
          observer.complete();
        },
        (error) => {
          console.error('Erro ao obter usuários:', error);
          observer.error(error);
        }
      );
    });
  }
  
  sumUniqueAlunos():void{
    
  }

  downloadXls(): void {
    if(this.pagamentoHoraAula.length==0 && this.pagamentoDiariaDeCurso.length==0){
      this.formatarDiariaDeCurso(0);
      this.formatarPagamentoHoraAula(0);
    }

    if(this.pagamentoHoraAula.length==0){
      this.toastr.error("Esse compilado não apresenta professores para pagamento!")
      return
    }
    if(this.pagamentoDiariaDeCurso.length==0){
      this.toastr.error("Esse compilado não apresenta professores para pagamento!")
      this.formatarDiariaDeCurso(0);
      return
    }
    // Criar variavies com somatório para o XLS
    const sumUniqueProfessors$ = this.sumUniqueProfessors();
    const sumUniqueAlunos$ = this.sumUniqueAlunos();
    // Esperar até que as funções sumUniqueProfessors() e sumUniqueAlunos() sejam concluídas
    forkJoin({ sumUniqueProfessors$ }).subscribe(() => {          
      // Criação das planilhas a partir dos dados
      const wsPagamentoHoraAula: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.uniqueProfessors);
      const wsPagamentoDiariaDeCurso: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.pagamentoDiariaDeCurso);
    
      // Criação do livro de trabalho e adição das planilhas
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsPagamentoHoraAula, 'Rubrica01-0147');
      XLSX.utils.book_append_sheet(wb, wsPagamentoDiariaDeCurso, 'Rubrica01-0257');
    
      // Gerar o arquivo XLSX e fazer o download
      const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
      // Criar um blob para o arquivo
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
    
      // Criar um link para download e clicar nele programaticamente
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compilado_pagamentos.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
   
  }
  
  
  async insertPagamentoDiariaDeCurso(): Promise<void> {
    try {
      const response = await this.pagamentoDiariaDeCursoService.addPagamentoDiariaDeCurso(this.pagamentoDiariaDeCurso).toPromise();
      console.log('Pagamento de diária de curso inserido:', response);
    } catch (error) {
      console.error('Erro ao inserir pagamento de diária de curso:', error);
      throw error;
    }
  }

  async insertPagamentoHoraAula(): Promise<void> {
    try {
      const response = await this.pagamentoHoraAulaService.addPagamentoHoraAula(this.pagamentoHoraAula).toPromise();
      console.log('Pagamento de hora aula inserido:', response);
    } catch (error) {
      console.error('Erro ao inserir pagamento de hora aula:', error);
      throw error;
    }
  }
   getCompilados():void{
    this.compiladoPagamentoService.getCompiladosPagamento().subscribe({
      next: (compilados: CompiladoPagamento[]) => {
       this.compilados = compilados
       let compiladoAux: CompiladoPagamento={
        name: this.getCompiladoName(),
        date: "new",
        id:this.compilados[this.compilados.length-1].id!+1
       }
       this.compilados.push(compiladoAux)
       //Mudar o select para o compiladoAux]
       this.compilados.reverse();
       this.compiladoSelected = compiladoAux
      },
      error: (error: any) => {
        console.error('Erro ao obter RFCs:', error);
        this.toastr.error('Erro ao obter RFCs');
      }
    });
  }

   getCompiladoName(): string {
      const today = new Date();
      if (this.compilados && this.compilados.length > 0) {
        const ultimoCompilado = this.compilados[this.compilados.length - 1];
        const ultimoNomeCompilado = ultimoCompilado.name;
        const partesNome = ultimoNomeCompilado.split('-');
        let ultimoMes = parseInt(partesNome[0].trim());
        let novoMes: number;
        let novoAno: number;
  
        if (ultimoMes === 12) {
          novoMes = 1;
          novoAno = parseInt(partesNome[1].trim()) + 1;
        } else {
          novoMes = ultimoMes + 1;
          novoAno = parseInt(partesNome[1].trim());
        }
        const novoNome = `${novoMes.toString().padStart(2, '0')}-${novoAno}`;
        return novoNome;
      } else {
        const novoNome = `01-${today.getFullYear()}`;
        return novoNome;
      }
  }
  
  async createCompilado(nome: string, date: string): Promise<number> {
    try {
      const compilado = await this.compiladoPagamentoService.addCompiladoPagamento({ name: nome, date: date }).toPromise();
      if (compilado && compilado.insertId) {
        return compilado.insertId;
      } else {
        throw new Error('Erro ao criar o compilado de pagamento');
      }
    } catch (error) {
      console.error('Erro ao criar o compilado de pagamento:', error);
      throw error;
    }
  }
  

  formatarPagamentoHoraAula(compilado_id:number):void{
    this.pagamentoHoraAula = [];
    this.docentes.forEach(docente=>{
      if( docente && docente.usersId && docente.name  && docente.escolaridade && docente.horaAulaQtd && docente.horaAulaValor){
        let pagamentoHoraAulaAux: PagamentoHoraAula = {
          user_id : docente.usersId,
          compilado_id:compilado_id,
          name:docente.name,
          escolaridade:docente.escolaridade,
          hai: docente.horaAulaQtd,
          haiValor: docente.horaAulaValor.toString(),
          mes:"",
          procNum:""
        }
        this.pagamentoHoraAula.push(pagamentoHoraAulaAux)
      }
    })
  }
  formatarDiariaDeCurso(compilado_id:number):void{
    this.pagamentoDiariaDeCurso = [];
    this.alunos.forEach(aluno=>{
      if( aluno && aluno.user_id && aluno.name  && aluno.diariaDeCursoQtd && aluno.diariaDeCurso){
        let pagamentoDiariaDeCursoAux: PagamentoDiariaDeCurso = {
          user_id : aluno.user_id,
          compilado_id:compilado_id,
          name:aluno.name,
          quantidade: aluno.diariaDeCursoQtd,
          valor: aluno.diariaDeCurso.toString(),
          mes:"",
          procNum:""
        }
        this.pagamentoDiariaDeCurso.push(pagamentoDiariaDeCursoAux)
      }
    })

  }

  changeSelectCompilado(event: Event): void {

    const selectedId = Number((event.target as HTMLSelectElement).value);
    console.log((event.target as HTMLSelectElement).value);
    this.compiladoSelected = this.compilados.find(compilado => compilado.id === selectedId);
    console.log('Compilado selecionado:', this.compiladoSelected);
    this.clearValores();
    // Chamada ao serviço de pagamento de diária de curso
    this.pagamentoDiariaDeCursoService.getPagamentoByCompiladoId(selectedId).subscribe(
      pagamentosDiariaDeCurso => {
        // Lógica para tratar os pagamentos de diária de curso recebidos
        console.log('Pagamentos de diária de curso:', pagamentosDiariaDeCurso);
        this.pagamentoDiariaDeCurso = pagamentosDiariaDeCurso
      },
      error => {
        console.error('Erro ao obter pagamentos de diária de curso:', error);
      }
    );
  
    // Chamada ao serviço de pagamento de hora/aula
    this.pagamentoHoraAulaService.getPagamentoByCompiladoId(selectedId).subscribe(
      pagamentosHoraAula => {
        // Lógica para tratar os pagamentos de hora/aula recebidos
        console.log('Pagamentos de hora/aula:', pagamentosHoraAula);
        this.pagamentoHoraAula = pagamentosHoraAula
      },
      error => {
        console.error('Erro ao obter pagamentos de hora/aula:', error);
      }
    );

    // Chamada ao serviço de rfc
    this.rfcService.getRFCByCompiladoId(selectedId).subscribe(
      rfcs => {
        // Lógica para tratar os pagamentos de hora/aula recebidos
        console.log('rfcs:', rfcs);
        this.rfcs = rfcs
        // Chamada ao serviço de rfc
        this.rpcService.getRPCByCompiladoId(selectedId).subscribe(
          rpcs => {
            // Lógica para tratar os pagamentos de hora/aula recebidos
            console.log('rfcs:', rpcs);
            this.rpcs = rpcs
            this.combineProcessos();

          },
          error => {
            console.error('Erro ao obter pagamentos de hora/aula:', error);
          }
        );
      },
      error => {
        console.error('Erro ao obter pagamentos de hora/aula:', error);
      }
    );
  }


  

}
