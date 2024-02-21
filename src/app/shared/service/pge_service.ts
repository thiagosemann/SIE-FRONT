import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pge } from '../utilitarios/pge';
import { AuthenticationService } from './authentication';

@Injectable({
  providedIn: 'root'
})
export class PgeService {
  private url = 'http://localhost:3333/pge'; // URL específica para o serviço PGE

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  getPge(): Observable<Pge[]> {
    const headers = this.getHeaders();
    return this.http.get<Pge[]>(this.url, { headers });
  }

  updatePgeById(id: number, updatedPge: any): Observable<any> {
    const headers = this.getHeaders();
    const apiUrl = `${this.url}/${id}`; // Assuming the API endpoint for updating includes the ID in the URL
    return this.http.put(apiUrl, updatedPge, { headers });
  }
}
