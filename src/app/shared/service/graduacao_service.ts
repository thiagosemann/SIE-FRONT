import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Graduacao } from '../utilitarios/graduacao';

@Injectable({
  providedIn: 'root'
})
export class GraduacaoService {
  private url = 'http://localhost:3333/graduacoes';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }
  
  addGraduacao(graduacao: Graduacao): Observable<Graduacao> {
    const headers = this.getHeaders();
    return this.http.post<Graduacao>(this.url, graduacao, { headers });
  }

  updateGraduacao(graduacao: Graduacao): Observable<any> {
    const headers = this.getHeaders();
    const graduacaoId = graduacao.id; // Assuming the Graduacao object has an 'id' property
    return this.http.put(`${this.url}/${graduacaoId}`, graduacao, { headers });
  }

  getGraduacoes(): Observable<Graduacao[]> {
    const headers = this.getHeaders();
    return this.http.get<Graduacao[]>(this.url, { headers });
  }

  getGraduacaoById(id: number): Observable<Graduacao> {
    const graduacaoUrl = `${this.url}/${id}`;
    const headers = this.getHeaders();
    return this.http.get<Graduacao>(graduacaoUrl, { headers });
  }

  deleteGraduacaoById(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.url}/${id}`, { headers });
  }
}
