import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagamentoHoraAula } from '../utilitarios/pagamentoHoraAula'; // Importe o modelo correspondente

@Injectable({
  providedIn: 'root'
})
export class PagamentoHoraAulaService {
  private url = 'http://localhost:3333/pagamentoHoraAula'; // URL da sua API

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }
  
  addPagamentoHoraAula(pagamentosHoraAula: PagamentoHoraAula[]): Observable<PagamentoHoraAula[]> {
    const headers = this.getHeaders();
    return this.http.post<PagamentoHoraAula[]>(this.url, pagamentosHoraAula, { headers });
  }
  updatePagamentoHoraAula(pagamentoHoraAula: PagamentoHoraAula): Observable<any> {
    const headers = this.getHeaders();
    const pagamentoHoraAulaId = pagamentoHoraAula.id; // Assumindo que o objeto PagamentoHoraAula tem uma propriedade 'id'
    return this.http.put(`${this.url}/${pagamentoHoraAulaId}`, pagamentoHoraAula, { headers });
  }

  getPagamentosHoraAula(): Observable<PagamentoHoraAula[]> {
    const headers = this.getHeaders();
    return this.http.get<PagamentoHoraAula[]>(this.url, { headers });
  }

  getPagamentoHoraAulaById(id: number): Observable<PagamentoHoraAula> {
    const pagamentoHoraAulaUrl = `${this.url}/${id}`;
    const headers = this.getHeaders();
    return this.http.get<PagamentoHoraAula>(pagamentoHoraAulaUrl, { headers });
  }

  deletePagamentoHoraAulaById(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.url}/${id}`, { headers });
  }
}
