import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NavBarComponent } from './content/nav-bar/nav-bar.component';
import { ContentComponent } from './content/content.component';
import { DatasAberturaComponent } from './content/telasCompartilhadas/datas-abertura/datas-abertura.component';
import { LocalApresentacaoComponent } from './content/telasCompartilhadas/local-apresentacao/local-apresentacao.component';
import { CoordenadorComponent } from './content/telasCompartilhadas/coordenador/coordenador.component';
import { DocentesComponent } from './content/telasCompartilhadas/docentes/docentes.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
