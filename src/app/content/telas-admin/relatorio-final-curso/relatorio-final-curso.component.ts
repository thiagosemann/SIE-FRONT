import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DocumentosCriadosService } from 'src/app/shared/service/documentosCriados_service';
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
  constructor(private rfcService:RFCService, private toastr: ToastrService, private documentosCriadosService: DocumentosCriadosService  ){}

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
}
