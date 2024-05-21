import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discente } from '../utilitarios/discente'; // Importe o modelo RFC correspondente

@Injectable({
  providedIn: 'root'
})
export class AlunosByDocumentoService {
  private url = 'http://localhost:3333/alunosByDocumento'; // URL da sua API

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }
  
  getAlunosByDocumentoId(id: number): Observable<Discente[]> { // Alterado para Observable<Discente[]>
    const rfcUrl = `${this.url}/${id}`;
    const headers = this.getHeaders();
    return this.http.get<Discente[]>(rfcUrl, { headers }); // Alterado para Observable<Discente[]>
  }
  

}
