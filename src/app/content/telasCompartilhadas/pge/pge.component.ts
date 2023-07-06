import { Component, OnInit } from '@angular/core';
import { GoogleScriptService } from '../../../shared/service/googleScriptService';
import { PgeService } from 'src/app/shared/service/pgeService';
import { ContentComponent } from '../../content.component';
import { CursoService } from '../../../shared/service/objetosCursosService'; // Importe o CursoService aqui
import { Curso } from '../../../shared/utilitarios/objetoCurso';


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

  constructor(private googleService: GoogleScriptService, 
              private contentComponent: ContentComponent, 
              private cursoService: CursoService,
              private pgeService: PgeService) {}

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
  
    if (firstThreeDigits === '1.9') {
      this.handleTreinamentoMilitar();
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
      this.handleCursoMilitar(item);
    } else {
      this.courseType = '';
    }
  }
  
  handleTreinamentoMilitar() {
    this.contentComponent.alterarCourseType('aberturaTreinamentoMilitar');
  }
  
  handleCursoMilitar(item: any) {
    const cursos = this.cursoService.getCursos();
    const cursoExistente = cursos.find(curso => curso.id === item.id);
    if (cursoExistente) {
      if (item.situacao === 'PREVISTO') {
        this.contentComponent.alterarCourseType('aberturaCursoMilitar');
      } else if (item.situacao === 'ANDAMENTO') {
        this.contentComponent.alterarCourseType('encerramentoCursoMilitar');
      }
      this.cursoService.setIdCursoEscolhido(item.id);
      return;
    }

    let type: string;
    if (item.situacao === 'PREVISTO') {
      type = 'abertura';
      this.contentComponent.alterarCourseType('aberturaCursoMilitar');

    } else if (item.situacao === 'ANDAMENTO') {
      console.log("Andamento")
      type = 'encerramento';
      this.contentComponent.alterarCourseType('encerramentoCursoMilitar');
    } else {
      return;
    }
    console.log(item)
    const novoCurso: Curso = {
      id: item.id,
      type: type,
      bbm:item.bbm

    };
  
    this.cursoService.adicionarCurso(novoCurso);
    this.cursoService.setIdCursoEscolhido(item.id);
  }

}

