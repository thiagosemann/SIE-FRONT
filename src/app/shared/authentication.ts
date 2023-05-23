import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private url = 'http://10.121.60.51:3333/login';
  private user: User | null = null;

  constructor(private http: HttpClient) {}

  login(email: string, password: string, rememberMe: boolean): Promise<{logado: boolean, erro: string}> {
    const loginData = { email, password };
    return new Promise<{logado: boolean, erro: string}>((resolve, reject) => {
      this.http.post(this.url, loginData).subscribe(
        (response: any) => {  
          if (rememberMe) {
            // Se a opção "Lembrar-me" estiver marcada, armazene o token em localStorage
            localStorage.setItem('token', response.token);
          } else {
            // Se não estiver marcada, armazene o token em sessionStorage
            sessionStorage.setItem('token', response.token);
          }
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
    // Limpar as informações do usuário no serviço de autenticação
    this.user = null;
  }

  isLoggedIn(): boolean {
    // Verificar se o usuário está logado com base nas informações armazenadas no serviço de autenticação
    return this.user !== null;
  }
}