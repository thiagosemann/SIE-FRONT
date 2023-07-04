import { Injectable } from '@angular/core';
import { Curso } from '../utilitarios/objetoCurso';
import { User } from '../utilitarios/user';
import { Requisito } from '../utilitarios/requisito';
import { Prescricao } from '../utilitarios/prescricao';
import { Alimento } from '../utilitarios/alimento';
import { Uniforme } from '../utilitarios/uniforme';
import { Material } from '../utilitarios/material';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private cursos: Curso[] = [];
  private cursoEscolhidoId: number = 0;

  constructor() { }

  // Método para adicionar um novo curso à lista
  adicionarCurso(curso: Curso): void {
    // Atribui um novo ID ao curso
    this.cursos.push(curso);
  }

  // Método para obter todos os cursos
  getCursos(): Curso[] {
    return this.cursos;
  }

  getIdEscolhido() {
    return this.cursoEscolhidoId;
  }

  getCursoEscolhido(){
    return this.cursos.find(curso => curso.id === this.cursoEscolhidoId);
  }
  
  // Método para encontrar um curso pelo ID e definir como curso escolhido
  setIdCursoEscolhido(id: number): void {
    this.cursoEscolhidoId = id;
  }

  // Método para obter um curso pelo ID
  getCursoById(id: number): Curso | undefined {
    return this.cursos.find(curso => curso.id === id);
  }

  setPropertyOnCursosByCursoEscolhidoID(properties: Partial<Curso>): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      Object.assign(cursoEscolhido, properties);
    }
    console.log(this.getCursos())
  }
  setCoordenadorOnCursosByCursoEscolhidoID(properties: Partial<Curso>): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      cursoEscolhido.coordenador = properties.coordenador;
    }
    console.log(this.getCursos())
  }
  setSelectedProfessorsByCursoEscolhidoID(selectedProfessors: User[]): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      cursoEscolhido.selectedProfessors = selectedProfessors;
    }
    console.log(this.getCursos());
  }
  setRequisitoComplementarEscolhidoID(requisitoComplementar: Requisito[]): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      cursoEscolhido.requisitoComplementar = requisitoComplementar;
    }
    console.log(this.getCursos());
  }
  setPrescricaoComplementarEscolhidoID(prescricaoComplementar: Prescricao[]): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      cursoEscolhido.prescricaoComplementar = prescricaoComplementar;
    }
    console.log(this.getCursos());
  }
  setAlimentosEscolhidoID(alimentos: Alimento[]): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      cursoEscolhido.alimentos = alimentos;
    }
    console.log(this.getCursos());
  }
  setUniformesEscolhidoID(uniformes: Uniforme[]): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      cursoEscolhido.uniformes = uniformes;
    }
    console.log(this.getCursos());
  }  
  setMaterialEscolhidoID(material: Material[], type: string): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      if(type === "Coletivo"){
        cursoEscolhido.materialColetivo = material;
      }else{
        cursoEscolhido.materialIndividual = material;
      }
    }
    console.log(this.getCursos());
  }  

}
