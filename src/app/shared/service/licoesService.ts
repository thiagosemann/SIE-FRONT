import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Licao } from '../utilitarios/licao';

@Injectable({
  providedIn: 'root'
})
export class LicoesService {
  private url = 'http://localhost:3333/licoes'; // URL específica para o serviço PGE

  constructor(private http: HttpClient,) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  getLicoes(): Observable<Licao[]> {
    const headers = this.getHeaders();
    return this.http.get<Licao[]>(this.url, { headers }).pipe();
  }
  getLicoesBySigla(sigla: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.url}/sigla/${sigla}`, { headers });
  }
}
