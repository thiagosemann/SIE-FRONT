import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EditalService } from 'src/app/shared/service/editais_service';
import { DocumentosCriadosService } from 'src/app/shared/service/documentosCriados_service';
import { Edital } from 'src/app/shared/utilitarios/edital';
import { PgeService } from 'src/app/shared/service/pge_service';

@Component({
  selector: 'app-abertura-processo',
  templateUrl: './abertura-processo.component.html',
  styleUrls: ['./abertura-processo.component.css']
})
export class AberturaProcessoComponent implements OnInit {
  editais: Edital[] = [];
  searchTerm: string = '';  // Para a caixa de pesquisa principal
  addAuth: string = '';  // Para a caixa de pesquisa AUTH
  loading: boolean = false;  // Variável para controlar o estado de carregamento
  telaEdicao: boolean = false;
  editForm: FormGroup;
  sgpe: string = ''; 
  dataEntrada: string = ''; 
  editedEditalId: number | undefined;
  editedEditalNumeroProcesso: string | undefined;
  editedEditalPgeId :number | undefined;
  editedDocumentoCriadoId :number | undefined;

  constructor(private formBuilder: FormBuilder, 
              private documentosCriadosService: DocumentosCriadosService,
              private toastr: ToastrService,
              private editalService: EditalService,
              private pgeService: PgeService
              ) 
              
              {
                this.editForm = this.formBuilder.group({
                  auth: ['', Validators.required],
                  numeroProcesso: ['', Validators.required],
                  statusAssinatura: ['', Validators.required],
                  statusPublicacao: ['', Validators.required],
                  statusNotaEletronica: ['', Validators.required],
                  statusSgpe: ['', Validators.required],
                  statusNb: ['', Validators.required],
                  statusFinalizacao: ['', Validators.required],
                  sgpe: ['', Validators.required],
                  dataEntrada: ['', Validators.required],
                  sigla: ['', Validators.required],
                  localAtiMunicipio: ['', Validators.required],
                  bbm: ['', Validators.required],
                  startInscritiondate: ['', Validators.required],
                  endInscritiondate: ['', Validators.required],
                  iniCur: ['', Validators.required],
                  fimCur: ['', Validators.required],
                  
           
                });
              }

  ngOnInit(): void {
    this.getEditais();
  }


