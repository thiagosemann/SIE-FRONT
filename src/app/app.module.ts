import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { AccordionModule } from 'ngx-bootstrap/accordion';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NavBarComponent } from './content/nav-bar/nav-bar.component';
import { ContentComponent } from './content/content.component';
import { DatasAberturaMilitarComponent } from './content/telasCompartilhadas/Abertura/datas-abertura-militar/datas-abertura.component';
import { LocalApresentacaoComponent } from './content/telasCompartilhadas/Abertura/local-apresentacao/local-apresentacao.component';
import { CoordenadorComponent } from './content/telasCompartilhadas/Misto/coordenador/coordenador.component';
import { DocentesComponent } from './content/telasCompartilhadas/Abertura/docentes/docentes.component';
import { PgeComponent } from './content/telasCompartilhadas/Misto/pge/pge.component';
import { RequisitosComplementaresComponent } from './content/telasCompartilhadas/Abertura/requisitos-complementares/requisitos-complementares.component';
import { PrescricoesComplementaresComponent } from './content/telasCompartilhadas/Abertura/prescricoes-complementares/prescricoes-complementares.component';
import { GoogleScriptService } from './shared/service/googleScriptService';
import { PreviewDocComponent } from './content/telas-admin/preview-doc/preview-doc.component';
import { GerarDocumentosComponent } from './content/telasCompartilhadas/Misto/gerar-documentos/gerar-documentos.component';
import { EdicaoDocumentosComponent } from './content/telas-admin/edicao-documentos/edicao-documentos.component';
import { Logistica1Component } from './content/telasCompartilhadas/Abertura/logistica1/logistica1.component';
import { PreenchimentoAutComponent } from './content/telasCompartilhadas/Misto/preenchimento-aut/preenchimento-aut.component';
import { CronogramaTreinamentoComponent } from './content/telasEspecificas/Abertura/TreinamentoMilitar/cronograma-treinamento/cronograma-treinamento.component';
import { DatasAberturaCivilComponent } from './content/telasCompartilhadas/Abertura/datas-abertura-civil/datas-abertura-civil.component';
import { VagasCivilComponent } from './content/telasCompartilhadas/Abertura/vagas-civil/vagas-civil.component';
import { PromotorAtividadeEnsinoComponent } from './content/telasCompartilhadas/Abertura/promotor-atividade-ensino/promotor-atividade-ensino.component';
import { MeiosDivulgacaoComponent } from './content/telasCompartilhadas/Abertura/meios-divulgacao/meios-divulgacao.component';
import { AberturaDatasCBCComponent } from './content/telasEspecificas/Abertura/CBC/abertura-datas-cbc/abertura-datas-cbc.component';
import { EfetivoComponent } from './content/telas-admin/efetivo/efetivo.component';
import { CursosHomologadosComponent } from './content/telas-admin/cursos-homologados/cursos-homologados.component';
import { InscritionComponent } from './inscrition/inscrition.component';
import { HomologacaoInscricaoComponent } from './content/telas-admin/homologacao-inscricao/homologacao-inscricao.component';
import { AberturaProcessoComponent } from './content/telas-admin/abertura-processo/abertura-processo.component';
import { AberturaDatasGuardaVidasCivilComponent } from './content/telasEspecificas/Abertura/GuardaVidaCivil/abertura-datas-guarda-vidas-civil/abertura-datas-guarda-vidas-civil.component';
import { LocalNatacaoComponent } from './content/telasEspecificas/Abertura/GuardaVidaCivil/local-natacao/local-natacao.component';
import { LocalCorridaComponent } from './content/telasEspecificas/Abertura/GuardaVidaCivil/local-corrida/local-corrida.component';
import { LeitorQTComponent } from './content/telasCompartilhadas/Encerramento/leitor-qt/leitor-qt.component';
import { DiscentesComponent } from './content/telasCompartilhadas/Encerramento/discentes/discentesAutoInscricao/discentes.component';
import { NotasAprovadoReprovadoComponent } from './content/telasCompartilhadas/Encerramento/notas-aprovado-reprovado/notas-aprovado-reprovado.component';
import { NotasNumericaComponent } from './content/telasCompartilhadas/Encerramento/notas-numerica/notas-numerica.component';
import { DiscentesMilitarComponent } from './content/telasCompartilhadas/Encerramento/discentes/discentes-militar/discentes-militar.component';
import { DiscentesVinculadosComponent } from './content/telasCompartilhadas/Encerramento/discentes/discentes-vinculados/discentes-vinculados.component';
import { DiariaDeCursoComponent } from './content/telasCompartilhadas/Encerramento/diaria-de-curso/diaria-de-curso.component';
import { DiariaMilitarComponent } from './content/telasCompartilhadas/Encerramento/diaria-militar/diaria-militar.component';
import { DataEncerramentoComponent } from './content/telasCompartilhadas/Encerramento/data-encerramento/data-encerramento.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavBarComponent,
    ContentComponent,
    DatasAberturaMilitarComponent,
    LocalApresentacaoComponent,
    CoordenadorComponent,
    DocentesComponent,
    PgeComponent,
    RequisitosComplementaresComponent,
    PrescricoesComplementaresComponent,
    PreviewDocComponent,
    GerarDocumentosComponent,
    EdicaoDocumentosComponent,
    Logistica1Component,
    PreenchimentoAutComponent,
    CronogramaTreinamentoComponent,
    DatasAberturaCivilComponent,
    VagasCivilComponent,
    PromotorAtividadeEnsinoComponent,
    MeiosDivulgacaoComponent,
    AberturaDatasCBCComponent,
    EfetivoComponent,
    CursosHomologadosComponent,
    InscritionComponent,
    HomologacaoInscricaoComponent,
    AberturaProcessoComponent,
    AberturaDatasGuardaVidasCivilComponent,
    LocalNatacaoComponent,
    LocalCorridaComponent,
    LeitorQTComponent,
    DiscentesComponent,
    NotasAprovadoReprovadoComponent,
    NotasNumericaComponent,
    DiscentesMilitarComponent,
    DiscentesVinculadosComponent,
    DiariaDeCursoComponent,
    DiariaMilitarComponent,
    DataEncerramentoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    AccordionModule.forRoot()

  ],
  
  providers: [GoogleScriptService],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
