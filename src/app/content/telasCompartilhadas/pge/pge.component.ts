import { Component, OnInit } from '@angular/core';
import { GoogleScriptService } from '../../../shared/service/googleScriptService';
import { PgeService } from 'src/app/shared/service/pge_service';
import { ContentComponent } from '../../content.component';
import { CursoService } from '../../../shared/service/objetosCursosService'; // Importe o CursoService aqui
import { Curso } from '../../../shared/utilitarios/objetoCurso';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/shared/utilitarios/user';
import { AuthenticationService } from 'src/app/shared/service/authentication';


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

  constructor(private contentComponent: ContentComponent, 
              private cursoService: CursoService,
              private pgeService: PgeService,
              private authService: AuthenticationService,
              private toastr: ToastrService
              ) {}

  ngOnInit() {
    const user =  this.authService.getUser();
    if(user){
      this.role = user.role;
    }
    this.pgeService.getPge().subscribe(data => {
      this.data = data;
      if(this.role!=="admin"){
        this.applyFilters();
      }else{
        this.filteredData = data;
      }
    });

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

  getActionButtonText(situacao: string): string {
    if (situacao === 'ANDAMENTO') {
      return 'Encerrar';
    } else if (situacao === 'PREVISTO') {
      return 'Abrir'; // COLOCAR CONTINUAR SE JÀ TIVER COMEÇADO
    } else {
      return '';
    }
  }
  getButtonClass(situacao: string): string {
    if (situacao === 'ANDAMENTO') {
      return 'encerrar-button';
    } else if (situacao === 'PREVISTO') {
      return 'abrir-button';
    } else {
      return '';
    }
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

  selectCourse(item: any) {
    if(this.role !="--"){
      const firstThreeDigits = item.procNum.substr(0, 3);
      const firstFiveDigits = item.procNum.substr(0, 5);
      console.log(firstFiveDigits)
      if (firstThreeDigits === '1.9') {
        this.handleCurso(item,"TreinamentoMilitar");
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
        this.handleCurso(item,"CursoMilitar");
      } else if (firstFiveDigits === '2.2.1') {
        this.handleCurso(item,"TBAE");
      }else if (firstFiveDigits === '2.2.2' || firstFiveDigits === '2.2.3' ) {
        this.handleCurso(item,"TBC");
      }else if (firstFiveDigits === '2.1.2' ) {
        this.handleCurso(item,"CBC");
      }else {
        this.toastr.error("Módulo ainda não criado.")
        this.courseType = '';
      }
    }

    
    
  }

async handleCurso(item: any, name: string){
  const cursoExistente = this.getExistingCurso(item.id);
  if(cursoExistente && cursoExistente.type){
    this.cursoService.setIdCursoEscolhido(item.id); // Se o curso existir somente seta novamente o ID do curso escolhido.
    this.contentComponent.alterarCourseType(cursoExistente.type);
  }else{
    const novoCurso: Curso = this.createNewCursoObj(item);
    this.setNovoCursoType(novoCurso, item.situacao, name);
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
  
  private setNovoCursoType(novoCurso: Curso, situacao: string, name: string) {
    if (situacao === 'PREVISTO') {
      novoCurso.type = `abertura${name}`;
    } else if (situacao === 'ANDAMENTO') {
      novoCurso.type = `encerramento${name}`;
    }
  }
  
  createNewCursoObj(item: any): Curso{
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
    return novoCurso
  }
  

}

