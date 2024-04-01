import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/shared/service/authentication';
import { EditalService } from 'src/app/shared/service/editais_service';
import { InscricaoService } from 'src/app/shared/service/inscrition_service';
import { RoleService } from 'src/app/shared/service/roles_service';
import { UserCivilService } from 'src/app/shared/service/usersCivil_service';
import { Edital } from 'src/app/shared/utilitarios/edital';
import { Inscricao } from 'src/app/shared/utilitarios/inscricao';
import { Role } from 'src/app/shared/utilitarios/role';
import { UserCivil } from 'src/app/shared/utilitarios/userCivil';

@Component({
  selector: 'app-homologacao-inscricao',
  templateUrl: './homologacao-inscricao.component.html',
  styleUrls: ['./homologacao-inscricao.component.css']
})
export class HomologacaoInscricaoComponent implements OnInit {
    processos = [/* Array de objetos de processos */];
    inscricoes : Inscricao[]=[]; // Array de objetos de inscrições    
    processoSelecionado: any; // Variável para armazenar o processo selecionado
    editaisHomologar: Edital[] = [];
    editaisPendencias: Edital[] = [];
    telaInicial:boolean= true;
    todayDate: Date = new Date();
    usuariosInscritos: any[] = [];
    roles:Role[]=[];

    opcoesSituacao = ['Pendente', 'Homologada', 'Recusada'];

    constructor(
      private editalService: EditalService,
      private toastr: ToastrService,
      private inscritionService: InscricaoService,
      private userCivilService: UserCivilService,
      private authService: AuthenticationService,
      private roleService: RoleService

      ) { }

   

    ngOnInit(): void {
      this.getEditais();
      this.roleService.getRoles().subscribe(
        (roles: Role[]) => {
          this.roles = roles;
        },
        (error) => {
          console.log('Erro ao obter a lista de usuários:', error);
        }
      );
    }

     // Método para carregar inscrições ao selecionar um processo
     carregarInscricoes(edital: Edital): void {
      this.inscritionService.getInscricoesByDocument(edital.documentosCriadosId).subscribe({
        next: (inscritions: Inscricao[]) => {
            this.inscricoes = inscritions;
            this.telaInicial = false;
            this.processoSelecionado = this.inscricoes[0]?.procNum;
            inscritions.forEach(inscricao => {
              this.userCivilService.getUserCivilById(inscricao.userCivilId).subscribe({
                next: (userCivil: UserCivil) => {
                  const  userInscrito:any  = {...userCivil}; // Puxar valores de userCivil
                  userInscrito.situacao = inscricao.situacao;
                  userInscrito.documentosCriadosId = inscricao.documentosCriadosId;
                  userInscrito.inscricaoId = inscricao.id;
                  userInscrito.procNum = inscricao.procNum;
                  

                  // Formatar a propriedade birthdate para DD/MM/YYYY
                  if (userInscrito.birthdate) {
                    const date = new Date(userInscrito.birthdate);
                    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                    userInscrito.birthdate = formattedDate;
                  }
                  this.usuariosInscritos.push(userInscrito);

                },
                error: (error: any) => {
                  console.error('Erro ao obter editais:', error);
                  this.toastr.error("Erro ao obter informações do inscrito.");
                }
              });
            });
         

        },
        error: (error: any) => {
          console.error('Erro ao obter inscrições:', error);
          this.toastr.error("Nenhum inscrito até o momento!");
        }
      });
    }
    getUserRole():string{
      const user = this.authService.getUser();
      const role = this.roles.filter(role => user?.role_id === role.id);
      return role[0].nome
    }
  
    getEditais(): void {
      const role =  this.getUserRole();
      if(role){
        this.editalService.getEditaisByBBM(role).subscribe({
          next: (editais: Edital[]) => {
            // Map each edital to an observable and subscribe to each one
            editais.forEach(edital => {
              this.inscritionService.getInscricoesByDocument(edital.documentosCriadosId).subscribe({
                next: (inscritions: Inscricao[]) => {
                  edital.quantidadeInscritos = inscritions.length;
                  // Add the edital to both arrays
                  if (edital.pendenciasInscricoes == "Homologar")  {
                    this.editaisHomologar.push(edital);
                  } 
                  if (edital.pendenciasInscricoes == "Pendencia")  {
                    this.editaisPendencias.push(edital);
                  } 
                },
                error: (error: any) => {
                  edital.quantidadeInscritos = 0;
                  // Add the edital to both arrays
                  if (edital.pendenciasInscricoes == "Homologar")  {
                    this.editaisHomologar.push(edital);
                  } 
                  if (edital.pendenciasInscricoes == "Pendencia")  {
                    this.editaisPendencias.push(edital);
                  } 
  
                },
                complete: () => {
                  // You can add any additional logic here after each observable completes
                }
              });
            });
      
            // Additional logic after all observables are created
          },
          error: (error: any) => {
            console.error('Erro ao obter editais:', error);
            this.toastr.error('Erro ao obter editais');
          }
        });
      }
    
    }
    

    homologarInscricao(usuarioInscrito: any): void {
      const objInscricao: Inscricao = {
        id: usuarioInscrito.inscricaoId,
        procNum: usuarioInscrito.procNum,
        documentosCriadosId: usuarioInscrito.documentosCriadosId,
        userCivilId: usuarioInscrito.id,
        situacao: "Homologada",
        mensagem: ""
      };
      this.inscritionService.updateInscricao(objInscricao).subscribe({
        next: () => {
          // Lógica adicional se necessário
          usuarioInscrito.situacao = "Homologada";

        },
        error: (error: any) => {
          console.error('Erro ao atualizar inscrição:', error);
          this.toastr.error("Erro ao homologar inscrição.");
        }
      });
    }
    
    recusarInscricao(usuarioInscrito: any): void {
      const objInscricao: Inscricao = {
        id: usuarioInscrito.inscricaoId,
        procNum: usuarioInscrito.procNum,
        documentosCriadosId: usuarioInscrito.documentosCriadosId,
        userCivilId: usuarioInscrito.id,
        situacao: "Recusada",
        mensagem: "Colocar mensagem"
      };
    
      this.inscritionService.updateInscricao(objInscricao).subscribe({
        next: () => {
          // Lógica adicional se necessário
          usuarioInscrito.situacao = "Recusada";

        },
        error: (error: any) => {
          console.error('Erro ao atualizar inscrição:', error);
          this.toastr.error("Erro ao recusar inscrição.");
        }
      });
    }
    

  
  formatarDate(date: string): Date {
    const partesDaData = date.split('/');
    const dataNoFormatoCorreto = `${partesDaData[2]}-${partesDaData[1]}-${partesDaData[0]}`;
    
    // Criar uma nova instância de Date considerando o fuso horário
    const novaData = new Date(dataNoFormatoCorreto + 'T00:00:00Z');
  
    // Somar 5 horas
    novaData.setHours(novaData.getHours() + 5);
  
    return novaData;
  }

  
  
    
  
  

}
