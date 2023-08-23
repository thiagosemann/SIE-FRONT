import { Component, OnInit } from '@angular/core';
import { GoogleScriptService } from '../../../shared/service/googleScriptService';
import { PgeService } from 'src/app/shared/service/pgeService';
import { ContentComponent } from '../../content.component';
import { CursoService } from '../../../shared/service/objetosCursosService'; // Importe o CursoService aqui
import { Curso } from '../../../shared/utilitarios/objetoCurso';
import { ToastrService } from 'ngx-toastr';


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

  constructor(private contentComponent: ContentComponent, 
              private cursoService: CursoService,
              private pgeService: PgeService
              ) {}

  ngOnInit() {
    this.pgeService.getPge().subscribe(data => {
      this.data = data;
      this.applyFilters();
    });
  }
  
  applyFilters() {
    this.filteredData = this.data.filter(item => {
      return item.situacao !== 'FINALIZADO' && item.situacao !== 'EXCLUÍDO' && item.situacao !== 'CANCELADO' && item.situacao !== 'AUTORIZADO';
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

  selectCourse(item: any) {
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
    }else {
      this.courseType = '';
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
      numeroProcesso:item.procNum,
      pge:item
    };
    return novoCurso
  }
  

}

