import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AtividadeHomologadaService } from 'src/app/shared/service/atividadeHomologadaService';
import { LicoesService } from 'src/app/shared/service/licoesService';
import { AtividadeHomologada } from 'src/app/shared/utilitarios/atividadeHomologada';
import { Subsubitem, Subsubsubitem } from 'src/app/shared/utilitarios/documentoPdf';
import { Licao } from 'src/app/shared/utilitarios/licao';
import { ContentComponent } from '../../../../content.component';
import { CursoService } from 'src/app/shared/service/objetosCursosService';

@Component({
  selector: 'app-cronograma-treinamento',
  templateUrl: './cronograma-treinamento.component.html',
  styleUrls: ['./cronograma-treinamento.component.css']
})
export class CronogramaTreinamentoComponent implements OnInit {
  mostrarExplicacaoLicoes = false;
  cursos: AtividadeHomologada[] = []; // Substitua pelos seus cursos
  licoesAux: Licao[] = []; // Substitua pelas suas lições
  cursoSelecionado: string = '';
  licaoSelecionada: string = '';
  licoesSelecionadas: { curso: string, licao: string }[] = [];
  licoes: Subsubitem[] = [];
  cursosSelecionados : any[] = [];

  constructor(private atividadeHomologadaService: AtividadeHomologadaService,
             private licoesService: LicoesService,
             private toastr: ToastrService,
             private contentComponent : ContentComponent,
             private cursoService: CursoService) {}

  ngOnInit(): void {
    this.atividadeHomologadaService.getAtividade().subscribe(
      (atividades: AtividadeHomologada[]) => {
        // Faça algo com os dados retornados, por exemplo, atribuir à propriedade do componente
        this.cursos = atividades;
      },
      (erro) => {
        console.error('Erro ao buscar atividades:', erro);
      }
    );

    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (cursoEscolhido) {
      if (cursoEscolhido.licoes) {
        this.licoes = cursoEscolhido.licoes
      }
    }
  }

  ngAfterViewInit() {
    this.isFormValid();
  }

  isFormValid(): void {
    if(this.licoes.length >0){
      this.contentComponent.changeValidityByComponentName(CronogramaTreinamentoComponent, true);
    }else{
      this.contentComponent.changeValidityByComponentName(CronogramaTreinamentoComponent, false);
    }
  
  }

  getAtividade(sigla: string) {
    return new Promise<Licao[]>((resolve, reject) => {
      this.licoesService.getLicoesBySigla(sigla).subscribe(
        (atividade: Licao[]) => {
          console.log(atividade);
          this.licoesAux = atividade;
          resolve(atividade);
        },
        (error) => {
          console.error(error);
          reject(error);
        }
      );
    });
  }



  toggleExplicacaoLicoes() {
    this.mostrarExplicacaoLicoes = !this.mostrarExplicacaoLicoes;
  }

  atualizarLicoes(sigla:string) {
    this.getAtividade(sigla)
  }

  adicionarLicao() {
    if (this.cursoSelecionado && this.licaoSelecionada) {
      const novaLicao = { curso: this.cursoSelecionado, licao: this.licaoSelecionada };
      
      // Verificar se a lição já foi inserida
      const licaoJaInserida = this.licoesSelecionadas.some(item =>
        item.curso === novaLicao.curso && item.licao === novaLicao.licao
      );
  
      if (!licaoJaInserida) {
        this.licoesSelecionadas.push(novaLicao);
        this.adicionarCursoAosItens();
        this.adicionarLicaoAoCurso();
        this.licaoSelecionada = '';
        this.cursoService.setAtributoByCursoEscolhidoID('licoes',this.licoes)
        this.isFormValid();
      }else{
        this.toastr.error("Lição já inserida")
      }
    }
  }

  removerLicao(indexRequisito: number) {
    this.licoes.splice(indexRequisito, 1);
    this.reorganizarNumeracao(this.licoes)
    this.cursoService.setAtributoByCursoEscolhidoID('licoes',this.licoes)
    this.isFormValid();
  }

  removerSubsubsubItem(indexRequisito: number, indexSubsubItem: number) {
    this.licoes[indexRequisito].subsubsubitens.splice(indexSubsubItem, 1);
    this.reorganizarLetras(this.licoes[indexRequisito].subsubsubitens)
    this.cursoService.setAtributoByCursoEscolhidoID('licoes',this.licoes)
    this.isFormValid();
  }
  private reorganizarNumeracao(objetos: any[]) {
    for (let i = 0; i < objetos.length; i++) {
      objetos[i].letra = `${i + 1})`;
    }
  }
  private reorganizarLetras(objetos: any[]) {
    for (let i = 0; i < objetos.length; i++) {
      objetos[i].letra = `(${this.getLetraFromIndex(i)})`;
    }
  }
  private getLetraFromIndex(index: number): string {
    const baseCharCode = "a".charCodeAt(0);
    const numLetters = 26; // Número de letras no alfabeto
  
    const letterIndex = index % numLetters;
    const letter = String.fromCharCode(baseCharCode + letterIndex);
  
    return letter;
  }

  adicionarCursoAosItens() {
    if (this.cursoSelecionado) {
      // Verificar se o curso já foi inserido anteriormente
      const cursoJaInserido = this.licoes.some(item => item.texto === this.cursoSelecionado);
      if (!cursoJaInserido) {
        const subsubItem: Subsubitem = {
          tipo: "subitem",
          letra: (this.licoes.length + 1) + ")",
          texto: this.cursoSelecionado,
          subsubsubitens: []
        };
        this.licoes.push(subsubItem);
        this.createFinalidade();
      } 
    }
    console.log(this.licoes)
  }
  createFinalidade(){
    // Suponha que this.cursosSelecionados seja um array contendo os cursos selecionados
    this.cursosSelecionados.push(this.cursoSelecionado);
    let finalidade = "Atualizar os bombeiros no que tange às atividades de ";
    if (this.cursosSelecionados.length === 1) {
        finalidade += `${this.cursosSelecionados[0]}`;
    } else if (this.cursosSelecionados.length === 2) {
        finalidade += `${this.cursosSelecionados[0]} e ${this.cursosSelecionados[1]}`;
    } else {
        for (let i = 0; i < this.cursosSelecionados.length - 1; i++) {
            finalidade += `${this.cursosSelecionados[i]}, `;
        }
        finalidade = finalidade.slice(0, -2); // Remover a última vírgula e espaço
        finalidade += ` e ${this.cursosSelecionados[this.cursosSelecionados.length - 1]}`;
    }
    finalidade += ", a fim do aprimoramento dos conhecimentos e melhor desempenho de suas atividades.";
    this.cursoService.setAttributeInCursoEscolhido('finalidade',finalidade)

  }

  adicionarLicaoAoCurso(){
    const indexCursoInserido = this.licoes.findIndex(item => item.texto === this.cursoSelecionado);
    if(this.licaoSelecionada ){
      console.log("ENtrou")
      const subsubsubItem: Subsubsubitem = {
        tipo: "subitem",
        letra: "(" +String.fromCharCode(65 + this.licoes[indexCursoInserido].subsubsubitens.length).toLocaleLowerCase() + ")",
        texto: this.licaoSelecionada,
      };
      this.licoes[indexCursoInserido].subsubsubitens.push(subsubsubItem);
    }
  }

}
