import { Component } from '@angular/core';
import { Requisito } from 'src/app/shared/utilitarios/requisito';
import { ContentComponent } from '../../content.component';
import { CursoService } from 'src/app/shared/service/objetosCursosService';

@Component({
  selector: 'app-requisitos-complementares',
  templateUrl: './requisitos-complementares.component.html',
  styleUrls: ['./requisitos-complementares.component.css']
})
export class RequisitosComplementaresComponent {
  requisitos: Requisito[] = [];
  subitensTemp: string[] = [];

  constructor(private contentComponent : ContentComponent, private cursoService: CursoService) {}

  ngOnInit(): void {
       
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (cursoEscolhido) {
      if (cursoEscolhido.requisitoComplementar) {
        this.requisitos = cursoEscolhido.requisitoComplementar
      }
    }
  }

  ngAfterViewInit() {
    this.isFormValid();
  }

  isFormValid(): void {
    if(this.requisitos.length >0){
      this.contentComponent.changeValidityByComponentName(RequisitosComplementaresComponent, true);
    }else{
      this.contentComponent.changeValidityByComponentName(RequisitosComplementaresComponent, false);
    }
  
  }
  adicionarRequisito(novoRequisito: string) {
    if (novoRequisito) {
      const requisito = {
        letra: String.fromCharCode(65 + this.requisitos.length),
        item: novoRequisito,
        subitens: []
      };
      this.requisitos.push(requisito);
      this.subitensTemp.push('');
    }
    this.cursoService.setRequisitoComplementarEscolhidoID(this.requisitos);
    this.isFormValid();
  }

  adicionarSubItem(indexRequisito: number, subitem: string) {
    if (subitem) {
      this.requisitos[indexRequisito].subitens.push(subitem);
      this.subitensTemp[indexRequisito] = '';
    }
  }

  removerRequisito(indexRequisito: number) {
    this.requisitos.splice(indexRequisito, 1);
    this.subitensTemp.splice(indexRequisito, 1);
    this.cursoService.setRequisitoComplementarEscolhidoID(this.requisitos);
    this.isFormValid();
  }

  removerSubItem(indexRequisito: number, indexSubItem: number) {
    this.requisitos[indexRequisito].subitens.splice(indexSubItem, 1);
  }
}
