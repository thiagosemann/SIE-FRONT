import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RFC } from '../utilitarios/rfc'; // Importe o modelo RFC correspondente

@Injectable({
  providedIn: 'root'
})
export class RFCService {
  private url = 'http://localhost:3333/rfc'; // URL da sua API

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }
  
  addRFC(rfc: RFC): Observable<RFC> {
    const headers = this.getHeaders();
    return this.http.post<RFC>(this.url, rfc, { headers });
  }

  updateRFC(rfc: RFC): Observable<any> {
    const headers = this.getHeaders();
    const rfcId = rfc.id; // Assumindo que o objeto RFC tem uma propriedade 'id'
    return this.http.put(`${this.url}/${rfcId}`, rfc, { headers });
  }

  getRFCs(): Observable<RFC[]> {
    const headers = this.getHeaders();
    return this.http.get<RFC[]>(this.url, { headers });
  }

  getRFCById(id: number): Observable<RFC> {
    const rfcUrl = `${this.url}/${id}`;
    const headers = this.getHeaders();
    return this.http.get<RFC>(rfcUrl, { headers });
  }

  deleteRFCById(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.url}/${id}`, { headers });
  }
}
