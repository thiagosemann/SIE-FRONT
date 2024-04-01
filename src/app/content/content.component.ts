import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, ComponentRef, Type, OnInit, ChangeDetectorRef } from '@angular/core';
import { CourseConfigService, ComponentItem } from '../shared/service/CourseConfigService';
import { AuthenticationService } from '../shared/service/authentication';
import { Role } from '../shared/utilitarios/role';
import { RoleService } from '../shared/service/roles_service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  public components: ComponentItem[] = [];
  courseType = 'pge';
  activeTab = 1; // Define a segunda aba como ativa
  validity = false;
  roles:Role[]=[];
  @ViewChild('componentHost', { read: ViewContainerRef, static: true }) componentHost!: ViewContainerRef;

  private currentComponent?: ComponentRef<any>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private courseConfigService: CourseConfigService,
    private authService: AuthenticationService,
    private cdref: ChangeDetectorRef,
    private roleService: RoleService

  ) {}

  ngOnInit() {
    this.roleService.getRoles().subscribe(
      (role: Role[]) => {
        this.roles = role;
        this.changeComponents(0);
      },
      (error) => {
        console.log('Erro ao obter a lista de usuários:', error);
      }
    );
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  loadComponent(index: number) {
    if (this.currentComponent) {
      this.currentComponent.destroy();
    }
    const component = this.components[index].component;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.currentComponent = this.componentHost.createComponent(componentFactory);
    this.activeTab = index;
    const role = this.getUserRole();
    if (this.isTabActive(0) && role === 'admin') {
      this.courseType = 'admin';
      this.components = this.courseConfigService.getComponents(this.courseType);
    } else if (this.isTabActive(0) && role === '--') {
      this.courseType = 'publico';
      this.components = this.courseConfigService.getComponents(this.courseType);
    }
  }
  getUserRole():string{
    const user = this.authService.getUser();
    const role = this.roles.filter(role => user?.role_id === role.id);
    return role[0].nome
  }
  isTabActive(index: number): boolean {
    return this.activeTab === index;
  }

  alterarCourseType(valor: string) {
    this.courseType = valor;
    this.changeComponents(1);
  }
  
  courseTypePge() {
    this.courseType = 'pge';
    this.components = this.courseConfigService.getComponents(this.courseType);
    this.loadComponent(0);
  }

  courseTypeHomologacao() {
    this.courseType = 'homologacaoInscricao';
    this.components = this.courseConfigService.getComponents(this.courseType);
    this.loadComponent(0);
  }
  

  changeComponents(activeTab: number) {
    const role = this.getUserRole();
    if (role === 'admin') {
      this.courseType = 'admin';
    }
    if (role === '--') {
      this.courseType = 'publico';
    }
    
    this.components = this.courseConfigService.getComponents(this.courseType);
    this.resetValidity();
    this.activeTab = activeTab;
    this.loadComponent(activeTab);
  }

  changeValidityByComponentName(componentType: Type<any>, validity: boolean): void {
    const index = this.components.findIndex(component => component.component === componentType);
    if (index !== -1 && this.isTabActive(index)) {
      this.components[index].validity = validity;
    }
  }

  resetValidity(): void {
    this.components.forEach(component => {
      component.validity = false;
    });
  }
  

}
