import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../utilitarios/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private url = 'http://localhost:3333/login';
  private user: User | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string, rememberMe: boolean): Promise<{logado: boolean, erro: string}> {
    const loginData = { username, password };
    return new Promise<{logado: boolean, erro: string}>((resolve, reject) => {
      this.http.post(this.url, loginData).subscribe(
        (response: any) => {
          console.log(response)  
          if (rememberMe) {
            // Se a opção "Lembrar-me" estiver marcada, armazene o token em localStorage
            localStorage.setItem('token', response.token);
            // Também armazene as informações do usuário em localStorage
            localStorage.setItem('user', JSON.stringify(response.user));
          } else {
            // Se não estiver marcada, armazene o token em sessionStorage
            sessionStorage.setItem('token', response.token);
            // Também armazene as informações do usuário em sessionStorage
            sessionStorage.setItem('user', JSON.stringify(response.user));
          }
          this.user = response.user;
          console.log(this.user)
          // Lógica adicional, como redirecionar para outra página, etc.
          resolve({logado: true, erro: ''}); // resolve a promise como true porque o login foi bem-sucedido
        },
        error => {
          console.error('Erro na autenticação:', error);
          // Lógica adicional para tratar erros, exibir mensagens de erro, etc.
          if (error.status === 401) {
            resolve({logado: false, erro: error.error.message}); 
          } else {
            reject({logado: false, erro: 'Erro na autenticação'});
          }
        }
      );
    });
  }

  logout() {
    this.user = null;
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    // Remova também as informações do usuário de localStorage e sessionStorage
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('token') !== null) {
      this.user = JSON.parse(localStorage.getItem('user')!); // Recupere as informações do usuário de localStorage
    } else if (sessionStorage.getItem('token') !== null) {
      this.user = JSON.parse(sessionStorage.getItem('user')!); // Recupere as informações do usuário de sessionStorage
    }
    return localStorage.getItem('token') !== null || sessionStorage.getItem('token') !== null;
  }

  getUser(): User | null {
    if (this.user === null) {
      // Verifique se o usuário está armazenado em localStorage
      const userStr = localStorage.getItem('user');
      if (userStr !== null) {
        this.user = JSON.parse(userStr);
      }
      
      // Se não estiver em localStorage, verifique se está armazenado em sessionStorage
      if (this.user === null) {
        const userSessionStr = sessionStorage.getItem('user');
        if (userSessionStr !== null) {
          this.user = JSON.parse(userSessionStr);
        }
      }
    }
    return this.user;
  }

  getToken(): string | null {
    let token: string | null = null;

    // Verifique se o token está armazenado em localStorage
    if (localStorage.getItem('token') !== null) {
      token = localStorage.getItem('token');
    }
    
    // Se não estiver em localStorage, verifique se está armazenado em sessionStorage
    else if (sessionStorage.getItem('token') !== null) {
      token = sessionStorage.getItem('token');
    }
    
    return token;
  }
}
