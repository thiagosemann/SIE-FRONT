import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCivil } from '../utilitarios/userCivil'; // Certifique-se de ter a interface correta

@Injectable({
  providedIn: 'root'
})
export class UserCivilService {
  private url = 'http://localhost:3333/usersCivil';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }
  
  createUserCivil(user: UserCivil): Observable<UserCivil> {
    const headers = this.getHeaders();
    return this.http.post<UserCivil>(this.url, user, { headers });
  }

  // Adapte conforme necessário para outras operações

  getUsersCivil(): Observable<UserCivil[]> {
    const headers = this.getHeaders();
    return this.http.get<UserCivil[]>(this.url, { headers });
  }

  getUserCivilById(id: number): Observable<UserCivil> {
    const inscricaoUrl = `${this.url}/${id}`;
    const headers = this.getHeaders();
    return this.http.get<UserCivil>(inscricaoUrl, { headers });
  }

}
