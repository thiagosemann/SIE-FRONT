import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../utilitarios/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://localhost:3333/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  getUsers(): Observable<User[]> {
    const headers = this.getHeaders();
    return this.http.get<User[]>(this.url, { headers });
  }

  getUserByMtcl(mtcl: string): Observable<User> {
    const userUrl = `${this.url}/${mtcl}`;
    const headers = this.getHeaders();
    return this.http.get<User>(userUrl, { headers });
  }
}
