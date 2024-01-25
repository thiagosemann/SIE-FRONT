import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './shared/service/authGuard';


import { LoginComponent } from './login/login.component';
import { ContentComponent } from './content/content.component';
import { CursosHomologadosComponent } from './content/telas-admin/cursos-homologados/cursos-homologados.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'content', component: ContentComponent, canActivate: [AuthGuardService] }

  // Outras rotas do seu aplicativo
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}