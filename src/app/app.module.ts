import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NavBarComponent } from './content/nav-bar/nav-bar.component';
import { ContentComponent } from './content/content.component';
import { DatasAberturaComponent } from './content/telasCompartilhadas/datas-abertura/datas-abertura.component';
import { LocalApresentacaoComponent } from './content/telasCompartilhadas/local-apresentacao/local-apresentacao.component';
import { CoordenadorComponent } from './content/telasCompartilhadas/coordenador/coordenador.component';
import { DocentesComponent } from './content/telasCompartilhadas/docentes/docentes.component';
import { PgeComponent } from './content/telasCompartilhadas/pge/pge.component';
import { RequisitosComplementaresComponent } from './content/telasCompartilhadas/requisitos-complementares/requisitos-complementares.component';
import { LogisticaComponent } from './content/telasCompartilhadas/logistica/logistica.component';
import { PrescricoesComplementaresComponent } from './content/telasCompartilhadas/prescricoes-complementares/prescricoes-complementares.component';
import { GoogleScriptService } from './shared/service/googleScriptService';
import { PreviewDocComponent } from './content/telas-admin/preview-doc/preview-doc.component';
import { GerarDocumentosComponent } from './content/telasCompartilhadas/gerar-documentos/gerar-documentos.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavBarComponent,
    ContentComponent,
    DatasAberturaComponent,
    LocalApresentacaoComponent,
    CoordenadorComponent,
    DocentesComponent,
    PgeComponent,
    RequisitosComplementaresComponent,
    LogisticaComponent,
    PrescricoesComplementaresComponent,
    PreviewDocComponent,
    GerarDocumentosComponent,
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
  ],
  
  providers: [GoogleScriptService],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
