import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AtividadeHomologada } from '../utilitarios/atividadeHomologada';
@Injectable({
  providedIn: 'root'
})
export class AtividadeHomologadaService {
  private url = 'http://localhost:3333/atividadeHomologada'; // URL específica para o serviço PGE

  constructor(private http: HttpClient,) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  getAtividade(): Observable<AtividadeHomologada[]> {
    const headers = this.getHeaders();
    return this.http.get<AtividadeHomologada[]>(this.url, { headers }).pipe();
  }
  getAtividadeBySigla(sigla: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.url}/sigla/${sigla}`, { headers });
  }
}
