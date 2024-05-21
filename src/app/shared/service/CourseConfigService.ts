import { Injectable } from '@angular/core';
import { Type } from '@angular/core';

import { DatasAberturaMilitarComponent } from '../../content/telasCompartilhadas/Abertura/datas-abertura-militar/datas-abertura.component';
import { LocalApresentacaoComponent } from '../../content/telasCompartilhadas/Abertura/local-apresentacao/local-apresentacao.component';
import { CoordenadorComponent } from '../../content/telasCompartilhadas/Misto/coordenador/coordenador.component';
import { DocentesComponent } from '../../content/telasCompartilhadas/Abertura/docentes/docentes.component';
import { PgeComponent } from '../../content/telasCompartilhadas/Misto/pge/pge.component';
import { RequisitosComplementaresComponent } from '../../content/telasCompartilhadas/Abertura/requisitos-complementares/requisitos-complementares.component';
import { PrescricoesComplementaresComponent } from '../../content/telasCompartilhadas/Abertura/prescricoes-complementares/prescricoes-complementares.component';
import { PreviewDocComponent } from 'src/app/content/telas-admin/preview-doc/preview-doc.component';
import { GerarDocumentosComponent } from 'src/app/content/telasCompartilhadas/Misto/gerar-documentos/gerar-documentos.component';
import { EdicaoDocumentosComponent } from 'src/app/content/telas-admin/edicao-documentos/edicao-documentos.component';
import { Logistica1Component } from 'src/app/content/telasCompartilhadas/Abertura/logistica1/logistica1.component';
import { PreenchimentoAutComponent } from 'src/app/content/telasCompartilhadas/Misto/preenchimento-aut/preenchimento-aut.component';
import { CronogramaTreinamentoComponent } from 'src/app/content/telasEspecificas/Abertura/TreinamentoMilitar/cronograma-treinamento/cronograma-treinamento.component';
import { DatasAberturaCivilComponent } from 'src/app/content/telasCompartilhadas/Abertura/datas-abertura-civil/datas-abertura-civil.component';
import { VagasCivilComponent } from 'src/app/content/telasCompartilhadas/Abertura/vagas-civil/vagas-civil.component';
import { PromotorAtividadeEnsinoComponent } from 'src/app/content/telasCompartilhadas/Abertura/promotor-atividade-ensino/promotor-atividade-ensino.component';
import { MeiosDivulgacaoComponent } from 'src/app/content/telasCompartilhadas/Abertura/meios-divulgacao/meios-divulgacao.component';
import { AberturaDatasCBCComponent } from 'src/app/content/telasEspecificas/Abertura/CBC/abertura-datas-cbc/abertura-datas-cbc.component';
import { AberturaDatasGuardaVidasCivilComponent } from 'src/app/content/telasEspecificas/Abertura/GuardaVidaCivil/abertura-datas-guarda-vidas-civil/abertura-datas-guarda-vidas-civil.component';


