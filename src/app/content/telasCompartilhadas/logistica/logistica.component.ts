import { Component } from '@angular/core';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { ContentComponent } from '../../content.component';
import { Alimento } from 'src/app/shared/utilitarios/alimento';
import { Uniforme } from 'src/app/shared/utilitarios/uniforme';
import { Material } from 'src/app/shared/utilitarios/material';

@Component({
  selector: 'app-logistica',
  templateUrl: './logistica.component.html',
  styleUrls: ['./logistica.component.css']
})
export class LogisticaComponent {
  alimentos: Alimento[] = [];
  uniformes: Uniforme[] = [];
  materiaisIndividuais: Material[] = [];
  materiaisColetivos: Material[] = [];
  itemAlimDesc: string = '';
  itemAlimUnid: string = '';
  itemUniformeDesc: string = '';
  itemMaterialIndividualDesc: string = '';
  itemMaterialColetivoDesc: string = '';
  editandoIndexAlimento: number = -1;
  editandoIndexUniforme: number = -1;
  editandoIndexMatInd: number = -1;
  editandoIndexMatCol: number = -1;

  constructor(private contentComponent: ContentComponent, private cursoService: CursoService) {}

  ngOnInit(): void {
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (cursoEscolhido) {
      if (cursoEscolhido.alimentos) {
        this.alimentos = cursoEscolhido.alimentos;
      }
      if (cursoEscolhido.uniformes) {
        this.uniformes = cursoEscolhido.uniformes;
      }
      if (cursoEscolhido.materialIndividual) {
        this.materiaisIndividuais = cursoEscolhido.materialIndividual;
      }
      if (cursoEscolhido.materialColetivo) {
        this.materiaisColetivos = cursoEscolhido.materialColetivo;
      }
    }
  }

  ngAfterViewInit() {
    this.isFormValid();
  }

  isFormValid(): void {
    if (this.uniformes.length > 0) {
      this.contentComponent.changeValidityByComponentName(LogisticaComponent, true);
    } else {
      this.contentComponent.changeValidityByComponentName(LogisticaComponent, false);
    }
  }

  
  // Função para adicionar um item à tabela de Alimentos
  adicionarAlimento(descricao: string, unidade: string) {
    if(descricao){
      this.alimentos.push({ descricao, unidade});
      this.cursoService.setAlimentosEscolhidoID( this.alimentos);
      this.limparCamposAlimento();
    }
  }

  // Função para adicionar um item à tabela de Uniformes
  adicionarUniforme(descricao: string) {
    if(descricao){
      this.uniformes.push({ descricao });
      this.cursoService.setUniformesEscolhidoID( this.uniformes);
      this.limparCamposUniforme();
    }
  }

  adicionarMaterialIndividual(descricao: string) {
    if(descricao){
      this.materiaisIndividuais.push({ descricao });
      this.cursoService.setMaterialEscolhidoID(this.materiaisIndividuais,"Individual");
      this.limparCamposMaterialIndividual();
    }
  }

  adicionarMaterialColetivo(descricao: string) {
    if(descricao){
      this.materiaisColetivos.push({ descricao });
      this.cursoService.setMaterialEscolhidoID(this.materiaisIndividuais,"Coletivo");
      this.limparCamposMaterialColetivo();
    }
  }

  // Função para remover um item de uma tabela pelo índice
  removerItem(tabela: string, index: number) {
    if (tabela === 'alimentos') {
      this.alimentos.splice(index, 1);
      this.cursoService.setAlimentosEscolhidoID( this.alimentos);
    } else if (tabela === 'uniformes') {
      this.uniformes.splice(index, 1);
      this.cursoService.setUniformesEscolhidoID( this.uniformes);
    } else if (tabela === 'materiaisIndividuais') {
      this.materiaisIndividuais.splice(index, 1);
      this.cursoService.setMaterialEscolhidoID(this.materiaisIndividuais,"Individual");
    } else if (tabela === 'materiaisColetivos') {
      this.materiaisColetivos.splice(index, 1);
      this.cursoService.setMaterialEscolhidoID(this.materiaisIndividuais,"Coletivo");
    }
  }
  editarItem(tabela: string, index: number) {
    if (tabela === 'alimentos') {
      this.editandoIndexAlimento = index;
      this.cursoService.setAlimentosEscolhidoID( this.alimentos);
    } else if (tabela === 'uniformes') {
      this.editandoIndexUniforme = index;
      this.cursoService.setUniformesEscolhidoID( this.uniformes);
    } else if (tabela === 'materiaisIndividuais') {
      this.editandoIndexMatInd = index;
      this.cursoService.setMaterialEscolhidoID(this.materiaisIndividuais,"Individual");
    } else if (tabela === 'materiaisColetivos') {
      this.editandoIndexMatCol = index;
      this.cursoService.setMaterialEscolhidoID(this.materiaisIndividuais,"Coletivo");
    }
  }
  confirmarEdicaoItem(tabela: string, index: number) {
    this.editandoIndexAlimento = -1;
    this.editandoIndexUniforme = -1;
    this.editandoIndexMatInd = -1;
    this.editandoIndexMatCol = -1;
  }
  limparCamposAlimento() {
    this.itemAlimDesc = '';
    this.itemAlimUnid = '';
  }

  limparCamposUniforme() {
    this.itemUniformeDesc = '';
  }

  limparCamposMaterialIndividual() {
    this.itemMaterialIndividualDesc = '';
  }

  limparCamposMaterialColetivo() {
    this.itemMaterialColetivoDesc = '';
  }
}
