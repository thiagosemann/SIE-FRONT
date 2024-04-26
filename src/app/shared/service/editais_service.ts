import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Edital } from '../utilitarios/edital'; // Certifique-se de importar o modelo correto

@Injectable({
  providedIn: 'root'
})
export class EditalService {
  private url = 'http://localhost:3333/editais';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  createEdital(edital: Edital): Observable<Edital> {
    const headers = this.getHeaders();
    return this.http.post<Edital>(this.url, edital, { headers });
  }

  updateEdital(edital: Edital): Observable<any> {
    const headers = this.getHeaders();
    const editalId = edital.id; // Substitua 'id' pelo nome correto da propriedade do seu modelo
    return this.http.put(`${this.url}/${editalId}`, edital, { headers });
  }

  getAllEditais(): Observable<Edital[]> {
    const headers = this.getHeaders();
    return this.http.get<Edital[]>(this.url, { headers });
  }

  getEditalById(id: number): Observable<Edital> {
    const editalUrl = `${this.url}/${id}`;
    const headers = this.getHeaders();
    return this.http.get<Edital>(editalUrl, { headers });
  }

  deleteEditalById(id: number): Observable<any> {
    const editalUrl = `${this.url}/${id}`;
    const headers = this.getHeaders();
    return this.http.delete(editalUrl, { headers });
  }

  getEditaisByBBM(bbm: string): Observable<Edital[]> {
    const headers = this.getHeaders();
    const bbmUrl = `${this.url}/bbm/${bbm}`;
    return this.http.get<Edital[]>(bbmUrl, { headers });
  }
  getEditaisByProcNum(numeroProcesso: string): Observable<Edital[]> {
    const headers = this.getHeaders();
    const bbmUrl = `${this.url}/numeroProcesso/${numeroProcesso}`;
    return this.http.get<Edital[]>(bbmUrl, { headers });
  }
}
