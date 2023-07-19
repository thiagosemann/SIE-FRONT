import { Component } from '@angular/core';
import { Subitem } from 'src/app/shared/utilitarios/documentoPdf';
import { ContentComponent } from '../../content.component';
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
        isVisible: 'true',
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
        isVisible:"true",
        subsubitens: []
      };
      this.requisitos.push(subItem);
      this.subsubitensTemp.push('');
    }
    this.cursoService.setRequisitoComplementarEscolhidoID(this.requisitos);
    this.isFormValid();
  }

  adicionarSubsubItem(indexRequisito: number, subsubitemString: string) {
    if (subsubitemString) {
      const subsubItem = {
        tipo:"subitem",
        letra: "("+(this.requisitos[indexRequisito].subsubitens.length+1).toString()+ ")",
        texto: subsubitemString,
        isVisible:"true",
        subsubsubitens: []

      };
      this.requisitos[indexRequisito].subsubitens.push(subsubItem);
      this.subsubitensTemp[indexRequisito] = '';
    }
  }

  removerRequisito(indexRequisito: number) {
    this.requisitos.splice(indexRequisito, 1);
    this.subsubitensTemp.splice(indexRequisito, 1);
    this.cursoService.setRequisitoComplementarEscolhidoID(this.requisitos);
    this.isFormValid();
  }

  removerSubsubItem(indexRequisito: number, indexSubsubItem: number) {
    this.requisitos[indexRequisito].subsubitens.splice(indexSubsubItem, 1);
  }
}
