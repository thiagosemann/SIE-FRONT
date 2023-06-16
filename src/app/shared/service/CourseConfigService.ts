import { Injectable } from '@angular/core';
import { Type } from '@angular/core';

import { DatasAberturaComponent } from '../../content/telasCompartilhadas/datas-abertura/datas-abertura.component';
import { LocalApresentacaoComponent } from '../../content/telasCompartilhadas/local-apresentacao/local-apresentacao.component';
import { CoordenadorComponent } from '../../content/telasCompartilhadas/coordenador/coordenador.component';
import { DocentesComponent } from '../../content/telasCompartilhadas/docentes/docentes.component';
import { PgeComponent } from '../../content/telasCompartilhadas/pge/pge.component';
import { RequisitosComplementaresComponent } from '../../content/telasCompartilhadas/requisitos-complementares/requisitos-complementares.component';
import { LogisticaComponent } from '../../content/telasCompartilhadas/logistica/logistica.component';
import { PrescricoesComplementaresComponent } from '../../content/telasCompartilhadas/prescricoes-complementares/prescricoes-complementares.component';

export interface ComponentItem {
    component: Type<any>,
    name: string
}

@Injectable({
  providedIn: 'root'
})
export class CourseConfigService {
  private aberturaCursoMilitar: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM' },
    { component: DatasAberturaComponent, name: 'Datas' },
    { component: LocalApresentacaoComponent, name: 'Local' },
    { component: CoordenadorComponent, name: 'Coordenador' },
    { component: DocentesComponent, name: 'Docentes' },
    { component: RequisitosComplementaresComponent, name: 'Requisitos' },
    { component: LogisticaComponent, name: 'Logística' },
    { component: PrescricoesComplementaresComponent, name: 'Prescrições'},
  ];

  private aberturaTreinamentoMilitar: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM' },
    { component: DatasAberturaComponent, name: 'Datas' },
    { component: LocalApresentacaoComponent, name: 'Local' },
    { component: LogisticaComponent, name: 'Logística' },
    { component: PrescricoesComplementaresComponent, name: 'Prescrições'},
  ];
  

  getComponents(courseType: string): ComponentItem[] {
    switch(courseType) {
      case 'aberturaCursoMilitar':
        return this.aberturaCursoMilitar;
      case 'aberturaTreinamentoMilitar':
        return this.aberturaTreinamentoMilitar;
      default:
        return [];
    }
  }
}