import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/service/user_service';
import { User } from 'src/app/shared/utilitarios/user';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { ContentComponent } from '../../../content.component';
import { Subsubitem } from 'src/app/shared/utilitarios/documentoPdf';

@Component({
  selector: 'app-docentes',
  templateUrl: './docentes.component.html',
  styleUrls: ['./docentes.component.css']
})
export class DocentesComponent implements OnInit {
  users: User[] = [];
  selectedProfessors: User[] = [];
  professoresSelecionados:Subsubitem[] = [];
  paginatedUsers: User[] = [];
  paginatedProfessoresSelecionados: User[] = [];
  itemsPerPage = 70; // Define o número de itens exibidos por página
  searchInputUsers = ''; // Variável de pesquisa para a tabela de usuários
  searchInputProfessores = ''; // Variável de pesquisa para a tabela de professores selecionados
  loadingUsers = false; // Variável para controlar o carregamento de mais dados
  currentPageUsers = 1; // Variável para controlar a página atual dos usuários exibidos

  constructor(private userService: UserService, private cursoService: CursoService, private contentComponent: ContentComponent) {}

  ngOnInit(): void {
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
  
    if (cursoEscolhido) {
      this.selectedProfessors = cursoEscolhido.selectedProfessorsAbertura || [];

    } 
    this.getUsers();
    this.searchProfessoresSelecionados();
    this.searchUsers();
  }

  ngAfterViewInit() {
    this.isFormValid();
  }

  isFormValid(): void {
    if (this.selectedProfessors.length > 0) {
      this.contentComponent.changeValidityByComponentName(DocentesComponent, true);
    } else {
      this.contentComponent.changeValidityByComponentName(DocentesComponent, false);
    }
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
    this.searchInputUsers = this.searchInputUsers.trim();
    const filteredUsers = this.users.filter(user => user.name.toLowerCase().includes(this.searchInputUsers.toLowerCase()));
    this.currentPageUsers = 1; // Reinicia a página atual
    this.paginatedUsers = filteredUsers.slice(0, this.itemsPerPage); // Mostra apenas os primeiros itens
  }

  searchProfessoresSelecionados(): void {
    this.searchInputProfessores = this.searchInputProfessores.trim();
    const filteredProfessores = this.selectedProfessors.filter(professor =>
      professor.name.toLowerCase().includes(this.searchInputProfessores.toLowerCase())
    );
    this.paginatedProfessoresSelecionados = filteredProfessores;
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

  addProfessor(professor: User): void {
    this.selectedProfessors.push(professor);
    const index = this.users.indexOf(professor);
    if (index !== -1) {
      this.users.splice(index, 1);
      this.searchUsers();
      this.searchProfessoresSelecionados();
    }
    this.searchInputUsers = '';
    this.searchUsers();
    this.enviarDadosCursoEscolhido();
    this.isFormValid();
  }

  removeProfessor(professor: User): void {
    const index = this.selectedProfessors.indexOf(professor);
    if (index !== -1) {
      this.selectedProfessors.splice(index, 1);
      this.users.push(professor);
      this.users.sort((a, b) => a.name.localeCompare(b.name));
      this.searchUsers();
      this.searchProfessoresSelecionados();
    }
    this.searchInputProfessores = '';
    this.searchProfessoresSelecionados();
    this.enviarDadosCursoEscolhido();
    this.isFormValid();
  }

  isSearchInputUsersEmpty(): boolean {
    return this.searchInputUsers.trim() === '';
  }

  isSearchInputProfessorsEmpty(): boolean {
    return this.searchInputProfessores.trim() === '';
  }

  enviarDadosCursoEscolhido(){
    this.professoresSelecionados = [];
    for(const professor of this.selectedProfessors){
      const subitem: Subsubitem = {
        tipo: "subsubitem",
        texto: `SD BM MTCL ${professor.mtcl} ${professor.name}` ,
        letra: '('+(this.professoresSelecionados.length+1)+')',
        subsubsubitens: []
      };
      this.professoresSelecionados.push(subitem)
    }
    this.cursoService.setAtributoByCursoEscolhidoID('selectedProfessors',this.selectedProfessors)
    this.cursoService.setAtributoByCursoEscolhidoID('globalProfessors',this.users);
    this.cursoService.setAtributoByCursoEscolhidoID('professoresSelecionados',this.professoresSelecionados)

  }
}
