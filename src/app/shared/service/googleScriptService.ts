import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable()
export class GoogleScriptService {
  private url = 'https://script.google.com/macros/s/AKfycbyEjL7w7m8NsR1UHyYjKYpKme0UP9UcRfb9Z-_yKeKSGXGH9jdmKIIIF9uUb7viquEAtQ/exec';
  private cache$: Observable<any> | undefined;

  constructor(private http: HttpClient) {}

  getPgeData(): Observable<any> {
    if (!this.cache$) {
      const endpoint = `${this.url}?action=getPGE`;
      this.cache$ = this.http.get(endpoint).pipe(
        shareReplay(1)
      );
    }
    return this.cache$;
  }
}
