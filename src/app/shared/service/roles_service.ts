import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../utilitarios/role'; // Certifique-se de importar o modelo correto para a entidade Role

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private url = 'http://localhost:3333/roles';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }
  
  addRole(role: Role): Observable<Role> {
    const headers = this.getHeaders();
    return this.http.post<Role>(this.url, role, { headers });
  }

  updateRole(role: Role): Observable<any> {
    const headers = this.getHeaders();
    const roleId = role.id; // Assuming the Role object has an 'id' property
    return this.http.put(`${this.url}/${roleId}`, role, { headers });
  }

  getRoles(): Observable<Role[]> {
    const headers = this.getHeaders();
    return this.http.get<Role[]>(this.url, { headers });
  }

  getRoleById(id: number): Observable<Role> {
    const roleUrl = `${this.url}/${id}`;
    const headers = this.getHeaders();
    return this.http.get<Role>(roleUrl, { headers });
  }

  deleteRoleById(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.url}/${id}`, { headers });
  }
}
