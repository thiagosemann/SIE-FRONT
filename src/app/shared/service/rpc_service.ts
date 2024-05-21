import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RPC } from '../utilitarios/rpc'; // Importe o modelo rpc correspondente

@Injectable({
  providedIn: 'root'
})
export class rpcService {
  private url = 'http://localhost:3333/rpc'; // URL da sua API

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }
  
  addRpc(rpc: RPC): Observable<RPC> {
    const headers = this.getHeaders();
    return this.http.post<RPC>(this.url, rpc, { headers });
  }

  updateRpc(rpc: RPC): Observable<any> {
    const headers = this.getHeaders();
    const rpcId = rpc.id; // Assumindo que o objeto rpc tem uma propriedade 'id'
    return this.http.put(`${this.url}/${rpcId}`, rpc, { headers });
  }

  getRpcs(): Observable<RPC[]> {
    const headers = this.getHeaders();
    return this.http.get<RPC[]>(this.url, { headers });
  }

  getRpcById(id: number): Observable<RPC> {
    const rpcUrl = `${this.url}/${id}`;
    const headers = this.getHeaders();
    return this.http.get<RPC>(rpcUrl, { headers });
  }

  deleteRpcById(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.url}/${id}`, { headers });
  }
}
