import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AtividadeHomologada } from '../utilitarios/atividadeHomologada';

@Injectable({
  providedIn: 'root'
})
export class AtividadeHomologadaService {
  private url = 'http://localhost:3333/atividadeHomologada';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  getAtividade(): Observable<AtividadeHomologada[]> {
    const headers = this.getHeaders();
    return this.http.get<AtividadeHomologada[]>(this.url, { headers });
  }

  getAtividadeBySigla(sigla: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.url}/sigla/${sigla}`, { headers });
  }

  getAllAtividadeHomologadaVersionsById(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.url}/versions/${id}`, { headers });
  }
  // Função para atualizar uma atividade homologada
  updateAtividadeHomologada(atividade: AtividadeHomologada): Observable<any> {
      const headers = this.getHeaders();
      const atividadeId = atividade.id; // Assuming the User object has an 'id' property
      return this.http.put(`${this.url}/${atividadeId}`, atividade, { headers });
  }
  // Função para excluir uma atividade homologada
  deleteAtividadeHomologada(atividadeId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.url}/${atividadeId}`, { headers });
  }
  
  addAtividadeHomologada(atividade: AtividadeHomologada): Observable<AtividadeHomologada> {
    const headers = this.getHeaders();
    return this.http.post<AtividadeHomologada>(this.url, atividade, { headers });
  }
}