import { EfetivoComponent } from 'src/app/content/telas-admin/efetivo/efetivo.component';
import { CursosHomologadosComponent } from 'src/app/content/telas-admin/cursos-homologados/cursos-homologados.component';
import { HomologacaoInscricaoComponent } from 'src/app/content/telas-admin/homologacao-inscricao/homologacao-inscricao.component';
import { AberturaProcessoComponent } from 'src/app/content/telas-admin/abertura-processo/abertura-processo.component';
import { LocalNatacaoComponent } from 'src/app/content/telasEspecificas/Abertura/GuardaVidaCivil/local-natacao/local-natacao.component';
import { LocalCorridaComponent } from 'src/app/content/telasEspecificas/Abertura/GuardaVidaCivil/local-corrida/local-corrida.component';
import { LeitorQTComponent } from 'src/app/content/telasCompartilhadas/Encerramento/leitor-qt/leitor-qt.component';
import { DiscentesComponent } from 'src/app/content/telasCompartilhadas/Encerramento/discentes/discentesAutoInscricao/discentes.component';
import { NotasAprovadoReprovadoComponent } from 'src/app/content/telasCompartilhadas/Encerramento/notas-aprovado-reprovado/notas-aprovado-reprovado.component';
import { NotasNumericaComponent } from 'src/app/content/telasCompartilhadas/Encerramento/notas-numerica/notas-numerica.component';
import { DiscentesMilitarComponent } from 'src/app/content/telasCompartilhadas/Encerramento/discentes/discentes-militar/discentes-militar.component';
import { DiscentesVinculadosComponent } from 'src/app/content/telasCompartilhadas/Encerramento/discentes/discentes-vinculados/discentes-vinculados.component';
import { DiariaDeCursoComponent } from 'src/app/content/telasCompartilhadas/Encerramento/diaria-de-curso/diaria-de-curso.component';
import { DiariaMilitarComponent } from 'src/app/content/telasCompartilhadas/Encerramento/diaria-militar/diaria-militar.component';
import { DataEncerramentoComponent } from 'src/app/content/telasCompartilhadas/Encerramento/data-encerramento/data-encerramento.component';
import { RelatorioFinalCursoComponent } from 'src/app/content/telas-admin/relatorio-final-curso/relatorio-final-curso.component';
import { RelatorioParcialCursoComponent } from 'src/app/content/telas-admin/relatorio-parcial-curso/relatorio-parcial-curso.component';
import { PagamentoComponent } from 'src/app/content/telas-admin/pagamento/pagamento.component';


export interface ComponentItem {
    component: Type<any>,
    name: string,
    validity : boolean,
    componentName: string
}
interface ComponentMap {
  [key: string]: ComponentItem[];
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
  
  private encerramentoCursoMilitar: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM',validity: false, componentName:"PgeComponent"},
    { component: PreenchimentoAutComponent, name: 'P.Aut' ,validity: false, componentName:"PreenchimentoAutComponent"},
    { component: CoordenadorComponent, name: 'Coordenador',validity: false, componentName:"CoordenadorComponent"},
    { component: DataEncerramentoComponent, name: 'Data',validity: false, componentName:"DataEncerramentoComponent"},
    { component: LeitorQTComponent, name: 'Professores',validity: false, componentName:"LeitorQTComponent"  },
    { component: DiariaMilitarComponent, name: 'D.Militar',validity: false, componentName:"DiariaMilitarComponent"},
    { component: DiscentesMilitarComponent, name: 'Alunos M.',validity: false, componentName:"DiscentesMilitarComponent"},
    { component: DiscentesVinculadosComponent, name: 'Alunos C.',validity: false, componentName:"DiscentesVinculadosComponent"},
    { component: NotasNumericaComponent, name: 'Nota',validity: false, componentName:"NotasNumericaComponent"},
    { component: DiariaDeCursoComponent, name: 'D.Curso',validity: false, componentName:"DiariaDeCursoComponent"},
    { component: GerarDocumentosComponent, name: 'Gerar',validity: false, componentName:"GerarDocumentosComponent" },
    { component: PreviewDocComponent, name: 'Preview',validity: false, componentName:"PreviewDocComponent" }
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

