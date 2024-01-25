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
  
  addUser(user: User): Observable<User> {
    const headers = this.getHeaders();
    return this.http.post<User>(this.url, user, { headers });
  }

  updateUser(user: User): Observable<any> {
    const headers = this.getHeaders();
    const userId = user.id; // Assuming the User object has an 'id' property
    return this.http.put(`${this.url}/${userId}`, user, { headers });
  }

  updateUsersInBatch(users: User[]): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.url}/batch`, users, { headers });
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
