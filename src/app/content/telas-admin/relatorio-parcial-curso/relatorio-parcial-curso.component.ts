import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DocumentosCriadosService } from 'src/app/shared/service/documentosCriados_service';
import { PgeService } from 'src/app/shared/service/pge_service';
import { RFCService } from 'src/app/shared/service/rfc_service';
import { rpcService } from 'src/app/shared/service/rpc_service';
import { RPC } from 'src/app/shared/utilitarios/rpc';

@Component({
  selector: 'app-relatorio-parcial-curso',
  templateUrl: './relatorio-parcial-curso.component.html',
  styleUrls: ['./relatorio-parcial-curso.component.css']
})
export class RelatorioParcialCursoComponent implements OnInit {
  searchTerm: string = '';  // Para a caixa de pesquisa principal
  addAuth: string = '';  // Para a caixa de pesquisa AUTH
  loading: boolean = false;  // Variável para controlar o estado de carregamento
  dataEntrada: string = ''; 
  rpcs:RPC[]=[];
  editForm: FormGroup;
  editedRFCId: number | undefined;
  editedRFCNumeroProcesso: string | undefined;
  editedRFCPgeId :number | undefined;
  editedDocumentoCriadoId :number | undefined;

  constructor(private rpcService:rpcService,
              private toastr: ToastrService,
              private documentosCriadosService: DocumentosCriadosService,
              private formBuilder: FormBuilder,
              private pgeService: PgeService)
  {
    this.editForm = this.formBuilder.group({
      auth: ['', Validators.required],
      numeroProcesso: ['', Validators.required],
      sgpe: ['', Validators.required],
      haCurso: ['', Validators.required],
      haiCurso: ['', Validators.required],
      dataEntrada: ['', Validators.required],
      sigla: ['', Validators.required],
      bbm: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getRPCs();
  }

  getRPCs(): void {
    this.rpcService.getRpcs().subscribe({
      next: (rpcs: RPC[]) => {
        this.rpcs = rpcs;
        console.log(this.rpcs)
      },
      error: (error: any) => {
        console.error('Erro ao obter RFCs:', error);
        this.toastr.error('Erro ao obter RFCs');
      }
    });
  }

  addRPC():void{
    this.loading = true;
    if (this.addAuth === "") {
      // Exibir mensagem de erro
      this.toastr.info("Digite um código de autenticação!");
      this.loading = false;
      return;
    }
    // Verificar se o edital com o mesmo auth já existe na lista
    const authExistente = this.rpcs.find(rpc => rpc.auth === this.addAuth); 
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
        if(resp.tipo!="parcial"){
          // Exibir mensagem de erro
          this.toastr.info("Esse autenticação não pertence a uma parcial!");
          this.loading = false;
          return;
        }
       const novoRPC : RPC={
          documentosCriadosId: resp.id,
          numeroProcesso: resp.dados.numeroProcesso,
          auth: resp.auth,
          dataEntrada:  this.formatDateFromInput(this.dataEntrada),
          sigla: resp.dados.sigla,
          compiladoHoraAula: false,
          compilado_id: 0,
          bbm:resp.dados.bbm,
          observacoes: ""
        }
        // Chamar o serviço para criar o edital
        this.rpcService.addRpc(novoRPC).subscribe({
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
  deleteRpc(rpc:RPC):void{

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
}
