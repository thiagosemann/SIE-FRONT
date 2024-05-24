import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagamentoDiariaDeCurso } from '../utilitarios/pagamentoDiariaDeCurso'; // Importe o modelo correspondente

@Injectable({
  providedIn: 'root'
})
export class PagamentoDiariaDeCursoService {
  private url = 'http://localhost:3333/pagamentoDiariaDeCurso'; // URL da sua API

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  addPagamentoDiariaDeCurso(pagamentosDiariaDeCurso: PagamentoDiariaDeCurso[]): Observable<PagamentoDiariaDeCurso[]> {
    const headers = this.getHeaders();
    return this.http.post<PagamentoDiariaDeCurso[]>(this.url, pagamentosDiariaDeCurso, { headers });
  }

  updatePagamentoDiariaDeCurso(pagamentoDiariaDeCurso: PagamentoDiariaDeCurso): Observable<any> {
    const headers = this.getHeaders();
    const pagamentoDiariaDeCursoId = pagamentoDiariaDeCurso.id; // Assumindo que o objeto PagamentoDiariaDeCurso tem uma propriedade 'id'
    return this.http.put(`${this.url}/${pagamentoDiariaDeCursoId}`, pagamentoDiariaDeCurso, { headers });
  }

  getPagamentosDiariaDeCurso(): Observable<PagamentoDiariaDeCurso[]> {
    const headers = this.getHeaders();
    return this.http.get<PagamentoDiariaDeCurso[]>(this.url, { headers });
  }

  getPagamentoDiariaDeCursoById(id: number): Observable<PagamentoDiariaDeCurso> {
    const pagamentoDiariaDeCursoUrl = `${this.url}/${id}`;
    const headers = this.getHeaders();
    return this.http.get<PagamentoDiariaDeCurso>(pagamentoDiariaDeCursoUrl, { headers });
  }

  deletePagamentoDiariaDeCursoById(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.url}/${id}`, { headers });
  }
  
  getPagamentoByCompiladoId(compiladoId: number): Observable<PagamentoDiariaDeCurso[]> {
    const pagamentoDiariaDeCursoUrl = `${this.url}/compilado/${compiladoId}`;
    const headers = this.getHeaders();
    return this.http.get<PagamentoDiariaDeCurso[]>(pagamentoDiariaDeCursoUrl, { headers });
  }
}
