import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/service/user_service';
import { User } from 'src/app/shared/utilitarios/user';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-efetivo',
  templateUrl: './efetivo.component.html',
  styleUrls: ['./efetivo.component.css']
})
export class EfetivoComponent implements OnInit {
  users: User[] = [];
  paginatedUsers: User[] = [];
  paginatedProfessoresSelecionados: User[] = [];
  itemsPerPage = 70; // Define o número de itens exibidos por página
  searchInputUsers = ''; // Variável de pesquisa para a tabela de usuários
  searchInputProfessores = ''; // Variável de pesquisa para a tabela de professores selecionados
  loadingUsers = false; // Variável para controlar o carregamento de mais dados
  currentPageUsers = 1; // Variável para controlar a página atual dos usuários exibidos
  telaTabela = true; // Variável para controlar se está editando um usuário
  telaEditUser = false; // Variável para controlar se está editando um usuário
  telaAdicionarUser = false; // Variável para controlar se está editando um usuário
  telaAdicionarUserLote = false; // Variável para controlar se está editando um usuário
  userEditForm: FormGroup; // Formulário para edição de usuário
  userAddForm: FormGroup; // Formulário para edição de usuário
  editedUser: User | null = null;
  logoUrl: string = ''; // URL da imagem
  usuariosComModificacoes: any[] = [];
  selectedFile: File | null = null;
  selectedFiles: File[] = [];
  adicionarEmLote=true;
  filesObj = {
    ["Ensino Fundamental"]: { nome: "Ensino Fundamental.XLS", order: 1, enviado: false },
    ["Ensino Medio"]: { nome: "Ensino Medio.XLS", order: 2, enviado: false },
    ["Ensino Superior"]: { nome: "Ensino Superior.XLS", order: 3, enviado: false },
    ["Pos Graduacao"]: { nome: "Pos Graduacao.XLS", order: 4, enviado: false },
    ["Mestrado"]: { nome: "Mestrado.XLS", order: 5, enviado: false },
    ["Doutorado"]: { nome: "Doutorado.XLS", order: 6, enviado: false },
  };
  efetivoCompleto : any[] = [];

  constructor(private userService: UserService, private fb: FormBuilder,private toastr: ToastrService) {
    this.userEditForm = this.fb.group({
      name: ['', Validators.required],
      graduacao: ['', Validators.required],
      escolaridade: ['', Validators.required],
      dateFilter: [''], // Adicione os campos conforme necessário
      role: ['']
    });
    this.userAddForm = this.fb.group({
      name: ['', Validators.required],
      mtcl: ['', Validators.required],  
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
        this.searchUsers();
      },
      (error) => {
        this.toastr.error("Erro ao obter a lista de usuários:",error)
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
    this.manageTelas("telaEditUser")
  }

  cancelEditing(): void {
    this.editedUser = null;
    this.manageTelas("telaTabela")
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
          this.toastr.success("Usuário atualizado com sucesso!")
          // Encontre o usuário na lista users e modifique para o updatedUser
          const index = this.users.findIndex(user => user.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.searchUsers();
        },
        (error) => {
          this.toastr.error('Erro ao atualizar o usuário:',error)
          // Trate o erro conforme necessário
        }
      );

      // Após salvar, limpe o formulário e finalize o modo de edição
      this.userEditForm.reset();
      this.editedUser = null;
      this.manageTelas("telaTabela")
    } else {
      this.toastr.error("Verifique os campos inválidos.");
    }
  }
  deleteUser(user:User){
    this.toastr.error(user.name)
     console.log("Deletar usuario")
  }

  // -------------------------------Adicio Militar Individual-----------------------------------//

