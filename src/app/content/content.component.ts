import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, ComponentRef, Type, OnInit } from '@angular/core';
import { CourseConfigService, ComponentItem } from '../shared/service/CourseConfigService';

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
  @ViewChild('componentHost', { read: ViewContainerRef, static: true }) componentHost!: ViewContainerRef;

  private currentComponent?: ComponentRef<any>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private courseConfigService: CourseConfigService
  ) {}

  ngOnInit() {
    this.changeComponents(0);
  }

  loadComponent(index: number) {
   if (this.currentComponent) {
      this.currentComponent.destroy();
    }

    const component = this.components[index].component;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.currentComponent = this.componentHost.createComponent(componentFactory);
    this.activeTab = index;
    if(this.isTabActive(0) == true){
      this.courseType = 'pge';
      this.components = this.courseConfigService.getComponents(this.courseType);
    }else{
      
    }

  }

  isTabActive(index: number): boolean {
    return this.activeTab === index;
  }

  alterarCourseType(valor: string) {
    this.courseType = valor;
    this.changeComponents(1);
  }

  changeComponents(activeTab: number) {
    this.components = this.courseConfigService.getComponents(this.courseType);
    this.activeTab = activeTab;
    this.loadComponent(activeTab);
  }

  changeValidityByComponentName(componentType: Type<any>, validity: boolean): void {
    const index = this.components.findIndex(component => component.component === componentType);
    if (index !== -1 && this.isTabActive(index)) {
      this.components[index].validity = validity;
    }
  }
  
}
