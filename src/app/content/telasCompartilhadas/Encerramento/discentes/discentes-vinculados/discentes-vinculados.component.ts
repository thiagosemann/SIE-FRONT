import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ContentComponent } from 'src/app/content/content.component';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { UserService } from 'src/app/shared/service/user_service';
import { UserCivilService } from 'src/app/shared/service/usersCivil_service';
import { Discente } from 'src/app/shared/utilitarios/discente';
import { UserCivil } from 'src/app/shared/utilitarios/userCivil';

@Component({
  selector: 'app-discentes-vinculados',
  templateUrl: './discentes-vinculados.component.html',
  styleUrls: ['./discentes-vinculados.component.css']
})
export class DiscentesVinculadosComponent implements OnInit {
  users: UserCivil[] = [];
  selectedDiscentes: UserCivil[] = [];
  selectedDiscentesArray: any[] = [];
  selectedDiscentesResp: Discente[] = [];
  paginatedUsers: UserCivil[] = [];
  paginatedDiscentesSelecionados: Discente[] = [];
  itemsPerPage = 70; // Define o número de itens exibidos por página
  searchInputUsers = ''; // Variável de pesquisa para a tabela de usuários
  searchInputDiscentes = ''; // Variável de pesquisa para a tabela de alunos selecionados
  loadingUsers = false; // Variável para controlar o carregamento de mais dados
  currentPageUsers = 1; // Variável para controlar a página atual dos usuários exibidos
  title:string="Alunos Civis";
  constructor(private userService: UserService, private userCivilService: UserCivilService, private cursoService: CursoService, private contentComponent: ContentComponent) {}

  ngOnInit(): void {
    const cursoEscolhido = this.cursoService.getCursoEscolhido();

    if (cursoEscolhido) {
      this.selectedDiscentes = cursoEscolhido.selectedDiscentesCivisBCeGVCEncerramento || [];
      this.selectedDiscentesResp = cursoEscolhido.discentesCivisBCeGVC || [];

    } 
    
    this.getUsers();
    this.searchDiscentesSelecionados();
    this.searchUsers();
  }

  ngAfterViewInit() {
    this.isFormValid();
  }

  isFormValid(): void {
    if (this.selectedDiscentes.length > 0) {
      this.contentComponent.changeValidityByComponentName(DiscentesVinculadosComponent, true);
    } else {
      this.contentComponent.changeValidityByComponentName(DiscentesVinculadosComponent, false);
    }
  }

  getUsers(): void {
    this.userCivilService.getUsersCivil().subscribe(
      (users: UserCivil[]) => {
        this.users = users.sort((a, b) => a.fullName.localeCompare(b.fullName));
        this.users = this.users.filter(globalProf =>
          this.selectedDiscentes.findIndex(selectedProf => selectedProf.id === globalProf.id) === -1
        );

        this.searchUsers();
      },
      (error) => {
        console.log('Erro ao obter a lista de usuários com BC ou GVC igual a 1:', error);
      }
    );
    
  }
  

  searchUsers(): void {
    this.searchInputUsers = this.searchInputUsers.trim();
    const filteredUsers = this.users.filter(user => user.fullName.toLowerCase().includes(this.searchInputUsers.toLowerCase()));
    this.currentPageUsers = 1; // Reinicia a página atual
    this.paginatedUsers = filteredUsers.slice(0, this.itemsPerPage); // Mostra apenas os primeiros itens
  }

  searchDiscentesSelecionados(): void {
    this.searchInputDiscentes = this.searchInputDiscentes.trim();
    const filteredDiscentes = this.selectedDiscentesResp.filter(discente =>
        discente.name && // Check if discente.name is defined
        discente.name.toLowerCase().includes(this.searchInputDiscentes.toLowerCase())
    );
    this.paginatedDiscentesSelecionados = filteredDiscentes;
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

  addDiscente(aluno: UserCivil): void {
    const discenteAux :Discente = {
      user_id:aluno.id,
      name:aluno.fullName,
      cpf:aluno.cpf,
      excluido:false,
      motivoExcluido:"",
      desistente:false,
      motivoDesistente:"",
      type:"BC",
      pesoGraduacao:0
    }

    this.selectedDiscentesResp.push(discenteAux);
    this.selectedDiscentes.push(aluno);
    const index = this.users.indexOf(aluno);
    if (index !== -1) {
      this.users.splice(index, 1);
      this.searchUsers();
      this.searchDiscentesSelecionados();
    }
    this.searchInputUsers = '';
    this.searchUsers();
    this.isFormValid();
    this.enviarDadosCursoEscolhido();
  }
  removeDiscente(aluno: Discente): void {
    const userToRemove = this.selectedDiscentes.find(user => user.id === aluno.user_id);
    if (userToRemove) {
        const index = this.selectedDiscentes.indexOf(userToRemove);
        const index2 = this.selectedDiscentesResp.findIndex(discente => discente.user_id === aluno.user_id);
        if (index2 !== -1) {
            this.selectedDiscentesResp.splice(index2, 1);
        }
        this.selectedDiscentes.splice(index, 1);
        this.users.push(userToRemove);
        this.users.sort((a, b) => a.fullName.localeCompare(b.fullName));
        this.searchUsers();
        this.searchDiscentesSelecionados();
        this.searchInputDiscentes = '';
        this.isFormValid();
        this.enviarDadosCursoEscolhido();
    }
  }

  isSearchInputUsersEmpty(): boolean {
    return this.searchInputUsers.trim() === '';
  }

  isSearchInputProfessorsEmpty(): boolean {
    return this.searchInputDiscentes.trim() === '';
  }

  clearValueIfDisabled(user: any) {
    if (!user.excluido ) {
      user.motivoExcluido = '';
    }else{
      user.motivoExcluido = 'Falecimento';
    }
    if (!user.desistente ) {
      user.motivoDesistente = '';
    }else{
      user.motivoDesistente = 'Não compareceu ao curso.';
    }

  }



  enviarDadosCursoEscolhido(){
    this.cursoService.setAtributoByCursoEscolhidoID('selectedDiscentesCivisBCeGVCEncerramento',this.selectedDiscentes)
    this.cursoService.setAtributoByCursoEscolhidoID('discentesCivisBCeGVC',this.selectedDiscentesResp);

    
  }
  

  verifyIfisBcGvc(user:UserCivil):string{
    if(user.BC){
      return "BC"
    }else if(user.GVC){
      return "GVC"
    }else{
      return "Externo"
    }
  }
}
