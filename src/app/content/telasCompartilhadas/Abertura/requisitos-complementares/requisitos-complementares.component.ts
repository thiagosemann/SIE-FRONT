import { Component } from '@angular/core';
import { Subitem } from 'src/app/shared/utilitarios/documentoPdf';
import { ContentComponent } from '../../../content.component';
import { CursoService } from 'src/app/shared/service/objetosCursosService';

@Component({
  selector: 'app-requisitos-complementares',
  templateUrl: './requisitos-complementares.component.html',
  styleUrls: ['./requisitos-complementares.component.css']
})
export class RequisitosComplementaresComponent {
  requisitos: Subitem[] = [];
  subsubitensTemp: string[] = [];
  requisitosEspecificos : Subitem[] = [];
  
  constructor(private contentComponent : ContentComponent, private cursoService: CursoService) {}

  ngOnInit(): void {
       
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (cursoEscolhido) {
      if (cursoEscolhido.requisitoComplementar) {
        this.requisitos = cursoEscolhido.requisitoComplementar
      }
      if (cursoEscolhido.requisitoEspecifico) {
        this.requisitosEspecificos = cursoEscolhido.requisitoEspecifico
      }
      console.log( this.requisitosEspecificos)
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
  transformarRequisitoEspecificoEmItem(requisitoEsp:string){
    const linhas = requisitoEsp.split('\n');
    const arrayObjetos = [];
  
    for (const linha of linhas) {
      const letra = linha.charAt(0);
      const texto = linha.substring(2).trim();
  
      const objeto = {
        tipo: 'subitem',
        letra: letra + ")",
        texto: texto,
        subsubitens: []
      };
  
      arrayObjetos.push(objeto);
    }
  
    return arrayObjetos;
  }

  adicionarRequisito(novoRequisito: string) {
    if (novoRequisito) {
      const subItem = {
        tipo:"subitem",
        letra: String.fromCharCode(65 + this.requisitos.length).toLocaleLowerCase() + ")",
        texto: novoRequisito,
        subsubitens: []
      };
      this.requisitos.push(subItem);
      this.subsubitensTemp.push('');
    }
    this.cursoService.setAtributoByCursoEscolhidoID('requisitoComplementar',this.requisitos)
    this.isFormValid();
  }

  adicionarSubsubItem(indexRequisito: number, subsubitemString: string) {
    if (subsubitemString) {
      const subsubItem = {
        tipo:"subitem",
        letra: "("+(this.requisitos[indexRequisito].subsubitens.length+1).toString()+ ")",
        texto: subsubitemString,
        subsubsubitens: []
      };
      this.requisitos[indexRequisito].subsubitens.push(subsubItem);
      this.subsubitensTemp[indexRequisito] = '';
    }
  }

  removerRequisito(indexRequisito: number) {
    this.requisitos.splice(indexRequisito, 1);
    this.subsubitensTemp.splice(indexRequisito, 1);
    this.reorganizarLetras(this.requisitos)

    this.cursoService.setAtributoByCursoEscolhidoID('requisitoComplementar',this.requisitos)
    this.isFormValid();
  }

  removerSubsubItem(indexRequisito: number, indexSubsubItem: number) {
    this.requisitos[indexRequisito].subsubitens.splice(indexSubsubItem, 1);
    this.reorganizarNumeracao(this.requisitos[indexRequisito].subsubitens)
  }

  private reorganizarNumeracao(objetos: any[]) {
    for (let i = 0; i < objetos.length; i++) {
      objetos[i].letra = `(${i + 1})`;
    }
  }
  private reorganizarLetras(objetos: any[]) {
    for (let i = 0; i < objetos.length; i++) {
      objetos[i].letra = `${this.getLetraFromIndex(i)})`;
    }
  }
  private getLetraFromIndex(index: number): string {
    const baseCharCode = "a".charCodeAt(0);
    const numLetters = 26; // Número de letras no alfabeto
  
    const letterIndex = index % numLetters;
    const letter = String.fromCharCode(baseCharCode + letterIndex);
  
    return letter;
  }
}
