import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Documento } from '../../utilitarios/documentoPdf';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  private baseUrl = 'http://localhost:3333'; // Altere a URL base de acordo com a sua configuração

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  createDocumento(documento: Documento): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.baseUrl}/documents`, documento, { headers });
  }

  deleteDocumento(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(`${this.baseUrl}/documents/${id}`, { headers });
  }

  updateDocumento(id: number, documento: Documento): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.baseUrl}/documents/${id}`, documento, { headers });
  }

  getDocumentoById(id: number): Observable<Documento> {
    const headers = this.getHeaders();
    return this.http.get<Documento>(`${this.baseUrl}/documents/${id}`, { headers });
  }

  getDocumentoByNome(nome: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}/documents/name/${nome}`, { headers });
  }
  getDocumentos(): Observable<Documento[]> {
    const headers = this.getHeaders();
    return this.http.get<Documento[]>(`${this.baseUrl}/documents`, { headers });
  }
}
