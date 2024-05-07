import { Component, OnInit } from '@angular/core';
import { GoogleScriptService } from '../../../../shared/service/googleScriptService';
import { PgeService } from 'src/app/shared/service/pge_service';
import { ContentComponent } from '../../../content.component';
import { CursoService } from '../../../../shared/service/objetosCursosService'; // Importe o CursoService aqui
import { Curso } from '../../../../shared/utilitarios/objetoCurso';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/shared/utilitarios/user';
import { AuthenticationService } from 'src/app/shared/service/authentication';
import { RoleService } from 'src/app/shared/service/roles_service';
import { Role } from 'src/app/shared/utilitarios/role';
import { EditalService } from 'src/app/shared/service/editais_service';
import { Edital } from 'src/app/shared/utilitarios/edital';


@Component({
  selector: 'app-pge',
  templateUrl: './pge.component.html',
  styleUrls: ['./pge.component.css']
})
export class PgeComponent implements OnInit {
  data: any[] = [];
  filteredData: any[] = [];
  courseType = 'aberturaCursoMilitar';
  skeletonItems: any[] = Array(12).fill({}); // Adjust the number of skeleton rows as needed
  role ='';
  roles:Role[]=[];

  constructor(private contentComponent: ContentComponent, 
              private cursoService: CursoService,
              private pgeService: PgeService,
              private authService: AuthenticationService,
              private editalService: EditalService,
              private toastr: ToastrService,
              private roleService: RoleService

              ) {}

  ngOnInit() {
    this.roleService.getRoles().subscribe(
      (roles: Role[]) => {
        this.roles = roles;
        const role = this.getUserRole();
        this.role = role;
        this.pgeService.getPge().subscribe(data => {
          this.data = data;
          this.data.forEach(curso=>{
            if(curso.situacao == "ANDAMENTO"){
              this.editalService.getEditaisByProcNum(curso.procNum).subscribe({
                next: (editais: Edital[]) => {
                    if (editais && editais.length > 0) {
                        const inicio = this.convertStringToDate(editais[0].iniCur);
                        const termino = this.convertStringToDate(editais[0].fimCur);
                        if (inicio && termino) {
                            const diferenca = termino.getTime() - inicio.getTime(); // Obtém a diferença em milissegundos
                            const quatroMeses = 4 * 30 * 24 * 60 * 60 * 1000;
                            if (diferenca > quatroMeses) {
                                curso.parcial = true;
                            }
                        }
                    }
                },
                error: (error: any) => {
                    console.error('Erro ao obter editais:', error);
                    this.toastr.error('Erro ao obter editais');
                },
            });
            }
          })
          if(this.role!=="admin"){
            this.applyFilters();

          }else{
            this.filteredData = data;
          }
        });
      },
      (error) => {
        console.log('Erro ao obter a lista de usuários:', error);
      }
    );


  }

  
  convertStringToDate(dateString: string): Date | null {
    const parts = dateString.split('/');
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Mês é base 0
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }
    return null; // Retorna null se a string não estiver no formato esperado
  }


  getUserRole():string{
    const user = this.authService.getUser();
    const role = this.roles.filter(role => user?.role_id === role.id);
    return role[0].nome
  }
  
  applyFilters() {
    this.filteredData = this.data.filter(item => {
      return item.situacao !== 'FINALIZADO' && item.situacao !== 'EXCLUÍDO' && item.situacao !== 'CANCELADO' && item.situacao !== 'AUTORIZADO';
    });
    this.filteredData = this.filteredData.filter(item => {
      return item.bbm == this.role;
    });

    this.filteredData = this.filteredData.filter(item => {
      return !item.procNum.includes("24.000");
    });
  }

  getButtonClassPublico(situacao: string): string {
    if (situacao === 'PREVISTO') {
      return 'previsto-button';
    } else if (situacao === 'AUTORIZADO') {
      return 'autorizado-button';
    } else if (situacao === 'ANDAMENTO') {
      return 'andamento-button';
    }else if (situacao === 'FINALIZADO') {
      return 'finalizado-button';
    }else {
      return '';
    }
  }

  selectCourse(item: any,buttonText:string) {
    if(this.role !="--"){
      const firstThreeDigits = item.procNum.substr(0, 3);
      const firstFiveDigits = item.procNum.substr(0, 5);
      if (firstThreeDigits === '1.9') {
        this.handleCurso(item,"TreinamentoMilitar",buttonText);
      } else if (
        firstThreeDigits === '1.1' ||
        firstThreeDigits === '1.2' ||
        firstThreeDigits === '1.3' ||
        firstThreeDigits === '1.4' ||
        firstThreeDigits === '1.5' ||
        firstThreeDigits === '1.6' ||
        firstThreeDigits === '1.7' ||
        firstThreeDigits === '1.8'
      ) {
        this.handleCurso(item,"CursoMilitar",buttonText);
      } else if (firstFiveDigits === '2.2.1') {
        this.handleCurso(item,"TBAE",buttonText);
      }else if (firstFiveDigits === '2.2.2' || firstFiveDigits === '2.2.3' ) {
        this.handleCurso(item,"TBC",buttonText);
      }else if (item.sigla === 'CBC' ) {
        this.handleCurso(item,"CBC",buttonText);
      }else if (item.sigla === 'CGVCV' ) {
        this.handleCurso(item,"CGVCV",buttonText);
      }else if (item.sigla === 'CRGVCV' ) {
        this.handleCurso(item,"CRGVCV",buttonText);
      }else if (item.sigla === 'CGVCVRio' ) {
        this.handleCurso(item,"CGVCVRio",buttonText);
      }else if (item.sigla === 'CRGVCVRio' ) {
        this.handleCurso(item,"CRGVCVRio",buttonText);
      }else {
        this.toastr.error("Módulo ainda não criado.")
        this.courseType = '';
      }
    }

    
    
  }

