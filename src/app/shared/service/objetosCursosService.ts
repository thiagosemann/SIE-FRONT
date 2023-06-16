import { Injectable } from '@angular/core';
import { Curso } from '../utilitarios/objetoCurso';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private cursos: Curso[] = [];

  constructor() { }

  // Método para adicionar um novo curso à lista
  adicionarCurso(curso: Curso): void {
   // Atribui um novo ID ao curso
    this.cursos.push(curso);
  }

  // Método para atualizar um curso existente na lista
  atualizarCurso(curso: Curso): void {
    const index = this.cursos.findIndex(c => c.id === curso.id);
    if (index !== -1) {
      this.cursos[index] = curso;
    }
  }

  // Método para remover um curso da lista
  removerCurso(id: number): void {
    const index = this.cursos.findIndex(curso => curso.id === id);
    if (index !== -1) {
      this.cursos.splice(index, 1);
    }
  }

  // Método para obter todos os cursos
  getCursos(): Curso[] {
    return this.cursos;
  }

  // Método para obter um curso pelo ID
  getCursoById(id: number): Curso | undefined {
    return this.cursos.find(curso => curso.id === id);
  }
}
