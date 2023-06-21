import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from '../utilitarios/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://10.121.60.52:3333/tasks';
  private users: User[] = [];
  private userListSubject: Subject<User[]> = new Subject<User[]>();

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  addUser(user: User): Observable<any> {
    return this.http.post(this.url, user);
  }

  updateUserList(): void {
    this.getUsers().subscribe(users => {
      this.users = users;
      this.userListSubject.next(this.users); // Notifica os componentes sobre a atualização da lista
    });
  }

  getUserList(): User[] {
    return this.users;
  }

  getUserListObservable(): Observable<User[]> {
    return this.userListSubject.asObservable();
  }

  loadUserList(): Observable<User[]> {
    this.updateUserList();
    return this.getUserListObservable();
  }
}