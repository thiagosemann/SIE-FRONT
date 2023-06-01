import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, ComponentRef, Type, OnInit } from '@angular/core';
import { CourseConfigService, ComponentItem } from '../shared/service/CourseConfigService';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  public components: ComponentItem[] = [];

  @ViewChild('componentHost', { read: ViewContainerRef, static: true }) componentHost!: ViewContainerRef;

  private currentComponent?: ComponentRef<any>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private courseConfigService: CourseConfigService
  ) {}

  ngOnInit() {
    // Assume you have the course type, replace 'aberturaCursoMilitar' with the actual course type
    const courseType = 'aberturaTreinamentoMilitar';

    this.components = this.courseConfigService.getComponents(courseType);

    // Load the first component by default
    if (this.components.length > 0) {
      this.loadComponent(0);
    }
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
}
