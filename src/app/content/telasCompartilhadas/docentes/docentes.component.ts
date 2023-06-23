import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/service/user_service';
import { User } from 'src/app/shared/utilitarios/user';

@Component({
  selector: 'app-docentes',
  templateUrl: './docentes.component.html',
  styleUrls: ['./docentes.component.css']
})
export class DocentesComponent implements OnInit {
  users: User[] = [];
  professoresSelecionados: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users.sort((a, b) => a.name.localeCompare(b.name));
        console.log(this.users); // Você pode imprimir a lista no console se desejar
      },
      (error) => {
        console.log('Erro ao obter a lista de usuários:', error);
      }
    );
  }
  

  addProfessor(professor: User): void {
    this.professoresSelecionados.push(professor);
    const index = this.users.indexOf(professor);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }

  removeProfessor(professor: User): void {
    const index = this.professoresSelecionados.indexOf(professor);
    if (index !== -1) {
      this.professoresSelecionados.splice(index, 1);
      this.users.push(professor);
      this.users.sort((a, b) => a.name.localeCompare(b.name)); // Ordena a lista de professores disponíveis em ordem alfabética
    }
  }
  
}
