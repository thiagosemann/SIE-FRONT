import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ContentComponent } from './content/content.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'content', component: ContentComponent },

  // Outras rotas do seu aplicativo
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}