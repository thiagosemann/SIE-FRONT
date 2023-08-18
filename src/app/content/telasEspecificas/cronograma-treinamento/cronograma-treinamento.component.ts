import { Component, OnInit } from '@angular/core';
import { AtividadeHomologadaService } from 'src/app/shared/service/atividadeHomologadaService';
import { AtividadeHomologada } from 'src/app/shared/utilitarios/atividadeHomologada';

@Component({
  selector: 'app-cronograma-treinamento',
  templateUrl: './cronograma-treinamento.component.html',
  styleUrls: ['./cronograma-treinamento.component.css']
})
export class CronogramaTreinamentoComponent implements OnInit {
  mostrarExplicacaoLicoes = false;
  cursos: AtividadeHomologada[] = []; // Substitua pelos seus cursos
  licoes: string[] = []; // Substitua pelas suas lições
  cursoSelecionado: string = '';
  licaoSelecionada: string = '';
  licoesSelecionadas: { curso: string, licao: string }[] = [];


  constructor(private atividadeHomologadaService: AtividadeHomologadaService) {}

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
  }

  toggleExplicacaoLicoes() {
    this.mostrarExplicacaoLicoes = !this.mostrarExplicacaoLicoes;
  }

  atualizarLicoes() {
    // Lógica para atualizar as lições disponíveis de acordo com o curso selecionado
    // Você pode implementar esta lógica com base nos cursos e lições reais do seu sistema
  }

  adicionarLicao() {
    if (this.cursoSelecionado && this.licaoSelecionada) {
      this.licoesSelecionadas.push({ curso: this.cursoSelecionado, licao: this.licaoSelecionada });
      this.cursoSelecionado = '';
      this.licaoSelecionada = '';
    }
  }

  removerLicao(index: number) {
    this.licoesSelecionadas.splice(index, 1);
  }


}
