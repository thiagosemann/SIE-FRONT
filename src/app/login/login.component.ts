import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/service/authentication';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  // Variáveis para armazenar os valores dos campos de entrada
  username: string;
  password: string;
  response: boolean;
  rememberMe: boolean;
  constructor(private authService: AuthenticationService,private toastr: ToastrService,private router: Router) {
    this.username = '';
    this.password = '';
    this.response = false;
    this.rememberMe = false;
  }

  
  ngOnInit() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      // Se não existe um token, redirecione para a página de login
      this.router.navigate(['/content']);
    }
  }

  login(): void {
    // Lógica de autenticação aqui
    this.authService.login(this.username,  this.password, this.rememberMe).then(result => {
      if (result.logado) {
        console.log('Logado com sucesso!');
        this.toastr.success("Logado com sucesso!")
        this.router.navigate(['/content']);
      } else {
        this.toastr.error(result.erro)
      }
    }).catch(error => {
      this.toastr.error(error.erro)
    });
  }
}