  addEdital(): void {
    this.loading = true;
    if (this.addAuth === "") {
      // Exibir mensagem de erro
      this.toastr.info("Digite um código de autenticação!");
      this.loading = false;
      return;
    }
    // Verificar se o edital com o mesmo auth já existe na lista
    const authExistente = this.editais.find(edital => edital.auth === this.addAuth); 
    if (authExistente) {
      // Exibir mensagem de erro
      this.toastr.error("Já existe um edital com este AUTH na lista!");
      this.loading = false;
      return;
    }
    if (this.sgpe === "") {
      // Exibir mensagem de erro
      this.toastr.info("Digite o sgpe!");
      this.loading = false;
      return;
    }
    if (this.dataEntrada === "") {
      // Exibir mensagem de erro
      this.toastr.info("Digite a data de entrada no sgpe!");
      this.loading = false;
      return;
    }


    this.documentosCriadosService.getCursoByAuth(this.addAuth).subscribe({
      next: (resp: any) => {
        console.log(resp)
        const novoEdital: Edital = {
          documentosCriadosId: resp.id,
          numeroProcesso: resp.dados.numeroProcesso,
          statusAssinatura: "Pendente",
          statusPublicacao: "Pendente",
          statusNotaEletronica: "Pendente",
          statusSgpe: "Pendente",
          statusNb: "Pendente",
          statusFinalizacao: "Pendente",
          auth: resp.dados.auth ,
          sgpe: this.sgpe,
          dataEntrada: this.formatDateFromInput(this.dataEntrada),
          sigla: resp.dados.sigla,
          localAtiMunicipio: resp.dados.localAtiMunicipio,
          bbm: resp.dados.bbm,
          startInscritiondate:  resp.dados.startInscritiondate,
          endInscritiondate:  resp.dados.endInscritiondate,
          iniCur: resp.dados.iniCur,
          fimCur: resp.dados.fimCur,
          vagas:resp.dados.pge.vagas? resp.dados.pge.vagas : resp.dados.pge.vagasMin,
          pgeId:resp.id_pge
        };
        console.log(novoEdital)

        // Verificar se o edital com o mesmo auth já existe na lista
        const numeroProcesso = this.editais.find(edital => edital.numeroProcesso === resp.dados.numeroProcesso); 
        if (numeroProcesso) {
          // Exibir mensagem de erro
          this.toastr.error("Já existe um edital com este número de processo na lista!");
          this.loading = false;
          return;
        }
        console.log(novoEdital)

        // Chamar o serviço para criar o edital
        this.editalService.createEdital(novoEdital).subscribe({
          next: (editalCriado: any) => {
            console.log(editalCriado)
            novoEdital.id = editalCriado.insertId;
            this.editais.push(novoEdital);
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

  deleteEdital(edital: Edital): void {
    const confirmDelete = confirm('Tem certeza que deseja excluir a entrada do edital do processo '+edital.numeroProcesso+' ?');
    if (confirmDelete) {
      // Lógica de exclusão
      // Remova o edital da lista
      const index = this.editais.indexOf(edital);
      if (index !== -1) {
        this.editais.splice(index, 1);
      }
      
      if(edital.pgeId){
        const pgeObj = {
          situacao: "PREVISTO",
          editalId: null,
          documentoCriadoId: null,
        };
  
        this.pgeService.updatePgeById(edital.pgeId, pgeObj).subscribe({
          next: (pgeResult: any) => {
            // Handle PGE update success
            if(edital && edital.id){
              // Chame a função de serviço para excluir o edital no backend
              this.editalService.deleteEditalById(edital.id).subscribe(
                () => {
                  this.toastr.success('Edital excluído com sucesso!');
                },
                (error) => {
                  console.error('Erro ao excluir edital:', error);
                  this.toastr.error('Erro ao excluir edital');
                  // Se houver um erro no backend, adicione o edital de volta à lista para evitar inconsistências
        
                }
              );
            }
          },
          error: (pgeError: any) => {
            console.error('Erro ao atualizar PGE:', pgeError);
            this.toastr.error('Erro ao atualizar PGE');
          }
        });
      }


      

    }
  }
  
  cancelEdit(): void {
    // Volte para a tela principal sem salvar as alterações
    this.telaEdicao = false;
  }

  updateEdital(): void {
    // Get the form data
    const updatedEditalData = this.editForm.value;
    updatedEditalData.id = this.editedEditalId;
    updatedEditalData.numeroProcesso = this.editedEditalNumeroProcesso;
    this.editalService.updateEdital(updatedEditalData).subscribe({
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
        this.toastr.success("Edital atualizado!")
        const index = this.editais.findIndex(edital => edital.id === this.editedEditalId);
        console.log(index)
        this.editais[index].statusAssinatura = updatedEditalData.statusAssinatura;
        this.editais[index].statusPublicacao = updatedEditalData.statusPublicacao;
        this.editais[index].statusNotaEletronica = updatedEditalData.statusNotaEletronica;
        this.editais[index].statusSgpe = updatedEditalData.statusSgpe;
        this.editais[index].statusNb = updatedEditalData.statusNb;
        this.editais[index].statusFinalizacao = updatedEditalData.statusFinalizacao;
        const pgeObj = {
          situacao: "",
          editalId: this.editedEditalId,
          documentoCriadoId: this.editedDocumentoCriadoId,
        };

        if(this.editedEditalPgeId){
          if(updatedEditalData.statusFinalizacao =="Finalizado" ){
            pgeObj.situacao = "AUTORIZADO";
            this.updatePgeOnServer(this.editedEditalPgeId,pgeObj)
          }else{
            pgeObj.situacao = "PREVISTO";
            this.updatePgeOnServer(this.editedEditalPgeId,pgeObj)
          }
        }
        
      }
    });
  }
  updatePgeOnServer(pgeId:number,pgeObj:any): void {

    this.pgeService.updatePgeById(pgeId, pgeObj).subscribe({
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

  startEditing(edital: any): void {
    this.telaEdicao = true;
    this.editedEditalId = edital.id;
    this.editedEditalNumeroProcesso = edital.numeroProcesso;
    this.editedEditalPgeId = edital.pgeId;
    this.editedDocumentoCriadoId = edital.documentosCriadosId;
    
    this.editForm.patchValue({
      auth: edital.auth,
      numeroProcesso: edital.numeroProcesso,
      statusAssinatura: edital.statusAssinatura,
      statusPublicacao: edital.statusPublicacao,
      statusNotaEletronica: edital.statusNotaEletronica,
      statusSgpe: edital.statusSgpe,
      statusNb: edital.statusNb,
      statusFinalizacao: edital.statusFinalizacao,
      sgpe: edital.sgpe,
      dataEntrada: this.formatDateForInput(edital.dataEntrada),
      sigla: edital.sigla,
      localAtiMunicipio: edital.localAtiMunicipio,
      bbm: edital.bbm,
      startInscritiondate: this.formatDateForInput(edital.startInscritiondate),
      endInscritiondate: this.formatDateForInput(edital.endInscritiondate),
      iniCur: this.formatDateForInput(edital.iniCur),
      fimCur: this.formatDateForInput(edital.fimCur),
      
    });
    this.editForm.disable();
    this.editForm.get('statusAssinatura')?.enable(); 
    this.editForm.get('statusPublicacao')?.enable(); 
    this.editForm.get('statusNotaEletronica')?.enable(); 
    this.editForm.get('statusSgpe')?.enable(); 
    this.editForm.get('statusNb')?.enable(); 
    this.editForm.get('statusFinalizacao')?.enable(); 

  }

  getEditais(): void {
    this.editalService.getAllEditais().subscribe({
      next: (editais: Edital[]) => {
        this.editais = editais;

      },
      error: (error: any) => {
        console.error('Erro ao obter editais:', error);
        this.toastr.error('Erro ao obter editais');
      }
    });
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
  formatDateFromInput(date: string): string {

    const dia = date[8] + date[9]; 
    const mes = date[5] + date[6];
    const ano = date[0] + date[1] + date[2] + date[3];
    
    return `${dia}/${mes}/${ano}`

  }


  

}
