import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/service/user_service';
import { User } from 'src/app/shared/utilitarios/user';

@Component({
  selector: 'app-efetivo',
  templateUrl: './efetivo.component.html',
  styleUrls: ['./efetivo.component.css']
})
export class EfetivoComponent implements OnInit {
  users: User[] = [];
  selectedProfessors: User[] = [];
  paginatedUsers: User[] = [];
  paginatedProfessoresSelecionados: User[] = [];
  itemsPerPage = 70; // Define o número de itens exibidos por página
  searchInputUsers = ''; // Variável de pesquisa para a tabela de usuários
  searchInputProfessores = ''; // Variável de pesquisa para a tabela de professores selecionados
  loadingUsers = false; // Variável para controlar o carregamento de mais dados
  currentPageUsers = 1; // Variável para controlar a página atual dos usuários exibidos
  editingUser = false; // Variável para controlar se está editando um usuário
  userEditForm: FormGroup; // Formulário para edição de usuário
  editedUser: User | null = null;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.userEditForm = this.fb.group({
      name: ['', Validators.required],
      graduacao: ['', Validators.required],
      escolaridade: ['', Validators.required],
      dateFilter: [''], // Adicione os campos conforme necessário
      role: ['']
    });
  }
  ngOnInit(): void {

    this.getUsers();
    this.searchUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users.sort((a, b) => a.name.localeCompare(b.name));
        this.users = this.users.filter(globalProf =>
          this.selectedProfessors.findIndex(selectedProf => selectedProf.id === globalProf.id) === -1
        );
        this.searchUsers();
      },
      (error) => {
        console.log('Erro ao obter a lista de usuários:', error);
      }
    );
  }

  searchUsers(): void {
    this.searchInputUsers = this.searchInputUsers.trim().toLowerCase();
    const filteredUsers = this.users.filter(user =>
      Object.values(user).some(value =>
        value && typeof value === 'string' && value.toLowerCase().includes(this.searchInputUsers)
      )
    );
    this.currentPageUsers = 1; // Reset current page
    this.paginatedUsers = filteredUsers.slice(0, this.itemsPerPage); // Show only the first items
  }


  onTableScrollUsers(event: any): void {
    const table = event.target;
    const scrollPosition = table.scrollTop + table.clientHeight;
    const tableHeight = table.scrollHeight;

    if (!this.loadingUsers && scrollPosition > tableHeight - 100) {
      this.loadMoreUsers();
    }
  }

  // Função para carregar mais dados de usuários
  loadMoreUsers(): void {
    this.loadingUsers = true;

    // Simulando uma requisição assíncrona para obter mais dados
    setTimeout(() => {
      // Nesse exemplo, vamos carregar mais 20 usuários
      const startIndex = this.currentPageUsers * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const moreUsers = this.users.slice(startIndex, endIndex);

      // Adiciona os novos usuários na lista paginada
      this.paginatedUsers = [...this.paginatedUsers, ...moreUsers];

      this.currentPageUsers++;
      this.loadingUsers = false;
    }, 1000); // Tempo de simulação, pode ser ajustado conforme a velocidade do carregamento de dados
  }


  isSearchInputUsersEmpty(): boolean {
    return this.searchInputUsers.trim() === '';
  }

  isSearchInputProfessorsEmpty(): boolean {
    return this.searchInputProfessores.trim() === '';
  }

  startEditing(user: User): void {
    this.editedUser = user;
    this.userEditForm.patchValue({
      name: user.name,
      graduacao: user.graduacao,
      escolaridade: user.escolaridade,
      dateFilter: user.dateFilter,
      role: user.role
      // Adicione os campos conforme necessário
    });
    this.editingUser = true;
  }

  cancelEditing(): void {
    this.editedUser = null;
    this.editingUser = false;
    this.userEditForm.reset();
  }

  saveUser(): void {
    if (this.userEditForm.valid && this.editedUser) {
      const updatedUser: User = {
        id: this.editedUser.id,
        cpf: this.editedUser.cpf, // Preencha com os valores corretos ou deixe em branco se não aplicável
        dateFilter: parseInt(this.userEditForm.value.dateFilter),
        escolaridade: this.userEditForm.value.escolaridade,
        graduacao: this.userEditForm.value.graduacao,
        ldap: this.editedUser.ldap, // Preencha com os valores corretos ou deixe em branco se não aplicável
        mtcl:  this.editedUser.mtcl, // Preencha com os valores corretos ou deixe em branco se não aplicável
        name: this.userEditForm.value.name,
        role: this.userEditForm.value.role,
        vinculo: '' // Preencha com os valores corretos ou deixe em branco se não aplicável
        // Adicione outras propriedades conforme necessário
      };

      this.userService.updateUser(updatedUser).subscribe(
        () => {
          console.log('Usuário atualizado com sucesso!');
          // Encontre o usuário na lista users e modifique para o updatedUser
          const index = this.users.findIndex(user => user.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.searchUsers();
          console.log( this.users[index])
        },
        (error) => {
          console.error('Erro ao atualizar o usuário:', error);
          // Trate o erro conforme necessário
        }
      );

      // Após salvar, limpe o formulário e finalize o modo de edição
      this.userEditForm.reset();
      this.editedUser = null;
      this.editingUser = false;
    } else {

    }
  }
  deleteUser(user:User){

  }
}
