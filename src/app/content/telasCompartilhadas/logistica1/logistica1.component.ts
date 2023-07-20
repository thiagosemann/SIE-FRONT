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
  alimentos: Subsubitem[] = [];
  mostrarExplicacaoAlimentos = false;

  uniformes : Subitem[] = [];
  uniformesSelect : any[] = [];
  mostrarExplicacaoUniformes = false;

  materiaisIndividuais: Subsubitem[] = [];
  mostrarExplicacaoMateriaisIndividuais = false;

  materiaisColetivos: Subsubitem[] = [];
  mostrarExplicacaoMateriaisColetivos = false;

  constructor(private contentComponent: ContentComponent, private cursoService: CursoService) {}

  ngOnInit(): void {
    this.uniformesSelect = ["5A operacional","TFM"];
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (cursoEscolhido) {

    }
  }
  isFormValid(): void {

  }

  // ---------------------------------------------------------------Alimentos---------------------------------------------------------------------------//
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
    this.cursoService.setAtributoByCursoEscolhidoID('alimentos',this.alimentos)

    this.isFormValid();
  }

  removerAlimento(indexRequisito: number) {
    this.alimentos.splice(indexRequisito, 1);
    this.subsubsubitensTemp.splice(indexRequisito, 1);
    this.reorganizarNumeracao(this.alimentos)
    this.cursoService.setAtributoByCursoEscolhidoID('alimentos',this.alimentos)
    this.isFormValid();
  }

  toggleExplicacaoAlimentos() {
    this.mostrarExplicacaoAlimentos = !this.mostrarExplicacaoAlimentos;
  }
  // ---------------------------------------------------------------Uniformes---------------------------------------------------------------------------//
  adicionarUniforme(novoRequisito: string) {
    if (novoRequisito) {
      const subItem = {
        tipo: "subitem",
        letra: String.fromCharCode(65 + this.uniformes.length).toLocaleLowerCase() + ")",
        texto: novoRequisito,
        subsubitens: []
      };
      this.uniformes.push(subItem);
      const indexRemocao = this.uniformesSelect.findIndex(uniforme => uniforme === subItem.texto);
      if (indexRemocao !== -1) {
        this.uniformesSelect.splice(indexRemocao, 1); // Remove o elemento encontrado do array
      }
      this.subsubsubitensTemp.push('');
    }
    this.cursoService.setAtributoByCursoEscolhidoID('uniformes',this.uniformes)
    this.isFormValid();
  }
  
  removerUniforme(indexRequisito: number) {
    this.uniformesSelect.push(this.uniformes[indexRequisito].texto)
    this.uniformes.splice(indexRequisito, 1);
    this.subsubsubitensTemp.splice(indexRequisito, 1);
    this.reorganizarNumeracao(this.uniformes)
    this.cursoService.setAtributoByCursoEscolhidoID('uniformes',this.uniformes)
    this.isFormValid();
  }
  toggleExplicacaoUniformes() {
    this.mostrarExplicacaoUniformes = !this.mostrarExplicacaoUniformes;
  }
  // ---------------------------------------------------------------MateriaisIndividuais---------------------------------------------------------------------------//
  adicionarMaterialIndividual(novoRequisito: string) {
    if (novoRequisito) {
      const subItem = {
        tipo: "subitem",
        letra: "("+(this.materiaisIndividuais.length+1).toString() + ")",
        texto: novoRequisito,
        subsubsubitens: []
      };
      this.materiaisIndividuais.push(subItem);
      this.subsubsubitensTemp.push('');
    }
    this.cursoService.setAtributoByCursoEscolhidoID('materiaisIndividuais',this.materiaisIndividuais)
    this.isFormValid();
  }

  removerMaterialIndividual(indexRequisito: number) {
    this.materiaisIndividuais.splice(indexRequisito, 1);
    this.subsubsubitensTemp.splice(indexRequisito, 1);
    this.reorganizarNumeracao(this.materiaisIndividuais)
    this.cursoService.setAtributoByCursoEscolhidoID('materiaisIndividuais',this.materiaisIndividuais)
    this.isFormValid();
  }

  toggleExplicacaoMateriaisIndividuais() {
    this.mostrarExplicacaoMateriaisIndividuais = !this.mostrarExplicacaoMateriaisIndividuais;
  }
    // ---------------------------------------------------------------MateriaisColetivos---------------------------------------------------------------------------//
    adicionarMaterialColetivo(novoRequisito: string) {
      if (novoRequisito) {
        const subItem = {
          tipo: "subitem",
          letra: "("+(this.materiaisColetivos.length+1).toString() + ")",
          texto: novoRequisito,
          subsubsubitens: []
        };
        this.materiaisColetivos.push(subItem);
        this.subsubsubitensTemp.push('');
      }
      this.cursoService.setAtributoByCursoEscolhidoID('materiaisColetivos',this.materiaisColetivos)
      this.isFormValid();
    }
  
    removerMaterialColetivo(indexRequisito: number) {
      this.materiaisColetivos.splice(indexRequisito, 1);
      this.subsubsubitensTemp.splice(indexRequisito, 1);
      this.reorganizarNumeracao(this.materiaisColetivos)
      this.cursoService.setAtributoByCursoEscolhidoID('materiaisColetivos',this.materiaisColetivos)
      this.isFormValid();

    }
  
    toggleExplicacaoMateriaisColetivos() {
      this.mostrarExplicacaoMateriaisColetivos = !this.mostrarExplicacaoMateriaisColetivos;
    }

    // ---------------------------------------------------------------Utilitários---------------------------------------------------------------------------//

    private reorganizarNumeracao(objetos: any[]) {
      for (let i = 0; i < objetos.length; i++) {
        objetos[i].letra = `(${i + 1})`;
      }
    }
}

