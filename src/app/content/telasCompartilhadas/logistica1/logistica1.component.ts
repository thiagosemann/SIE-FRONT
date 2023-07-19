import { Component } from '@angular/core';
import { Subitem, Subsubitem } from 'src/app/shared/utilitarios/documentoPdf';
import { ContentComponent } from '../../content.component';
import { CursoService } from 'src/app/shared/service/objetosCursosService';

@Component({
  selector: 'app-logistica1',
  templateUrl: './logistica1.component.html',
  styleUrls: ['./logistica1.component.css']
})
export class Logistica1Component {
  subsubsubitensTemp: string[] = [];
  uniformes : Subitem[] = [];
  alimentos: Subsubitem[] = [];
  constructor(private contentComponent: ContentComponent, private cursoService: CursoService) {}

  ngOnInit(): void {
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (cursoEscolhido) {

    }
  }
  isFormValid(): void {

  }
  adicionarAlimento(novoRequisito: string) {
    if (novoRequisito) {
      const subItem = {
        tipo: "subitem",
        letra: "("+(this.alimentos.length+1).toString() + ")",
        texto: novoRequisito,
        subsubsubitens: []
      };
      this.alimentos.push(subItem);
      this.subsubsubitensTemp.push('');
    }
    //this.cursoService.setRequisitoComplementarEscolhidoID(this.requisitosComplementares);
    this.isFormValid();
  }

  removerAlimento(indexRequisito: number) {
    this.alimentos.splice(indexRequisito, 1);
    this.subsubsubitensTemp.splice(indexRequisito, 1);
    //this.cursoService.setRequisitoComplementarEscolhidoID(this.requisitosComplementares);
    this.isFormValid();
  }
  adicionarUniforme(novoRequisito: string) {
    if (novoRequisito) {
      const subItem = {
        tipo: "subitem",
        letra: String.fromCharCode(65 + this.uniformes.length).toLocaleLowerCase() + ")",
        texto: novoRequisito,
        subsubitens: []
      };
      this.uniformes.push(subItem);
      this.subsubsubitensTemp.push('');
    }
    //this.cursoService.setRequisitoComplementarEscolhidoID(this.requisitosComplementares);
    this.isFormValid();
  }
  removerUniforme(indexRequisito: number) {
    this.uniformes.splice(indexRequisito, 1);
    this.subsubsubitensTemp.splice(indexRequisito, 1);
    //this.cursoService.setRequisitoComplementarEscolhidoID(this.requisitosComplementares);
    this.isFormValid();
  }


}
