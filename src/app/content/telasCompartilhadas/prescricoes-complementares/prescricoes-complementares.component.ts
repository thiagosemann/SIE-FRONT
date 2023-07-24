import { Component } from '@angular/core';
import { Item,Subitem, Subsubitem } from 'src/app/shared/utilitarios/documentoPdf';
import { ContentComponent } from '../../content.component';
import { CursoService } from 'src/app/shared/service/objetosCursosService';

@Component({
  selector: 'app-prescricoes-complementares',
  templateUrl: './prescricoes-complementares.component.html',
  styleUrls: ['./prescricoes-complementares.component.css']
})
export class PrescricoesComplementaresComponent {
  prescricoes: Item[] = [];
  subsubitensTemp: string[] = [];

  constructor(private contentComponent: ContentComponent, private cursoService: CursoService) {}

  ngOnInit(): void {
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (cursoEscolhido) {
      if (cursoEscolhido.prescricaoComplementar) {
        this.prescricoes = cursoEscolhido.prescricaoComplementar;
      }
    }
  }

  ngAfterViewInit() {
    this.isFormValid();
  }

  isFormValid(): void {
    if (this.prescricoes.length > 0) {
      this.contentComponent.changeValidityByComponentName(PrescricoesComplementaresComponent, true);
    } else {
      this.contentComponent.changeValidityByComponentName(PrescricoesComplementaresComponent, false);
    }
  }

  adicionarItem(novoItem: string) {
    if (novoItem) {
      const item: Item = {
        tipo: "item",
        texto: novoItem,
        numero: (this.prescricoes.length + 1).toString(),
        subitens: []
      };
      this.prescricoes.push(item);
      this.subsubitensTemp.push('');
    }
    this.cursoService.setAtributoByCursoEscolhidoID('prescricaoComplementar', this.prescricoes);
    this.isFormValid();
  }

  adicionarSubitem(indexItem: number, novoSubitem: string) {
    if (novoSubitem) {
      const subitem: Subitem = {
        tipo: "subitem",
        texto: novoSubitem,
        letra: String.fromCharCode(97 + this.prescricoes[indexItem].subitens.length)+')',
        subsubitens: []
      };
      this.prescricoes[indexItem].subitens.push(subitem);
    }
  }


  removerItem(indexItem: number) {
    this.prescricoes.splice(indexItem, 1);
    this.subsubitensTemp.splice(indexItem, 1);
    this.reorganizarNumeracao(this.prescricoes);
    this.cursoService.setAtributoByCursoEscolhidoID('prescricaoComplementar', this.prescricoes);
    this.isFormValid();
  }

  removerSubitem(indexItem: number, indexSubitem: number) {
    this.prescricoes[indexItem].subitens.splice(indexSubitem, 1);
    this.reorganizarNumeracao(this.prescricoes[indexItem].subitens);
  }


  private reorganizarNumeracao(objetos: any[]) {
    for (let i = 0; i < objetos.length; i++) {
      if (objetos[i].tipo === "item") {
        objetos[i].numero = (i + 1).toString();
      }
      if (objetos[i].subitens) {
        for (let j = 0; j < objetos[i].subitens.length; j++) {
          objetos[i].subitens[j].letra = String.fromCharCode(97 + j);
        }
      }
    }
  }
}