  private encerramentoTreinamentoMilitar: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM',validity: false, componentName:"PgeComponent"},
    { component: PreenchimentoAutComponent, name: 'P.Aut' ,validity: false, componentName:"PreenchimentoAutComponent"},
    { component: CoordenadorComponent, name: 'Coordenador',validity: false, componentName:"CoordenadorComponent"},
    { component: DataEncerramentoComponent, name: 'Data',validity: false, componentName:"DataEncerramentoComponent"},
    { component: LeitorQTComponent, name: 'Professores',validity: false, componentName:"LeitorQTComponent"  },
    { component: DiariaMilitarComponent, name: 'D.Militar',validity: false, componentName:"DiariaMilitarComponent"},
    { component: DiscentesMilitarComponent, name: 'Alunos M.',validity: false, componentName:"DiscentesMilitarComponent"},
    { component: DiscentesVinculadosComponent, name: 'Alunos C.',validity: false, componentName:"DiscentesVinculadosComponent"},
    { component: NotasNumericaComponent, name: 'Nota',validity: false, componentName:"NotasNumericaComponent"},
    { component: DiariaDeCursoComponent, name: 'D.Curso',validity: false, componentName:"DiariaDeCursoComponent"},
    { component: GerarDocumentosComponent, name: 'Gerar',validity: false, componentName:"GerarDocumentosComponent" },
    { component: PreviewDocComponent, name: 'Preview',validity: false, componentName:"PreviewDocComponent" }
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

  private encerramentoTBAE: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM',validity: false, componentName:"PgeComponent"},
    { component: PreenchimentoAutComponent, name: 'P.Aut' ,validity: false, componentName:"PreenchimentoAutComponent"},
    { component: CoordenadorComponent, name: 'Coordenador',validity: false, componentName:"CoordenadorComponent"},
    { component: DataEncerramentoComponent, name: 'Data',validity: false, componentName:"DataEncerramentoComponent"},
    { component: LeitorQTComponent, name: 'Professores',validity: false, componentName:"LeitorQTComponent"  },
    { component: DiariaMilitarComponent, name: 'D.Militar',validity: false, componentName:"DiariaMilitarComponent"},
    { component: DiscentesComponent, name: 'Alunos',validity: false, componentName:"DiscentesComponent"},
    { component: NotasAprovadoReprovadoComponent, name: 'Nota',validity: false, componentName:"NotasAprovadoReprovadoComponent"},
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

