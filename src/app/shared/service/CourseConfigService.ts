import { Injectable } from '@angular/core';
import { Type } from '@angular/core';

import { DatasAberturaMilitarComponent } from '../../content/telasCompartilhadas/datas/datas-abertura-militar/datas-abertura.component';
import { LocalApresentacaoComponent } from '../../content/telasCompartilhadas/local-apresentacao/local-apresentacao.component';
import { CoordenadorComponent } from '../../content/telasCompartilhadas/coordenador/coordenador.component';
import { DocentesComponent } from '../../content/telasCompartilhadas/docentes/docentes.component';
import { PgeComponent } from '../../content/telasCompartilhadas/pge/pge.component';
import { RequisitosComplementaresComponent } from '../../content/telasCompartilhadas/requisitos-complementares/requisitos-complementares.component';
import { PrescricoesComplementaresComponent } from '../../content/telasCompartilhadas/prescricoes-complementares/prescricoes-complementares.component';
import { PreviewDocComponent } from 'src/app/content/telas-admin/preview-doc/preview-doc.component';
import { GerarDocumentosComponent } from 'src/app/content/telasCompartilhadas/gerar-documentos/gerar-documentos.component';
import { EdicaoDocumentosComponent } from 'src/app/content/telas-admin/edicao-documentos/edicao-documentos.component';
import { Logistica1Component } from 'src/app/content/telasCompartilhadas/logistica1/logistica1.component';
import { PreenchimentoAutComponent } from 'src/app/content/telasCompartilhadas/preenchimento-aut/preenchimento-aut.component';
import { CronogramaTreinamentoComponent } from 'src/app/content/telasEspecificas/Abertura/TreinamentoMilitar/cronograma-treinamento/cronograma-treinamento.component';
import { DatasAberturaCivilComponent } from 'src/app/content/telasCompartilhadas/datas/datas-abertura-civil/datas-abertura-civil.component';
import { VagasCivilComponent } from 'src/app/content/telasCompartilhadas/vagas-civil/vagas-civil.component';
import { PromotorAtividadeEnsinoComponent } from 'src/app/content/telasCompartilhadas/promotor-atividade-ensino/promotor-atividade-ensino.component';
import { MeiosDivulgacaoComponent } from 'src/app/content/telasCompartilhadas/meios-divulgacao/meios-divulgacao.component';
import { AberturaDatasCBCComponent } from 'src/app/content/telasEspecificas/Abertura/CBC/abertura-datas-cbc/abertura-datas-cbc.component';

export interface ComponentItem {
    component: Type<any>,
    name: string,
    validity : boolean,
    componentName: string
}