async handleCurso(item: any, name: string,buttonText:string){
  const cursoExistente = this.getExistingCurso(item.id);
  if(cursoExistente && cursoExistente.type){
    this.cursoService.setIdCursoEscolhido(item.id); // Se o curso existir somente seta novamente o ID do curso escolhido.
    this.contentComponent.alterarCourseType(cursoExistente.type);
  }else{
    let deRio =false;
    if(name == "CGVCVRio" || name == "CRGVCVRio"){ 
      deRio = true;
    }
    const novoCurso: Curso = this.createNewCursoObj(item,deRio)
    this.setNovoCursoType(novoCurso, item.situacao, name,buttonText);
    const isHomologadoOrNotCapacitacao = await this.cursoService.isHomologado(item.sigla,name)
    if(isHomologadoOrNotCapacitacao){
      this.cursoService.adicionarCurso(novoCurso);
      this.cursoService.setIdCursoEscolhido(item.id);
      this.cursoService.inserirPropriedadesHomologadoCursoEscolhido()
      if(novoCurso.type){
        this.contentComponent.alterarCourseType(novoCurso.type);
      }
    }
  }
}
  
  private getExistingCurso(id: number): Curso | undefined {
    const cursos = this.cursoService.getCursos();
    return cursos.find(curso => curso.id === id);
  }
  
  private setNovoCursoType(novoCurso: Curso, situacao: string, name: string,buttonText:string) {
    if (buttonText === 'Abrir') {
      novoCurso.type = `abertura${name}`;
    } else if (buttonText === 'Parcial') {
      novoCurso.type = `parcial`;
    }else if(buttonText === 'Encerrar'){
      novoCurso.type = `encerramento${name}`;
    }
  }
  
  createNewCursoObj(item: any,rio:boolean): Curso{
    const novoCurso: Curso = {
      id: item.id,
      type: '',
      bbm:item.bbm,
      sigla: item.sigla,
      nomeCurso: item.nome,
      haCurso:item.ha,
      haiCurso:item.hai,
      numeroProcesso:item.procNum,
      pge:item
    };
    if(rio){
      novoCurso.deRio= "de Rio";
      novoCurso.derio= "de rio";
      novoCurso.DERIO= "DE RIO";
      
    }else{
      novoCurso.deRio= "";
      novoCurso.derio= ""; 
      novoCurso.DERIO= ""; 
      
    }
    return novoCurso
  }
  

}

