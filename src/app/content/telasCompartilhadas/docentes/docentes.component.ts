import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/service/user_service';
import { User } from 'src/app/shared/utilitarios/user';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { ContentComponent } from '../../content.component';
@Component({
  selector: 'app-docentes',
  templateUrl: './docentes.component.html',
  styleUrls: ['./docentes.component.css']
})
export class DocentesComponent implements OnInit {
  users: User[] = [];
  professoresSelecionados: User[] = [];
  paginatedUsers: User[] = [];
  paginatedProfessoresSelecionados: User[] = [];
  currentPageUsers = 1;
  currentPageProfessores = 1;
  itemsPerPage = 7; // Define o número de itens exibidos por página
  searchInputUsers = ''; // Variável de pesquisa para a tabela de usuários
  searchInputProfessores = ''; // Variável de pesquisa para a tabela de professores selecionados

  constructor(private userService: UserService,private cursoService: CursoService,private contentComponent : ContentComponent) {}

  ngOnInit(): void {
    this.getUsers();
    this.updatePaginatedProfessoresSelecionados();
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (cursoEscolhido) {
      if (cursoEscolhido.selectedProfessors) {
        this.professoresSelecionados = cursoEscolhido.selectedProfessors;
        this.updatePaginatedProfessoresSelecionados();
      }
    }
    this.updatePaginatedUsers(); // Movido aqui
  }
  
  ngAfterViewInit() {
    this.isFormValid();
  }

  isFormValid(): void {
    if(this.professoresSelecionados.length >=0){
      this.contentComponent.changeValidityByComponentName(DocentesComponent, true);
    }else{
      this.contentComponent.changeValidityByComponentName(DocentesComponent, false);
    }
    
  }
  getUsers(): void {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users.sort((a, b) => a.name.localeCompare(b.name));
        this.updatePaginatedUsers();
      },
      (error) => {
        console.log('Erro ao obter a lista de usuários:', error);
      }
    );
  }

  updatePaginatedUsers(): void {
    this.searchInputUsers = this.searchInputUsers.trim(); // Remova os espaços em branco antes e depois do valor de pesquisa
    const startIndex = (this.currentPageUsers - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const filteredUsers = this.users.filter(user => user.name.toLowerCase().includes(this.searchInputUsers.toLowerCase()));
    this.paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  }
  
  setCurrentPageUsers(page: number): void {
    this.currentPageUsers = page;
    this.updatePaginatedUsers();
  }

  nextPageUsers(): void {
    if (this.currentPageUsers < this.totalPagesUsers) {
      this.currentPageUsers++;
      this.updatePaginatedUsers();
    }
  }
  
  previousPageUsers(): void {
    if (this.currentPageUsers > 1) {
      this.currentPageUsers--;
      this.updatePaginatedUsers();
    }
  }

  addProfessor(professor: User): void {
    this.professoresSelecionados.push(professor);
    const index = this.users.indexOf(professor);
    if (index !== -1) {
      this.users.splice(index, 1);
      this.updatePaginatedUsers();
      this.updatePaginatedProfessoresSelecionados();
    }
    this.searchInputUsers = '';
    this.updatePaginatedUsers();
    this.cursoService.setSelectedProfessorsByCursoEscolhidoID(this.professoresSelecionados);
  }

  removeProfessor(professor: User): void {
    const index = this.professoresSelecionados.indexOf(professor);
    if (index !== -1) {
      this.professoresSelecionados.splice(index, 1);
      this.users.push(professor);
      this.users.sort((a, b) => a.name.localeCompare(b.name));
      this.updatePaginatedUsers();
      this.updatePaginatedProfessoresSelecionados();
    }
    this.searchInputProfessores = '';
    this.updatePaginatedProfessoresSelecionados();
    this.cursoService.setSelectedProfessorsByCursoEscolhidoID(this.professoresSelecionados);

  }

  updatePaginatedProfessoresSelecionados(): void {
    const startIndex = (this.currentPageProfessores - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const filteredProfessores = this.professoresSelecionados.filter(professor => professor.name.toLowerCase().includes(this.searchInputProfessores.toLowerCase()));
    this.paginatedProfessoresSelecionados = filteredProfessores.slice(startIndex, endIndex);
    if (filteredProfessores.length <= this.itemsPerPage) {
      this.paginatedProfessoresSelecionados = filteredProfessores;
    } else {
      this.paginatedProfessoresSelecionados = filteredProfessores.slice(startIndex, endIndex);
    }
  }

  setCurrentPageProfessores(page: number): void {
    this.currentPageProfessores = page;
    this.updatePaginatedProfessoresSelecionados();
  }

  nextPageProfessores(): void {
    if (this.currentPageProfessores < this.totalPagesProfessores) {
      this.currentPageProfessores++;
      this.updatePaginatedProfessoresSelecionados();
    }
  }

  previousPageProfessores(): void {
    if (this.currentPageProfessores > 1) {
      this.currentPageProfessores--;
      this.updatePaginatedProfessoresSelecionados();
    }
  }

  get totalPagesUsers(): number {
    return Math.ceil(this.users.length / this.itemsPerPage);
  }

  get totalPagesProfessores(): number {
    return Math.ceil(this.professoresSelecionados.length / this.itemsPerPage);
  }

  get visibleUsersPages(): number[] {
    const totalPages = this.totalPagesUsers;
    const currentPage = this.currentPageUsers;
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      return Array(totalPages).fill(0).map((_, i) => i + 1);
    } else {
      const firstVisiblePage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const lastVisiblePage = Math.min(firstVisiblePage + maxVisiblePages - 1, totalPages);
      return Array(lastVisiblePage - firstVisiblePage + 1).fill(0).map((_, i) => firstVisiblePage + i);
    }
  }

  get visibleProfessoresPages(): number[] {
    const totalPages = this.totalPagesProfessores;
    const currentPage = this.currentPageProfessores;
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      return Array(totalPages).fill(0).map((_, i) => i + 1);
    } else {
      const firstVisiblePage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const lastVisiblePage = Math.min(firstVisiblePage + maxVisiblePages - 1, totalPages);
      return Array(lastVisiblePage - firstVisiblePage + 1).fill(0).map((_, i) => firstVisiblePage + i);
    }
  }

  isSearchInputUsersEmpty(): boolean {
    return this.searchInputUsers.trim() === '';
  }
  isSearchInputProfessorsEmpty(): boolean {
    return  this.searchInputProfessores.trim() === '';
  }
}