@Injectable({
  providedIn: 'root'
})
export class CourseConfigService {
  private aberturaCursoMilitar: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM' ,validity: false, componentName:"PgeComponent" },
    { component: PreenchimentoAutComponent, name: 'P.Aut' ,validity: false, componentName:"PreenchimentoAutComponent" },
    { component: DatasAberturaMilitarComponent, name: 'Datas',validity: false, componentName:"DatasAberturaMilitarComponent"  },
    { component: LocalApresentacaoComponent, name: 'Local',validity: false, componentName:"LocalApresentacaoComponent"  },
    { component: CoordenadorComponent, name: 'Coordenador',validity: false, componentName:"CoordenadorComponent"  },
    { component: DocentesComponent, name: 'Docentes',validity: false, componentName:"DocentesComponent"  },
    { component: RequisitosComplementaresComponent, name: 'Requisitos',validity: false, componentName:"RequisitosComplementaresComponent"  },
    { component: Logistica1Component, name: 'Logística',validity: false, componentName:"Logistica1Component"  },
    { component: PrescricoesComplementaresComponent, name: 'Prescrições',validity: false, componentName:"PrescricoesComplementaresComponent" },
    { component: GerarDocumentosComponent, name: 'Gerar',validity: false, componentName:"GerarDocumentosComponent" },
    { component: PreviewDocComponent, name: 'Preview',validity: false, componentName:"PreviewDocComponent" },

  ];

  private aberturaTreinamentoMilitar: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM',validity: false, componentName:"PgeComponent"  },
    { component: PreenchimentoAutComponent, name: 'P.Aut' ,validity: false, componentName:"PreenchimentoAutComponent" },
    { component: DatasAberturaMilitarComponent, name: 'Datas',validity: false, componentName:"DatasAberturaMilitarComponent"  },
    { component: LocalApresentacaoComponent, name: 'Local',validity: false, componentName:"LocalApresentacaoComponent"  },
    { component: CoordenadorComponent, name: 'Coordenador',validity: false, componentName:"CoordenadorComponent"  },
    { component: DocentesComponent, name: 'Docentes',validity: false, componentName:"DocentesComponent"  },
    { component: CronogramaTreinamentoComponent, name: 'Cronograma',validity: false, componentName:"CronogramaTreinamentoComponent"  },
    { component: Logistica1Component, name: 'Logística',validity: false, componentName:"Logistica1Component"  },
    { component: PrescricoesComplementaresComponent, name: 'Prescrições',validity: false, componentName:"PrescricoesComplementaresComponent" },
    { component: GerarDocumentosComponent, name: 'Gerar',validity: false, componentName:"GerarDocumentosComponent" },
    { component: PreviewDocComponent, name: 'Preview',validity: false, componentName:"PreviewDocComponent" },
  ];

  private aberturaTBAE: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM',validity: false, componentName:"PgeComponent"  },
    { component: PreenchimentoAutComponent, name: 'P.Aut' ,validity: false, componentName:"PreenchimentoAutComponent" },
    { component: VagasCivilComponent, name: 'Vagas' ,validity: false, componentName:"VagasCivilComponent" },
    { component: DatasAberturaCivilComponent, name: 'Datas' ,validity: false, componentName:"DatasAberturaCivilComponent" },
    { component: LocalApresentacaoComponent, name: 'Local',validity: false, componentName:"LocalApresentacaoComponent"  },
    { component: PromotorAtividadeEnsinoComponent, name: 'Prom.Ativ',validity: false, componentName:"PromotorAtividadeEnsinoComponent"  },
    { component: MeiosDivulgacaoComponent, name: 'Divulgação',validity: false, componentName:"MeiosDivulgacaoComponent"  },
    { component: CoordenadorComponent, name: 'Coordenador',validity: false, componentName:"CoordenadorComponent"  },
    { component: DocentesComponent, name: 'Docentes',validity: false, componentName:"DocentesComponent"  },
    { component: GerarDocumentosComponent, name: 'Gerar',validity: false, componentName:"GerarDocumentosComponent" },
    { component: PreviewDocComponent, name: 'Preview',validity: false, componentName:"PreviewDocComponent" }
  ];

  private aberturaTBC: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM',validity: false, componentName:"PgeComponent"  },
    { component: PreenchimentoAutComponent, name: 'P.Aut' ,validity: false, componentName:"PreenchimentoAutComponent" },
    { component: VagasCivilComponent, name: 'Vagas' ,validity: false, componentName:"VagasCivilComponent" },
    { component: DatasAberturaCivilComponent, name: 'Datas' ,validity: false, componentName:"DatasAberturaCivilComponent" },
    { component: LocalApresentacaoComponent, name: 'Local',validity: false, componentName:"LocalApresentacaoComponent"  },
    { component: PromotorAtividadeEnsinoComponent, name: 'Prom.Ativ',validity: false, componentName:"PromotorAtividadeEnsinoComponent"  },
    { component: MeiosDivulgacaoComponent, name: 'Divulgação',validity: false, componentName:"MeiosDivulgacaoComponent"  },
    { component: CoordenadorComponent, name: 'Coordenador',validity: false, componentName:"CoordenadorComponent"  },
    { component: DocentesComponent, name: 'Docentes',validity: false, componentName:"DocentesComponent"  },
    { component: GerarDocumentosComponent, name: 'Gerar',validity: false, componentName:"GerarDocumentosComponent" },
    { component: PreviewDocComponent, name: 'Preview',validity: false, componentName:"PreviewDocComponent" }
  ];

  private aberturaCBC: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM',validity: false, componentName:"PgeComponent"  },
    { component: PreenchimentoAutComponent, name: 'P.Aut' ,validity: false, componentName:"PreenchimentoAutComponent" },
    { component: VagasCivilComponent, name: 'Vagas' ,validity: false, componentName:"VagasCivilComponent" },
    { component: AberturaDatasCBCComponent, name: 'Datas' ,validity: false, componentName:"VagasCivilComponent" },    
    { component: LocalApresentacaoComponent, name: 'Local',validity: false, componentName:"LocalApresentacaoComponent"  },
    { component: PromotorAtividadeEnsinoComponent, name: 'Prom.Ativ',validity: false, componentName:"PromotorAtividadeEnsinoComponent"  },
    { component: MeiosDivulgacaoComponent, name: 'Divulgação',validity: false, componentName:"MeiosDivulgacaoComponent"  },
    { component: CoordenadorComponent, name: 'Coordenador',validity: false, componentName:"CoordenadorComponent"  },
    { component: DocentesComponent, name: 'Docentes',validity: false, componentName:"DocentesComponent"  },
    { component: GerarDocumentosComponent, name: 'Gerar',validity: false, componentName:"GerarDocumentosComponent" },
    { component: PreviewDocComponent, name: 'Preview',validity: false, componentName:"PreviewDocComponent" }
  ];


  private pge: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM',validity: false, componentName:"PgeComponent"  }
    //{ component: PreviewDocComponent, name: 'Preview',validity: false },

  ];

  private admin: ComponentItem[] = [
   // { component: PreviewDocComponent, name: 'Preview',validity: false },
    { component: EdicaoDocumentosComponent, name: 'Edicao',validity: false, componentName:"EdicaoDocumentosComponent" },
  
  ];

  getComponents(courseType: string): ComponentItem[] {
    switch(courseType) {
      case 'aberturaCursoMilitar':
        return this.aberturaCursoMilitar;
      case 'aberturaTreinamentoMilitar':
        return this.aberturaTreinamentoMilitar;
      case 'aberturaTBAE':
        return this.aberturaTBAE;
      case 'aberturaTBC':
        return this.aberturaTBC;
      case 'aberturaCBC':
        return this.aberturaCBC;
      case 'pge':
        return this.pge;    
      case 'admin':
        return this.admin;  
      default:
        return [];
    }
  }
}