  private encerramentoTBC: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM',validity: false, componentName:"PgeComponent"},
    { component: PreenchimentoAutComponent, name: 'P.Aut' ,validity: false, componentName:"PreenchimentoAutComponent"},
    { component: CoordenadorComponent, name: 'Coordenador',validity: false, componentName:"CoordenadorComponent"},
    { component: DataEncerramentoComponent, name: 'Data',validity: false, componentName:"DataEncerramentoComponent"},
    { component: LeitorQTComponent, name: 'Professores',validity: false, componentName:"LeitorQTComponent"  },
    { component: DiariaMilitarComponent, name: 'D.Militar',validity: false, componentName:"DiariaMilitarComponent"},
    { component: DiscentesVinculadosComponent, name: 'Alunos C.',validity: false, componentName:"DiscentesVinculadosComponent"},
    { component: NotasAprovadoReprovadoComponent, name: 'Nota',validity: false, componentName:"NotasAprovadoReprovadoComponent"},
    { component: GerarDocumentosComponent, name: 'Gerar',validity: false, componentName:"GerarDocumentosComponent" },
    { component: PreviewDocComponent, name: 'Preview',validity: false, componentName:"PreviewDocComponent" }
  ];

  private aberturaCBC: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM',validity: false, componentName:"PgeComponent"  },
    { component: PreenchimentoAutComponent, name: 'P.Aut' ,validity: false, componentName:"PreenchimentoAutComponent" },
    { component: VagasCivilComponent, name: 'Vagas' ,validity: false, componentName:"VagasCivilComponent" },
    { component: AberturaDatasCBCComponent, name: 'Datas' ,validity: false, componentName:"AberturaDatasCBCComponent" },    
    { component: LocalApresentacaoComponent, name: 'Local',validity: false, componentName:"LocalApresentacaoComponent"  },
    { component: PromotorAtividadeEnsinoComponent, name: 'Prom.Ativ',validity: false, componentName:"PromotorAtividadeEnsinoComponent"  },
    { component: MeiosDivulgacaoComponent, name: 'Divulgação',validity: false, componentName:"MeiosDivulgacaoComponent"  },
    { component: CoordenadorComponent, name: 'Coordenador',validity: false, componentName:"CoordenadorComponent"  },
    { component: DocentesComponent, name: 'Docentes',validity: false, componentName:"DocentesComponent"  },
    { component: GerarDocumentosComponent, name: 'Gerar',validity: false, componentName:"GerarDocumentosComponent" },
    { component: PreviewDocComponent, name: 'Preview',validity: false, componentName:"PreviewDocComponent" }
  ];

  private aberturaCGVCV: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM',validity: false, componentName:"PgeComponent"  },
    { component: PreenchimentoAutComponent, name: 'P.Aut' ,validity: false, componentName:"PreenchimentoAutComponent" },
    { component: AberturaDatasGuardaVidasCivilComponent, name: 'Datas' ,validity: false, componentName:"AberturaDatasGuardaVidasCivilComponent" },    
    { component: LocalApresentacaoComponent, name: 'Local',validity: false, componentName:"LocalApresentacaoComponent"  },
    { component: PromotorAtividadeEnsinoComponent, name: 'Prom.Ativ',validity: false, componentName:"PromotorAtividadeEnsinoComponent"  },
    { component: LocalNatacaoComponent, name: 'Natação',validity: false, componentName:"LocalNatacaoComponent"  },
    { component: LocalCorridaComponent, name: 'Corrida',validity: false, componentName:"LocalCorridaComponent"  },
    { component: MeiosDivulgacaoComponent, name: 'Divulgação',validity: false, componentName:"MeiosDivulgacaoComponent"  },
    { component: CoordenadorComponent, name: 'Coordenador',validity: false, componentName:"CoordenadorComponent"  },
    { component: DocentesComponent, name: 'Docentes',validity: false, componentName:"DocentesComponent"  },
    { component: GerarDocumentosComponent, name: 'Gerar',validity: false, componentName:"GerarDocumentosComponent" },
    { component: PreviewDocComponent, name: 'Preview',validity: false, componentName:"PreviewDocComponent" }
  ];

  private encerramentoCGVCV: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM',validity: false, componentName:"PgeComponent"},
    { component: PreenchimentoAutComponent, name: 'P.Aut' ,validity: false, componentName:"PreenchimentoAutComponent"},
    { component: CoordenadorComponent, name: 'Coordenador',validity: false, componentName:"CoordenadorComponent"},
    { component: DataEncerramentoComponent, name: 'Data',validity: false, componentName:"DataEncerramentoComponent"},
    { component: LeitorQTComponent, name: 'Professores',validity: false, componentName:"LeitorQTComponent"  },
    { component: DiariaMilitarComponent, name: 'D.Militar',validity: false, componentName:"DiariaMilitarComponent"},
    { component: DiscentesComponent, name: 'Alunos',validity: false, componentName:"DiscentesComponent"},
    { component: NotasAprovadoReprovadoComponent, name: 'Nota',validity: false, componentName:"NotasAprovadoReprovadoComponent"},
    { component: GerarDocumentosComponent, name: 'Gerar',validity: false, componentName:"GerarDocumentosComponent" },
    { component: PreviewDocComponent, name: 'Preview',validity: false, componentName:"PreviewDocComponent" }
  ];
  

  private aberturaCRGVCV: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM',validity: false, componentName:"PgeComponent"  },
    { component: PreenchimentoAutComponent, name: 'P.Aut' ,validity: false, componentName:"PreenchimentoAutComponent" },
    { component: AberturaDatasGuardaVidasCivilComponent, name: 'Datas' ,validity: false, componentName:"AberturaDatasGuardaVidasCivilComponent" },    
    { component: LocalApresentacaoComponent, name: 'Local',validity: false, componentName:"LocalApresentacaoComponent"  },
    { component: PromotorAtividadeEnsinoComponent, name: 'Prom.Ativ',validity: false, componentName:"PromotorAtividadeEnsinoComponent"  },
    { component: LocalNatacaoComponent, name: 'Natação',validity: false, componentName:"LocalNatacaoComponent"  },
    { component: LocalCorridaComponent, name: 'Corrida',validity: false, componentName:"LocalCorridaComponent"  },
    { component: MeiosDivulgacaoComponent, name: 'Divulgação',validity: false, componentName:"MeiosDivulgacaoComponent"  },
    { component: CoordenadorComponent, name: 'Coordenador',validity: false, componentName:"CoordenadorComponent"  },
    { component: DocentesComponent, name: 'Docentes',validity: false, componentName:"DocentesComponent"  },
    { component: GerarDocumentosComponent, name: 'Gerar',validity: false, componentName:"GerarDocumentosComponent" },
    { component: PreviewDocComponent, name: 'Preview',validity: false, componentName:"PreviewDocComponent" }
  ];

  private aberturaCGVCVRio: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM',validity: false, componentName:"PgeComponent"  },
    { component: PreenchimentoAutComponent, name: 'P.Aut' ,validity: false, componentName:"PreenchimentoAutComponent" },
    { component: AberturaDatasGuardaVidasCivilComponent, name: 'Datas' ,validity: false, componentName:"AberturaDatasGuardaVidasCivilComponent" },    
    { component: LocalApresentacaoComponent, name: 'Local',validity: false, componentName:"LocalApresentacaoComponent"  },
    { component: PromotorAtividadeEnsinoComponent, name: 'Prom.Ativ',validity: false, componentName:"PromotorAtividadeEnsinoComponent"  },
    { component: LocalNatacaoComponent, name: 'Natação',validity: false, componentName:"LocalNatacaoComponent"  },
    { component: LocalCorridaComponent, name: 'Corrida',validity: false, componentName:"LocalCorridaComponent"  },
    { component: MeiosDivulgacaoComponent, name: 'Divulgação',validity: false, componentName:"MeiosDivulgacaoComponent"  },
    { component: CoordenadorComponent, name: 'Coordenador',validity: false, componentName:"CoordenadorComponent"  },
    { component: DocentesComponent, name: 'Docentes',validity: false, componentName:"DocentesComponent"  },
    { component: GerarDocumentosComponent, name: 'Gerar',validity: false, componentName:"GerarDocumentosComponent" },
    { component: PreviewDocComponent, name: 'Preview',validity: false, componentName:"PreviewDocComponent" }
  ];

  private aberturaCRGVCVRio: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM',validity: false, componentName:"PgeComponent"  },
    { component: PreenchimentoAutComponent, name: 'P.Aut' ,validity: false, componentName:"PreenchimentoAutComponent" },
    { component: AberturaDatasGuardaVidasCivilComponent, name: 'Datas' ,validity: false, componentName:"AberturaDatasGuardaVidasCivilComponent" },    
    { component: LocalApresentacaoComponent, name: 'Local',validity: false, componentName:"LocalApresentacaoComponent"  },
    { component: PromotorAtividadeEnsinoComponent, name: 'Prom.Ativ',validity: false, componentName:"PromotorAtividadeEnsinoComponent"  },
    { component: LocalNatacaoComponent, name: 'Natação',validity: false, componentName:"LocalNatacaoComponent"  },
    { component: LocalCorridaComponent, name: 'Corrida',validity: false, componentName:"LocalCorridaComponent"  },
    { component: MeiosDivulgacaoComponent, name: 'Divulgação',validity: false, componentName:"MeiosDivulgacaoComponent"  },
    { component: CoordenadorComponent, name: 'Coordenador',validity: false, componentName:"CoordenadorComponent"  },
    { component: DocentesComponent, name: 'Docentes',validity: false, componentName:"DocentesComponent"  },
    { component: GerarDocumentosComponent, name: 'Gerar',validity: false, componentName:"GerarDocumentosComponent" },
    { component: PreviewDocComponent, name: 'Preview',validity: false, componentName:"PreviewDocComponent" }
  ];

  private parcial: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM',validity: false, componentName:"PgeComponent"},
    { component: PreenchimentoAutComponent, name: 'P.Aut' ,validity: false, componentName:"PreenchimentoAutComponent"},
    { component: LeitorQTComponent, name: 'Professores',validity: false, componentName:"LeitorQTComponent"  },
    { component: DiariaMilitarComponent, name: 'D.Militar',validity: false, componentName:"DiariaMilitarComponent"},
    { component: GerarDocumentosComponent, name: 'Gerar',validity: false, componentName:"GerarDocumentosComponent" },
    { component: PreviewDocComponent, name: 'Preview',validity: false, componentName:"PreviewDocComponent" }
  ];
  

  private pge: ComponentItem[] = [
    { component: PgeComponent, name: 'Cursos BBM',validity: false, componentName:"PgeComponent"  }
    //{ component: PreviewDocComponent, name: 'Preview',validity: false },
  ];
  private homologacaoInscricao: ComponentItem[] = [
    { component: HomologacaoInscricaoComponent, name: 'Homologação',validity: false, componentName:"HomologacaoInscricaoComponent"  }
  ];

  private admin: ComponentItem[] = [
    //{ component: PreviewDocComponent, name: 'Preview',validity: false },
    //{ component: EdicaoDocumentosComponent, name: 'Edicao',validity: false, componentName:"EdicaoDocumentosComponent" },
    { component: PgeComponent , name: 'PGE',validity: false, componentName:"PgeComponent" },
    { component: AberturaProcessoComponent , name: 'Editais',validity: false, componentName:"AberturaProcessoComponent" },
    { component: RelatorioFinalCursoComponent , name: 'RFC',validity: false, componentName:"RelatorioFinalCursoComponent" },
    { component: RelatorioParcialCursoComponent , name: 'RPC',validity: false, componentName:"RelatorioParcialCursoComponent" },
    { component: PagamentoComponent , name: 'Pagamento',validity: false, componentName:"PagamentoComponent" },
    
    { component: CursosHomologadosComponent , name: 'Cursos Homologados',validity: false, componentName:"CursosHomologadosComponent" },
    { component: EfetivoComponent , name: 'Efetivo',validity: false, componentName:"EfetivoComponent" }  
  ];

  private publico: ComponentItem[] = [
    { component: PgeComponent , name: 'PGE',validity: false, componentName:"PgeComponent" },
    { component: CursosHomologadosComponent , name: 'Cursos Homologados',validity: false, componentName:"CursosHomologadosComponent" }
  ];

  

  getComponents(courseType: string): ComponentItem[] {

    const componentMap: ComponentMap = {
      'aberturaCursoMilitar': this.aberturaCursoMilitar,
      'encerramentoCursoMilitar': this.encerramentoCursoMilitar,
      'aberturaTreinamentoMilitar': this.aberturaTreinamentoMilitar,
      'encerramentoTreinamentoMilitar': this.encerramentoTreinamentoMilitar,
      'aberturaTBAE': this.aberturaTBAE,
      'encerramentoTBAE': this.encerramentoTBAE,
      'aberturaTBC': this.aberturaTBC,
      'encerramentoTBC': this.encerramentoTBC,
      'aberturaCBC': this.aberturaCBC,
      'aberturaCGVCV': this.aberturaCGVCV,
      'encerramentoCGVCV': this.encerramentoCGVCV,
      'aberturaCRGVCV': this.aberturaCRGVCV,
      'aberturaCGVCVRio': this.aberturaCGVCVRio,
      'aberturaCRGVCVRio': this.aberturaCRGVCVRio,
      'pge': this.pge,
      'admin': this.admin,
      'publico': this.publico,
      'homologacaoInscricao': this.homologacaoInscricao,
      'parcial': this.parcial,
      
    };
    return componentMap[courseType] || [];
  }
}