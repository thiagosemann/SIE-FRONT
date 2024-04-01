import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/service/authentication';
import { User } from 'src/app/shared/utilitarios/user';
import { ContentComponent } from '../content.component';
import { RoleService } from 'src/app/shared/service/roles_service';
import { Role } from 'src/app/shared/utilitarios/role';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  user: User | null = null;
  role="";
  roles:Role[]=[];

  constructor(private authService: AuthenticationService,private contentComponent: ContentComponent,private roleService: RoleService  ) {}

  ngOnInit(): void {
    this.roleService.getRoles().subscribe(
      (roles: Role[]) => {
        this.roles = roles;
        const role = this.getUserRole();
        this.user = this.authService.getUser();
        if(role!=""){
          this.role = role;
        }
        
      },
      (error) => {
        console.log('Erro ao obter a lista de usuários:', error);
      }
    );

  }
  getUserRole():string{
    const user = this.authService.getUser();
    const role = this.roles.filter(role => user?.role_id === role.id);
    return role[0].nome
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
