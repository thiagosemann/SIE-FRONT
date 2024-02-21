import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/service/authentication';
import { User } from 'src/app/shared/utilitarios/user';
import { ContentComponent } from '../content.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  user: User | null = null;
  role="";
  constructor(private authService: AuthenticationService,private contentComponent: ContentComponent) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if(this.user && this.user.role!=""){
      this.role = this.user.role;
    }
  }

  logout(): void {
    this.authService.logout();
    this.user = this.authService.getUser();
  }
  chamarTelaHomologacaoInscricao():void{
    this.contentComponent.courseTypeHomologacao();
  }
  chamarTelaPGE():void{
    this.contentComponent.courseTypePge();
  }
  
}
