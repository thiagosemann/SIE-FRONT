import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, ComponentRef, Type, OnInit } from '@angular/core';
import { CourseConfigService, ComponentItem } from '../shared/service/CourseConfigService';
import { PgeComponent } from './telasCompartilhadas/pge/pge.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  public components: ComponentItem[] = [];
  courseType: string = 'aberturaTreinamentoMilitar';
  activeTab: number = 1; // Define a segunda aba como ativa

  @ViewChild('componentHost', { read: ViewContainerRef, static: true }) componentHost!: ViewContainerRef;

  private currentComponent?: ComponentRef<any>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private courseConfigService: CourseConfigService
  ) { }

  ngOnInit() {
    // Assume you have the course type, replace 'aberturaCursoMilitar' with the actual course type
    this.changeComponents(0)
  }

  loadComponent(index: number) {
    // Destroy the current component if it exists
    if (this.currentComponent) {
      this.currentComponent.destroy();
    }

    // Create a new instance of the component
    const component = this.components[index].component;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.currentComponent = this.componentHost.createComponent(componentFactory);
  }
  alterarCourseType(valor: string) {
    console.log(valor)
    this.courseType = valor;
    this.changeComponents(1);
  }
  changeComponents(activeTab:number){
    ;
    this.components = this.courseConfigService.getComponents(this.courseType);
    // Load the first component by default
    if (this.components.length > 0) {
      this.loadComponent(0);
    }
    this.activeTab = activeTab
    this.loadComponent(activeTab);

  }
}