  addMilitarTela(){
    this.manageTelas("telaAdicionarUser")
  }
  addMilitar() {
    if (this.userAddForm.valid) {
      const userAdd: User = {
        cpf: "",
        dateFilter: this.userAddForm.value.dateFilter,
        escolaridade: this.userAddForm.value.escolaridade,
        graduacao: this.userAddForm.value.graduacao,
        ldap: "",
        mtcl:  this.userAddForm.value.mtcl,
        name:  this.userAddForm.value.name,
        role:  this.userAddForm.value.role
      };

      this.userService.addUser(userAdd).subscribe(
        (addedUser: User) => {
          this.toastr.success("Militar adicionado com sucesso!");
          // Adicione o usuário à lista de usuários
          this.users.push(addedUser);
          this.searchUsers();
          // Limpe o formulário após adicionar o militar
          this.userAddForm.reset();
          // Volte para a tela de tabela
          this.manageTelas("telaTabela");
        },
        (error) => {
          this.toastr.error('Erro ao adicionar o militar:', error);
          // Trate o erro conforme necessário
        }
      );
    } else {
      // Verificar campos inválidos e exibir mensagens de erro
      this.toastr.error("Verifique os campos inválidos.");
    }
  }
  cancelAdicionarAluno(): void {
    this.manageTelas("telaTabela")
    this.userAddForm.reset();
  }

