import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Documento,DataDocumento,Capitulo,Item,Subitem,Subsubitem,TabelaDados,Dados,Vagas,Custos } from '../../utilitarios/documentoPdf';


@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  private baseUrl = 'http://localhost:3333'; // Altere a URL base de acordo com a sua configuração

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  // Métodos para Documento

  getAllDocumentos(): Observable<Documento[]> {
    const url = `${this.baseUrl}/documentos`;
    const headers = this.getHeaders();
    return this.http.get<Documento[]>(url, { headers });
  }

  createDocumento(documento: Documento): Observable<any> {
    const url = `${this.baseUrl}/documentos`;
    const headers = this.getHeaders();
    return this.http.post(url, documento, { headers });
  }

  // Métodos para DataDocumento

  getAllDataDocumentos(): Observable<DataDocumento[]> {
    const url = `${this.baseUrl}/data-documentos`;
    const headers = this.getHeaders();
    return this.http.get<DataDocumento[]>(url, { headers });
  }

  createDataDocumento(dataDocumento: DataDocumento): Observable<any> {
    const url = `${this.baseUrl}/data-documentos`;
    const headers = this.getHeaders();
    return this.http.post(url, dataDocumento, { headers });
  }

  // Métodos para Capitulo

  getAllCapitulos(): Observable<Capitulo[]> {
    const url = `${this.baseUrl}/capitulos`;
    const headers = this.getHeaders();
    return this.http.get<Capitulo[]>(url, { headers });
  }

  createCapitulo(capitulo: Capitulo): Observable<any> {
    const url = `${this.baseUrl}/capitulos`;
    const headers = this.getHeaders();
    return this.http.post(url, capitulo, { headers });
  }

  // Métodos para Item

  getAllItems(): Observable<Item[]> {
    const url = `${this.baseUrl}/items`;
    const headers = this.getHeaders();
    return this.http.get<Item[]>(url, { headers });
  }

  createItem(item: Item): Observable<any> {
    const url = `${this.baseUrl}/items`;
    const headers = this.getHeaders();
    return this.http.post(url, item, { headers });
  }

  // Métodos para Subitem

  getAllSubitems(): Observable<Subitem[]> {
    const url = `${this.baseUrl}/subitems`;
    const headers = this.getHeaders();
    return this.http.get<Subitem[]>(url, { headers });
  }

  createSubitem(subitem: Subitem): Observable<any> {
    const url = `${this.baseUrl}/subitems`;
    const headers = this.getHeaders();
    return this.http.post(url, subitem, { headers });
  }

  // Métodos para Subsubitem

  getAllSubsubitems(): Observable<Subsubitem[]> {
    const url = `${this.baseUrl}/subsubitems`;
    const headers = this.getHeaders();
    return this.http.get<Subsubitem[]>(url, { headers });
  }

  createSubsubitem(subsubitem: Subsubitem): Observable<any> {
    const url = `${this.baseUrl}/subsubitems`;
    const headers = this.getHeaders();
    return this.http.post(url, subsubitem, { headers });
  }

  // Métodos para TabelaDados

  getAllTabelaDados(): Observable<TabelaDados[]> {
    const url = `${this.baseUrl}/tabela-dados`;
    const headers = this.getHeaders();
    return this.http.get<TabelaDados[]>(url, { headers });
  }

  createTabelaDados(tabelaDados: TabelaDados): Observable<any> {
    const url = `${this.baseUrl}/tabela-dados`;
    const headers = this.getHeaders();
    return this.http.post(url, tabelaDados, { headers });
  }

  // Métodos para Dados

  getAllDados(): Observable<Dados[]> {
    const url = `${this.baseUrl}/dados`;
    const headers = this.getHeaders();
    return this.http.get<Dados[]>(url, { headers });
  }

  createDados(dados: Dados): Observable<any> {
    const url = `${this.baseUrl}/dados`;
    const headers = this.getHeaders();
    return this.http.post(url, dados, { headers });
  }

  // Métodos para Vagas

  getAllVagas(): Observable<Vagas[]> {
    const url = `${this.baseUrl}/vagas`;
    const headers = this.getHeaders();
    return this.http.get<Vagas[]>(url, { headers });
  }

  createVagas(vagas: Vagas): Observable<any> {
    const url = `${this.baseUrl}/vagas`;
    const headers = this.getHeaders();
    return this.http.post(url, vagas, { headers });
  }

  // Métodos para Custos

  getAllCustos(): Observable<Custos[]> {
    const url = `${this.baseUrl}/custos`;
    const headers = this.getHeaders();
    return this.http.get<Custos[]>(url, { headers });
  }

  createCustos(custos: Custos): Observable<any> {
    const url = `${this.baseUrl}/custos`;
    const headers = this.getHeaders();
    return this.http.post(url, custos, { headers });
  }
}
