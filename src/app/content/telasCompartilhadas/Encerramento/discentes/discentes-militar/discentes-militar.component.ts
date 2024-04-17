import { Component } from '@angular/core';
import { ContentComponent } from 'src/app/content/content.component';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { UserService } from 'src/app/shared/service/user_service';
import { User } from 'src/app/shared/utilitarios/user';
import { DocentesComponent } from '../../../Abertura/docentes/docentes.component';
import { Discente } from 'src/app/shared/utilitarios/discente';
import { Graduacao } from 'src/app/shared/utilitarios/graduacao';
import { GraduacaoService } from 'src/app/shared/service/graduacao_service';

@Component({
  selector: 'app-discentes-militar',
  templateUrl: './discentes-militar.component.html',
  styleUrls: ['./discentes-militar.component.css']
})
export class DiscentesMilitarComponent {
  users: User[] = [];
  selectedDiscentes: User[] = [];
  selectedDiscentesResp: Discente[] = [];
  selectedDiscentesArray: any[] = [];
  paginatedUsers: User[] = [];
  paginatedDiscentesSelecionados: Discente[] = [];
  itemsPerPage = 70; // Define o número de itens exibidos por página
  searchInputUsers = ''; // Variável de pesquisa para a tabela de usuários
  searchInputDiscentes = ''; // Variável de pesquisa para a tabela de alunos selecionados
  loadingUsers = false; // Variável para controlar o carregamento de mais dados
  currentPageUsers = 1; // Variável para controlar a página atual dos usuários exibidos
  graduacoes:Graduacao[] = [];
 
  constructor(private userService: UserService, private cursoService: CursoService, private contentComponent: ContentComponent, private graduacaoService :GraduacaoService) {}

  ngOnInit(): void {
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
  
    if (cursoEscolhido) {
      this.selectedDiscentes     = cursoEscolhido.selectedDiscentesMilitaresEncerramento || [];
      this.selectedDiscentesResp = cursoEscolhido.discentesMilitares || [];
    } 
    
    this.getUsers();
    this.getGraduacoes();
    this.searchDiscentesSelecionados();
    this.searchUsers();
  }

  ngAfterViewInit() {
    this.isFormValid();
  }

  isFormValid(): void {
    if (this.selectedDiscentes.length > 0) {
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
          this.selectedDiscentes.findIndex(selectedProf => selectedProf.id === globalProf.id) === -1
        );
        this.searchUsers();
      },
      (error) => {
        console.log('Erro ao obter a lista de usuários:', error);
      }
    );
  }
  getGraduacoes(): void {
    this.graduacaoService.getGraduacoes().subscribe(
      (graduacoes: Graduacao[]) => {
        this.graduacoes = graduacoes;
        console.log(this.graduacoes)
       },
      (error) => {
        console.log('Erro ao obter a lista de graduacoes:', error);
      }
    );
  }

  searchUsers(): void {
    this.searchInputUsers = this.searchInputUsers.trim();
    const filteredUsers = this.users.filter(user => user.name.toLowerCase().includes(this.searchInputUsers.toLowerCase()));
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

  addDiscente(aluno: User): void {
    const discenteAux :Discente = {
      user_id:aluno.id,
      mtcl:aluno.mtcl,
      name:aluno.name,
      graduacao_id:aluno.graduacao_id,
      escolaridade_id:aluno.escolaridade_id,     
      cpf:aluno.cpf,
      excluido:false,
      motivoExcluido:"",
      desistente:false,
      motivoDesistente:"",
      type:"militar"
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
        this.users.sort((a, b) => a.name.localeCompare(b.name));
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
  getGraduacaoByMilitar(militar:Discente):string{
    const graduacao = this.graduacoes.find(graduacao=>graduacao.id === militar.graduacao_id);
    return graduacao?.abreviacao2 || ""
  }
  
  createArrayMilitares(): void {
    this.selectedDiscentesArray = [];
    console.log(this.selectedDiscentesResp);

    // Atualiza as informações de graduação para cada militar
    this.selectedDiscentesResp?.forEach(militar => {
      const graduacao = this.graduacoes.find(graduacao => graduacao.id === militar.graduacao_id);
      militar.graduacao_id = graduacao?.id;
      militar.graduacao  = graduacao?.abreviacao2;
      militar.pesoGraduacao = graduacao?.peso;
    });
    // Ordena os militares pelo peso da graduação
    this.selectedDiscentesResp?.sort((a, b) => {
      return b.pesoGraduacao! - a.pesoGraduacao!;
    });

  }
  
  

  enviarDadosCursoEscolhido(){
    this.createArrayMilitares();
    this.cursoService.setAtributoByCursoEscolhidoID('selectedDiscentesMilitaresEncerramento',this.selectedDiscentes)
    this.cursoService.setAtributoByCursoEscolhidoID('discentesMilitares',this.selectedDiscentesResp);
    
  }

}