  // -------------------------------Adicio Militar em Lote-----------------------------------//
  addMilitarLoteTela(){
    this.manageTelas("telaAdicionarUserLote")
  }
  cancelAdicionarAlunoLote(): void {
    this.manageTelas("telaTabela")
    this.userAddForm.reset();
    this.selectedFiles = [];
    this.efetivoCompleto = [];
    this.usuariosComModificacoes =[];
    this.adicionarEmLote = true;

  }
// Função principal
adicionarAlunoLote(): void {

  if (this.selectedFiles.length < 6) {
    this.toastr.warning('Insira todos os arquivos das graduações.');
    return;
  }

  this.processarArquivosSequencialmente(0)
    .then(() => {
      this.compareEfetivoComInsercaoLote();
      this.selectedFiles = []; // Limpe a lista de arquivos selecionados após o processamento
    });
}

// Função para processar os arquivos sequencialmente
processarArquivosSequencialmente(index: number): Promise<void> {
  return new Promise<void>((resolve) => {
    if (index < this.selectedFiles.length) {
      const file = this.selectedFiles[index];
      this.processarArquivo(file, () => {
        this.processarArquivosSequencialmente(index + 1).then(resolve);
      });
    } else {
      resolve();
    }
  });
}

// Função para processar cada arquivo
processarArquivo(file: File, callback: () => void): void {
  const efetivoAux: any[] = [];

  const reader = new FileReader();
  reader.onload = (event: any) => {
    const fileContent = event.target.result;
    const array = this.processarConteudoArquivo(fileContent);

    this.criarEfetivoAux(array, efetivoAux);

    this.atualizarEfetivoCompleto(file, efetivoAux);

    callback(); // Chame o callback após o processamento do arquivo
  };

  reader.readAsBinaryString(file);
}

// Função para processar o conteúdo do arquivo
processarConteudoArquivo(fileContent: any): any[] {
  const workbook = XLSX.read(fileContent, { type: 'binary' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
}

// Função para criar array de efetivoAux
criarEfetivoAux(array: any[], efetivoAux: any[]): void {
  for (let i = 18; i < array.length - 7; i++) {
    const militar = array[i];
    if (Array.isArray(militar) && militar.length > 0) {
      const militaresFiltrados = efetivoAux.filter(obj => obj.mtcl === militar[0]);
      if (militaresFiltrados.length === 0) {
        const militarAux: User = this.criarObjetoUser(militar);
        efetivoAux.push(militarAux);
      }
    }
  }
}

// Função para criar objeto User
criarObjetoUser(militar: any): User {
  return {
    cpf: "",
    dateFilter: 0,
    escolaridade: militar[4],
    graduacao: militar[2],
    ldap: "",
    mtcl: militar[0],
    name: militar[1],
    role: ""
  };
}

// Função para atualizar efetivoCompleto
atualizarEfetivoCompleto(file: File, efetivoAux: any[]): void {
  for (let i = 0; i < efetivoAux.length; i++) {
    const militar = efetivoAux[i];
    const militaresFiltrados = this.efetivoCompleto.filter(obj => obj.mtcl === militar.mtcl);

    if (militaresFiltrados.length === 0) {
      this.efetivoCompleto.push(militar);
    } else {
      const indiceEncontrado = this.efetivoCompleto.indexOf(militaresFiltrados[0]);
      this.atualizarEscolaridadeEfetivoCompleto(file, indiceEncontrado, militar);
    }
  }
}

// Função para atualizar escolaridade em efetivoCompleto
atualizarEscolaridadeEfetivoCompleto(file: File, indiceEncontrado: number, militar: any): void {
  switch (file.name) {
    case "Doutorado.XLS":
      this.efetivoCompleto[indiceEncontrado].escolaridade = "DOUTORADO";
      break;
    case "Mestrado.XLS":
      this.efetivoCompleto[indiceEncontrado].escolaridade = "MESTRADO";
      break;
    case "Pos Graduacao.XLS":
      this.efetivoCompleto[indiceEncontrado].escolaridade = "POS-GRADUACAO";
      break;
    default:
      this.efetivoCompleto[indiceEncontrado].escolaridade = militar.escolaridade;
  }
}


  compareEfetivoComInsercaoLote(): void {
    for (const efetivo of this.efetivoCompleto) {
      const usuarioExistente = this.users.find(user => user.mtcl === efetivo.mtcl);
      if (usuarioExistente) {
        let userWithModifications = { ...efetivo };
        userWithModifications.id = usuarioExistente.id;
        userWithModifications.role = "--";
        userWithModifications.hasModifications = false;
        userWithModifications.atualizar = true;
        userWithModifications.criarUser = false;
        if (usuarioExistente.name !== efetivo.name) {
          userWithModifications.nameModified = true;
          userWithModifications.hasModifications = true;
        }
        if (usuarioExistente.graduacao !== efetivo.graduacao) {
          userWithModifications.graduacaoModified = true;
          userWithModifications.hasModifications = true;
        }
        if (usuarioExistente.escolaridade !== efetivo.escolaridade) {
          userWithModifications.escolaridadeModified = true;
          userWithModifications.hasModifications = true;
        }
        if (userWithModifications.hasModifications) {
          this.usuariosComModificacoes.push(userWithModifications);
          console.log(userWithModifications)

        }
      }else{
        if(efetivo.name){
          let userWithModifications = { ...efetivo };
          userWithModifications.hasModifications = true;
          userWithModifications.atualizar = true;
          userWithModifications.nameModified = true;
          userWithModifications.graduacaoModified = true;
          userWithModifications.escolaridadeModified = true;
          userWithModifications.mtclModified = true; 
          userWithModifications.criarUser = true;  
          this.usuariosComModificacoes.push(userWithModifications);
        }
 

      }
    }
    if(this.usuariosComModificacoes.length>0){
      this.adicionarEmLote = !this.adicionarEmLote;
    }

  }

  
  atualizarEfetivoEmLote(): void {
    this.adicionarEmLote = !this.adicionarEmLote;
    if (this.usuariosComModificacoes.length > 0) {
      // Filtra os usuários que têm a propriedade 'atualizar' como true
      const usuariosParaAtualizar = this.usuariosComModificacoes.filter(user => user.atualizar);
  
      if (usuariosParaAtualizar.length > 0) {
        this.userService.updateUsersInBatch(usuariosParaAtualizar).subscribe(
          () => {
            this.toastr.success('Usuários atualizados em lote com sucesso!');
            // Limpe a lista de usuários com modificações após a atualização em lote
            this.getUsers();
            this.userAddForm.reset();
            this.selectedFiles = [];
            this.efetivoCompleto = [];
            this.usuariosComModificacoes =[];
            this.adicionarEmLote = true;
          },
          (error) => {
            this.cancelAdicionarAlunoLote();
            this.toastr.error('Erro ao atualizar usuários em lote:', error);
            // Trate o erro conforme necessário
          }
        );
      } else {
        this.toastr.warning('Nenhum usuário para atualizar em lote.');
      }
    } else {
      this.toastr.warning('Nenhum usuário para atualizar em lote.');
    }
  }
  
  // Método chamado quando um arquivo é selecionado
  onFileSelected(event: any): void {
    const files: FileList = event.target.files;

  
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;
  
        // Verificar se o arquivo já foi selecionado
        const isDuplicate = this.selectedFiles.some(selectedFile => selectedFile.name === fileName);
  
        // Verificar se o nome do arquivo está na lista de nomes esperados
        const isValidFileName = Object.values(this.filesObj).some(obj => obj.nome === fileName);
  
        if (!isDuplicate && isValidFileName) {
          // Adicionar o arquivo à lista de arquivos selecionados
          this.selectedFiles.push(file);
          this.organizeFiles();

          // Encontrar o objeto correspondente ao arquivo pelo nome
          const fileObj = Object.values(this.filesObj).find(obj => obj.nome === fileName);
  
          if (fileObj) {
            // Atualizar o status para enviado
            fileObj.enviado = true;
          }
        } else {
          this.toastr.warning(`Arquivo duplicado ou com nome inválido: ${fileName}`);
        }
      }

      // Verificar se todos os arquivos foram enviados
      const allFilesSent = Object.values(this.filesObj).every(obj => obj.enviado);
  
      if (allFilesSent) {
        this.toastr.success("Todos os arquivos foram enviados!");
      } else {
        this.toastr.warning("Alguns arquivos ainda não foram enviados");
      }
    }

  }

