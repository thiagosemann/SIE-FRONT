import { Component } from '@angular/core';
import { Requisito } from 'src/app/shared/utilitarios/requisito';
@Component({
  selector: 'app-requisitos-complementares',
  templateUrl: './requisitos-complementares.component.html',
  styleUrls: ['./requisitos-complementares.component.css']
})
export class RequisitosComplementaresComponent {
  requisitos: Requisito[] = [];
  subitensTemp: string[] = [];

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
  }

  removerSubItem(indexRequisito: number, indexSubItem: number) {
    this.requisitos[indexRequisito].subitens.splice(indexSubItem, 1);
  }
}
