import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompiladoPagamento } from '../utilitarios/compiladoPagamento'; // Importe o modelo correspondente

@Injectable({
  providedIn: 'root'
})
export class CompiladoPagamentoService {
  private url = 'http://localhost:3333/compiladoPagamento'; // URL da sua API

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }
  
  addCompiladoPagamento(compiladoPagamento: CompiladoPagamento): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<CompiladoPagamento>(this.url, compiladoPagamento, { headers });
  }

  updateCompiladoPagamento(compiladoPagamento: CompiladoPagamento): Observable<any> {
    const headers = this.getHeaders();
    const compiladoPagamentoId = compiladoPagamento.id; // Assumindo que o objeto CompiladoPagamento tem uma propriedade 'id'
    return this.http.put(`${this.url}/${compiladoPagamentoId}`, compiladoPagamento, { headers });
  }

  getCompiladosPagamento(): Observable<CompiladoPagamento[]> {
    const headers = this.getHeaders();
    return this.http.get<CompiladoPagamento[]>(this.url, { headers });
  }

  getCompiladoPagamentoById(id: number): Observable<CompiladoPagamento> {
    const compiladoPagamentoUrl = `${this.url}/${id}`;
    const headers = this.getHeaders();
    return this.http.get<CompiladoPagamento>(compiladoPagamentoUrl, { headers });
  }

  deleteCompiladoPagamentoById(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.url}/${id}`, { headers });
  }
}
