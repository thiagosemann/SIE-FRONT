import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './shared/service/authGuard';

import { LoginComponent } from './login/login.component';
import { ContentComponent } from './content/content.component';
import { InscritionComponent } from './inscrition/inscrition.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inscricoes/:id', component: InscritionComponent },
  { path: 'content', component: ContentComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' } // Rota wildcard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
