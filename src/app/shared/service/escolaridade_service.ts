import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Escolaridade } from '../utilitarios/escolaridade';

@Injectable({
  providedIn: 'root'
})
export class EscolaridadeService {
  private url = 'http://localhost:3333/escolaridades';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }
  
  addEscolaridade(escolaridade: Escolaridade): Observable<Escolaridade> {
    const headers = this.getHeaders();
    return this.http.post<Escolaridade>(this.url, escolaridade, { headers });
  }

  updateEscolaridade(escolaridade: Escolaridade): Observable<any> {
    const headers = this.getHeaders();
    const escolaridadeId = escolaridade.id; // Assuming the Escolaridade object has an 'id' property
    return this.http.put(`${this.url}/${escolaridadeId}`, escolaridade, { headers });
  }

  getEscolaridades(): Observable<Escolaridade[]> {
    const headers = this.getHeaders();
    return this.http.get<Escolaridade[]>(this.url, { headers });
  }

  getEscolaridadeById(id: number): Observable<Escolaridade> {
    const escolaridadeUrl = `${this.url}/${id}`;
    const headers = this.getHeaders();
    return this.http.get<Escolaridade>(escolaridadeUrl, { headers });
  }

  deleteEscolaridadeById(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.url}/${id}`, { headers });
  }
}
