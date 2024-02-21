import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../utilitarios/objetoCurso'; // Certifique-se de importar o modelo (interface) Curso adequado

@Injectable({
  providedIn: 'root'
})
export class DocumentosCriadosService {
  private baseUrl = 'http://localhost:3333'; // Altere a URL base de acordo com a sua configuração

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  createCurso(objeto: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.baseUrl}/documentosCriados`, objeto, { headers });
  }

  deleteCurso(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(`${this.baseUrl}/documentosCriados/${id}`, { headers });
  }

  updateCurso(id: number, curso: Curso): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.baseUrl}/documentosCriados/${id}`, curso, { headers });
  }

  getCursoById(id: number): Observable<Curso> {
    const headers = this.getHeaders();
    return this.http.get<Curso>(`${this.baseUrl}/documentosCriados/id/${id}`, { headers });
  }

  getCursoByAuth(auth: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}/documentosCriados/auth/${auth}`, { headers });
  }


}
