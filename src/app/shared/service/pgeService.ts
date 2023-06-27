import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Pge } from '../utilitarios/pge';
import { AuthenticationService } from './authentication';
@Injectable({
  providedIn: 'root'
})
export class PgeService {
  private url = 'http://10.121.60.66:3333/pge'; // URL específica para o serviço PGE
  private pgeListSubject: Subject<Pge[]> = new Subject<Pge[]>();

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  getPge(): Observable<Pge[]> {
    const headers = this.getHeaders();
    return this.http.get<Pge[]>(this.url, { headers }).pipe();
  }
}
