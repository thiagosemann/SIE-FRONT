import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inscricao } from '../utilitarios/inscricao';

@Injectable({
  providedIn: 'root'
})
export class InscricaoService {
  private url = 'http://localhost:3333/inscricoes';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }
  
  addInscricao(inscricao: Inscricao): Observable<Inscricao> {
    const headers = this.getHeaders();
    return this.http.post<Inscricao>(this.url, inscricao, { headers });
  }

  updateInscricao(inscricao: Inscricao): Observable<any> {
    const headers = this.getHeaders();
    const inscricaoId = inscricao.id; // Assuming the Inscricao object has an 'id' property
    return this.http.put(`${this.url}/${inscricaoId}`, inscricao, { headers });
  }

  getInscricoes(): Observable<Inscricao[]> {
    const headers = this.getHeaders();
    return this.http.get<Inscricao[]>(this.url, { headers });
  }

  getInscricaoById(id: number): Observable<Inscricao> {
    const inscricaoUrl = `${this.url}/${id}`;
    const headers = this.getHeaders();
    return this.http.get<Inscricao>(inscricaoUrl, { headers });
  }

  deleteInscricaoById(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.url}/${id}`, { headers });
  }
  getInscricoesByDocument(documentosCriadosId: number): Observable<Inscricao[]> {
    const inscricoesUrl = `${this.url}/documento/${documentosCriadosId}`;
    const headers = this.getHeaders();
    return this.http.get<Inscricao[]>(inscricoesUrl, { headers });
  }
}
