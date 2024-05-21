import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Docente } from '../utilitarios/docente'; // Importe o modelo RFC correspondente

@Injectable({
  providedIn: 'root'
})
export class ProfessoresByDocumentoService {
  private url = 'http://localhost:3333/professoresByDocumento'; // URL da sua API

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }
  
  getDocentesByDocumentoId(id: number): Observable<Docente[]> { // Alterado para Observable<Discente[]>
    const rfcUrl = `${this.url}/${id}`;
    const headers = this.getHeaders();
    return this.http.get<Docente[]>(rfcUrl, { headers }); // Alterado para Observable<Discente[]>
  }
  

}
