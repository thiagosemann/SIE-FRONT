import { Injectable } from '@angular/core';
import { Curso } from '../utilitarios/objetoCurso';

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
  }
}
