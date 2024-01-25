import { Component, OnInit } from '@angular/core';
import { AtividadeHomologadaService } from 'src/app/shared/service/atividadeHomologadaService';
import { AuthenticationService } from 'src/app/shared/service/authentication';
import { AtividadeHomologada } from 'src/app/shared/utilitarios/atividadeHomologada';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cursos-homologados',
  templateUrl: './cursos-homologados.component.html',
  styleUrls: ['./cursos-homologados.component.css']
})
export class CursosHomologadosComponent implements OnInit {
  atividadesHomologadas: AtividadeHomologada[] = [];
  searchInputAtividade = ''; // Variável de pesquisa para a tabela de usuários
  filteredAtividade : AtividadeHomologada[] = [];
  role ='';
  editedAtividade: AtividadeHomologada | null = null;
  telaEditAtividade = false;
  atividadeEditForm: FormGroup; // Formulário para edição de usuário
  

  constructor(private atividadeHomologadaService: AtividadeHomologadaService, private authService: AuthenticationService,private fb: FormBuilder) {
    this.atividadeEditForm = this.fb.group({
      sigla: ['', Validators.required],
      name: ['', Validators.required],
      sgpe: ['', Validators.required],
      ha: ['', Validators.required],
      hai: ['', Validators.required],
      tipo: ['', Validators.required],
      areaConhecimento: ['', Validators.required],
      modalidade: ['', Validators.required],
      vagas: ['', Validators.required],
      finalidade: ['', Validators.required],
      reqEspecifico: ['', Validators.required],
      processoSeletivo: ['', Validators.required],
      atividadesPreliminares: ['', Validators.required],
      linkSgpe: ['', Validators.required],
      linkMaterial: ['', Validators.required],
      
    });
  }

  ngOnInit() {
    this.obterAtividadesHomologadas();
    this.searchAtividade();
  
    const user = this.authService.getUser();
    
    if (user && user.role) {
      this.role = user.role;
    }
  
    if (this.role !== "admin") {
      // Certifique-se de que o formulário está definido antes de tentar acessá-lo
      if (this.atividadeEditForm) {
        // Desabilita o formulário
        this.atividadeEditForm.disable();
      } else {
        // Caso o formulário não esteja definido, você pode realizar alguma ação apropriada
        console.error("Formulário atividadeEditForm não está definido.");
      }
    }
  }
  

  obterAtividadesHomologadas() {
    this.atividadeHomologadaService.getAtividade().subscribe(
      (atividades: AtividadeHomologada[]) => {
        this.atividadesHomologadas = atividades;
        this.searchAtividade();

        console.log(this.atividadesHomologadas)
        // Faça qualquer outra coisa que você precise com os dados obtidos.
      },
      (erro) => {
        console.error('Erro ao obter atividades homologadas', erro);
        // Trate o erro conforme necessário.
      }
    );
  }

  searchAtividade(): void {
    this.searchInputAtividade = this.searchInputAtividade.trim().toLowerCase();
    this.filteredAtividade = this.atividadesHomologadas.filter(atividade =>
      Object.values(atividade).some(value =>
        value && typeof value === 'string' && value.toLowerCase().includes(this.searchInputAtividade)
      )
    );

  }

  startEditing(atividade: AtividadeHomologada): void {
    console.log(atividade)
    this.editedAtividade = atividade;
    this.atividadeEditForm.patchValue({
      sigla: atividade.sigla,
      name: atividade.name,
      sgpe: atividade.sgpe,
      ha: atividade.ha,
      hai: atividade.hai,
      tipo: atividade.tipo,
      areaConhecimento: atividade.areaConhecimento,
      modalidade: atividade.modalidade,
      vagas: atividade.vagas,
      finalidade: atividade.finalidade,
      reqEspecifico: atividade.reqEspecifico,
      processoSeletivo: atividade.processoSeletivo,
      atividadesPreliminares: atividade.atividadesPreliminares,
      linkSgpe: atividade.linkSgpe,
      linkMaterial: atividade.linkMaterial
    });
    this.telaEditAtividade = !this.telaEditAtividade;
  }

  cancelEditing(): void {
    this.telaEditAtividade = !this.telaEditAtividade;
    this.editedAtividade = null;
    this.atividadeEditForm.reset();
  }

  deleteAtividade(atividade: AtividadeHomologada){

  }
  saveAtividade(){

  }
}

