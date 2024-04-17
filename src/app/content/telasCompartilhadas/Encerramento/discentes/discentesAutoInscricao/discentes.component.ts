import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/shared/service/authentication';
import { EditalService } from 'src/app/shared/service/editais_service';
import { InscricaoService } from 'src/app/shared/service/inscrition_service';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { RoleService } from 'src/app/shared/service/roles_service';
import { UserCivilService } from 'src/app/shared/service/usersCivil_service';
import { Discente } from 'src/app/shared/utilitarios/discente';
import { Edital } from 'src/app/shared/utilitarios/edital';
import { Inscricao } from 'src/app/shared/utilitarios/inscricao';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';
import { Role } from 'src/app/shared/utilitarios/role';
import { UserCivil } from 'src/app/shared/utilitarios/userCivil';

@Component({
  selector: 'app-discentes',
  templateUrl: './discentes.component.html',
  styleUrls: ['./discentes.component.css']
})
export class DiscentesComponent  implements OnInit {
  editais: Edital[] = [];
  inscricoes : Inscricao[]=[]; // Array de objetos de inscrições    
  roles:Role[]=[];
  cursoEscolhido: Curso | undefined ; 
  discentes: Discente[]=[];
  discentesArray: any[]=[];
  usuariosComPendencias: any[] = [];
  alunosHomologadosView : boolean = true;
  editalPendenciaVew:boolean=false;
  pendencia:string | undefined="";
  buttonAlunosText:string = "Alunos não homologados";
  textoTabela:string = "Alunos inscritos no curso";
  
  constructor(
    private editalService: EditalService,
    private toastr: ToastrService,
    private inscritionService: InscricaoService,
    private authService: AuthenticationService,
    private roleService: RoleService,
    private cursoService: CursoService,
    private userCivilService: UserCivilService


    ) { }

    ngOnInit(): void {
      this.cursoEscolhido = this.cursoService.getCursoEscolhido();
      this.roleService.getRoles().subscribe(
        (roles: Role[]) => {
          this.roles = roles;
          this.getEditais();

        },
        (error) => {
          console.log('Erro ao obter a lista de usuários:', error);
        }
      );
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
              if(edital.numeroProcesso == this.cursoEscolhido?.numeroProcesso){
                console.log(edital)
                if(edital.pendenciasInscricoes && edital.pendenciasInscricoes=="Finalizado"){
                  this.inscritionService.getInscricoesByDocument(edital.documentosCriadosId).subscribe({
                    next: (inscritions: Inscricao[]) => {
                      this.inscricoes = inscritions
                      inscritions.forEach(inscricao=>{
                        this.createAluno(inscricao)
                      })
                      this.enviarDadosCursoEscolhido();
                      console.log(this.cursoEscolhido)
                    },
                    error: (error: any) => {
       
                    },
                    complete: () => {
                      // You can add any additional logic here after each observable completes
                    }
                  });

                }else{
                  this.toastr.error("Esse processo possui pendências nas inscrições no edital")
                  this.pendencia = edital.pendenciasInscricoes
                }

              }
            });
          },
          error: (error: any) => {
            console.error('Erro ao obter editais:', error);
            this.toastr.error('Erro ao obter editais');
          }
        });
      }
    
    }


    createAluno(inscricao:Inscricao):void{
      this.userCivilService.getUserCivilById(inscricao.userCivilId).subscribe({
        next: (userCivil: UserCivil) => {
          const  userInscrito:any  = {}; // Puxar valores de userCivil
          userInscrito.situacaoInscricao = inscricao.situacao;
          userInscrito.documentosCriadosId = inscricao.documentosCriadosId;
          userInscrito.inscricaoId = inscricao.id;
          userInscrito.procNum = inscricao.procNum;
          userInscrito.excluido = false;
          userInscrito.desistente = false;
          userInscrito.name = userCivil.fullName;
          userInscrito.userCivil_id = userCivil.id;
          userInscrito.cpf = userCivil.cpf ;
          userInscrito.birthdate = userCivil.birthdate ;
          userInscrito.motivoExcluido = "";
          userInscrito.motivoDesistente = "";
          userInscrito.type = "Externo";
          if (userInscrito.birthdate) {
            const date = new Date(userInscrito.birthdate);
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            userInscrito.birthdate = formattedDate;
          }
          if(userInscrito.situacaoInscricao =="Homologada"){
            this.discentes.push(userInscrito);
          }else if(userInscrito.situacaoInscricao =="Recusada" || userInscrito.situacaoInscricao =="Pendente"  ){
            this.usuariosComPendencias.push(userInscrito);
          }

          console.log(this.usuariosComPendencias)
        },
        error: (error: any) => {
          console.error('Erro ao obter editais:', error);
          this.toastr.error("Erro ao obter informações do inscrito.");
        }
      });
    }

    trocarAlunos(boolean:boolean):void{
      this.alunosHomologadosView = boolean;
    }
    clearValueIfDisabled(user: any) {
      if (!user.excluido ) {
        user.motivoExcluido = '';
      }else{
        user.motivoExcluido = 'Falecimento';
      }
      if (!user.desistente ) {
        user.motivoDesistente = '';
      }else{
        user.motivoDesistente = 'Não compareceu ao curso.';
  
      }
      console.log(this.discentes)
    }

    createArrayCivil(): void {
      this.discentesArray = [];
      // Cria o array com as informações dos militares
      this.discentes.forEach(discente => {
        this.discentesArray.push([
          "--",
          "EXTERNO",
          discente.cpf,
          discente.name,
          "Faltas",
          "Nota",
          "Exame Final",
          "Situação"
        ]);
      });
    }

    enviarDadosCursoEscolhido(){
      this.createArrayCivil();
      this.cursoService.setAtributoByCursoEscolhidoID('discentesCivisExternos',this.discentes);
      this.cursoService.setAtributoByCursoEscolhidoID('discentesCivisExternosArray',this.discentesArray);
      
    }
    
}