  organizeFiles(): void {
    var filesAux=[];
    const fileTypes = [
      "Ensino Fundamental.XLS",
      "Ensino Medio.XLS",
      "Ensino Superior.XLS",
      "Pos Graduacao.XLS",
      "Mestrado.XLS",
      "Doutorado.XLS",
    ];
    for (let j = 0; j < fileTypes.length; j++) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        if(this.selectedFiles[i].name == fileTypes[j]){
          filesAux.push(this.selectedFiles[i]);
        }
      }
    }
    this.selectedFiles = filesAux;
  }

  
  
  deleteFile(index: number): void {
    if (index >= 0 && index < this.selectedFiles!.length) {
      this.selectedFiles!.splice(index, 1);
    }
  }




  manageTelas(tela:string){
    if(tela == "telaTabela"){
      this.telaTabela = true; // Variável para controlar se está editando um usuário
      this.telaEditUser = false; // Variável para controlar se está editando um usuário
      this.telaAdicionarUser = false; // Variável para controlar se está editando um usuário
      this.telaAdicionarUserLote = false; // Variável para controlar se está editando um usuário
    }
    if(tela == "telaEditUser"){
      this.telaTabela = false; // Variável para controlar se está editando um usuário
      this.telaEditUser = true; // Variável para controlar se está editando um usuário
      this.telaAdicionarUser = false; // Variável para controlar se está editando um usuário
      this.telaAdicionarUserLote = false; // Variável para controlar se está editando um usuário
    }
    if(tela == "telaAdicionarUser"){
      this.telaTabela = false; // Variável para controlar se está editando um usuário
      this.telaEditUser = false; // Variável para controlar se está editando um usuário
      this.telaAdicionarUser = true; // Variável para controlar se está editando um usuário
      this.telaAdicionarUserLote = false; // Variável para controlar se está editando um usuário
    }
    if(tela == "telaAdicionarUserLote"){
      this.telaTabela = false; // Variável para controlar se está editando um usuário
      this.telaEditUser = false; // Variável para controlar se está editando um usuário
      this.telaAdicionarUser = false; // Variável para controlar se está editando um usuário
      this.telaAdicionarUserLote = true; // Variável para controlar se está editando um usuário
    }
  }


}
