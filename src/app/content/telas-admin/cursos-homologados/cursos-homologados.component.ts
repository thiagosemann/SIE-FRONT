import { Component, OnInit } from '@angular/core';
import { AtividadeHomologadaService } from 'src/app/shared/service/atividadeHomologadaService';
import { AuthenticationService } from 'src/app/shared/service/authentication';
import { AtividadeHomologada } from 'src/app/shared/utilitarios/atividadeHomologada';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-cursos-homologados',
  templateUrl: './cursos-homologados.component.html',
  styleUrls: ['./cursos-homologados.component.css']
})
export class CursosHomologadosComponent implements OnInit {
  atividadesHomologadas: AtividadeHomologada[] = [];
  sgpeVersions: any[] = [];  // Adicione esta variável para armazenar as versões de sgpe
  filteredAtividade : AtividadeHomologada[] = [];
  searchInputAtividade = ''; // Variável de pesquisa para a tabela de usuários
  role ='';
  editedAtividade: AtividadeHomologada | null = null;
  telaEditAtividade = false;
  atividadeEditForm: FormGroup; // Formulário para edição de usuário
  showTooltip: boolean = false;
  criarAtividade: boolean = false;

  constructor(private atividadeHomologadaService: AtividadeHomologadaService, private authService: AuthenticationService,private fb: FormBuilder,private toastr: ToastrService) {
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
      finalidade: [''],
      reqEspecifico: [''],
      processoSeletivo: [''],
      atividadesPreliminares: [''],
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
    this.criarAtividade = !this.criarAtividade;
    if(atividade && atividade.id){
      // Chama a função para obter todas as versões pelo ID da atividade atualmente editada
      this.atividadeHomologadaService.getAllAtividadeHomologadaVersionsById(atividade.id).subscribe(
        (versions) => {
          // Faça qualquer outra coisa que você precise com as versões obtidas.
          this.sgpeVersions = versions.reverse();
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
        },
        (erro) => {
          console.error('Erro ao obter versões da atividade homologada', erro);
          // Trate o erro conforme necessário.
        }
      );
     
    }
  }

  cancelEditing(): void {
    this.telaEditAtividade = !this.telaEditAtividade;
    this.editedAtividade = null;
    this.atividadeEditForm.reset();
  }
  startAddAtividade(){
    this.telaEditAtividade = !this.telaEditAtividade;
    this.criarAtividade = !this.criarAtividade
    //Usar o mesmo formulário de edição para criar uma nova.
  }
  addAtividade(){
  // Verifica se há uma atividade editada
    if(this.atividadeEditForm.valid ) {
      const atividadeHomologadaUpdate: AtividadeHomologada = {
        sigla:  this.atividadeEditForm.value.sigla,
        name: this.atividadeEditForm.value.name,
        sgpe: this.atividadeEditForm.value.sgpe,
        ha: this.atividadeEditForm.value.ha,
        hai: this.atividadeEditForm.value.hai,
        tipo: this.atividadeEditForm.value.tipo,
        areaConhecimento: this.atividadeEditForm.value.areaConhecimento,
        modalidade: this.atividadeEditForm.value.modalidade,
        vagas: this.atividadeEditForm.value.vagas,
        finalidade: this.atividadeEditForm.value.finalidade,
        reqEspecifico: this.atividadeEditForm.value.reqEspecifico,
        processoSeletivo: this.atividadeEditForm.value.processoSeletivo,
        atividadesPreliminares: this.atividadeEditForm.value.atividadesPreliminares,
        linkSgpe: this.atividadeEditForm.value.linkSgpe,
        linkMaterial: this.atividadeEditForm.value.linkMaterial
      };
      console.log(atividadeHomologadaUpdate)
      this.atividadeHomologadaService.addAtividadeHomologada(atividadeHomologadaUpdate).subscribe({
        next: (atividadeHomologadaUpdate: AtividadeHomologada) => {
          console.log("AtividadeHomologadaUpdate", atividadeHomologadaUpdate);
          this.obterAtividadesHomologadas();
          this.cancelEditing();
          this.toastr.success("Atividade de ensino criada com sucesso!")
        },
        error: (error) => {
          this.toastr.error('Erro ao adicionar o militar:', error);
          // Trate o erro conforme necessário
        }
      });
      
    }else {
      console.log(this.atividadeEditForm)
      this.toastr.error("Verifique os campos inválidos.");
    }

  }

  deleteAtividade(): void {
    if(this.editedAtividade && this.editedAtividade.id){
      this.atividadeHomologadaService.deleteAtividadeHomologada(this.editedAtividade.id).subscribe({
        next: () => {
          console.log('Atividade homologada excluída com sucesso!');
          this.obterAtividadesHomologadas();
          this.cancelEditing();
          this.toastr.success("Atividade de ensino excluída com sucesso!")

        },
        error: error => {
          console.error('Erro ao excluir atividade homologada:', error);
          // Trate o erro conforme necessário
        }
      });
    }
  }

atualizarAtividade(): void {
  // Verifica se há uma atividade editada
  console.log(this.editedAtividade)
  if (this.atividadeEditForm.valid && this.editedAtividade) {
    const atividadeHomologadaUpdate: AtividadeHomologada = {
      id:this.editedAtividade.id,
      sigla:  this.atividadeEditForm.value.sigla,
      name: this.atividadeEditForm.value.name,
      sgpe: this.atividadeEditForm.value.sgpe,
      ha: this.atividadeEditForm.value.ha,
      hai: this.atividadeEditForm.value.hai,
      tipo: this.atividadeEditForm.value.tipo,
      areaConhecimento: this.atividadeEditForm.value.areaConhecimento,
      modalidade: this.atividadeEditForm.value.modalidade,
      vagas: this.atividadeEditForm.value.vagas,
      finalidade: this.atividadeEditForm.value.finalidade,
      reqEspecifico: this.atividadeEditForm.value.reqEspecifico,
      processoSeletivo: this.atividadeEditForm.value.processoSeletivo,
      atividadesPreliminares: this.atividadeEditForm.value.atividadesPreliminares,
      linkSgpe: this.atividadeEditForm.value.linkSgpe,
      linkMaterial: this.atividadeEditForm.value.linkMaterial
    };
  
    // Chama a função para atualizar a atividade homologada
    this.atividadeHomologadaService.updateAtividadeHomologada(atividadeHomologadaUpdate)
      .subscribe({
        next: (response) => {
          console.log('Atividade atualizada com sucesso!', response);
          this.obterAtividadesHomologadas();
          this.cancelEditing();
          this.toastr.success("Atividade de ensino atualizada com sucesso!")

        },
        error: (error) => {
          console.error('Erro ao atualizar a atividade', error);
          // Adicione tratamento de erro conforme necessário
        }
      });

  }else {
    console.log(this.atividadeEditForm)
    this.toastr.error("Verifique os campos inválidos.");
  }
}

manageForm(): void {
  if(this.criarAtividade){
    this.addAtividade();
  }else{
    this.atualizarAtividade();
  }
}
  
}

