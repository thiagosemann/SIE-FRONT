import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable()
export class GoogleScriptService {
  private url = 'https://script.google.com/macros/s/AKfycbzl89Tsxh1ZPU3UHM2K0kCffi_mpbcrqCPnwEl-18UkPUNPZniqNRj_2HzCt7o5KzR2DA/exec';
  private pgeCache$: Observable<any> | undefined;
  private efetivoCache$: Observable<any> | undefined;

  constructor(private http: HttpClient) {}

  getPgeData(): Observable<any> {
    if (!this.pgeCache$) {
      const endpoint = `${this.url}?action=getPGE`;
      this.pgeCache$ = this.http.get(endpoint).pipe(
        shareReplay(1)
      );
    }
    return this.pgeCache$;
  }

  getEfetivoData(): Observable<any> {
    if (!this.efetivoCache$) {
      const endpoint = `${this.url}?action=getEfetivo`;
      this.efetivoCache$ = this.http.get(endpoint).pipe(
        shareReplay(1)
      );
    }
    return this.efetivoCache$;
  }
}
