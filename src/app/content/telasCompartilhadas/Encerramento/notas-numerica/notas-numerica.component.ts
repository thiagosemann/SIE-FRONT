import { Component, OnInit } from '@angular/core';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';

@Component({
  selector: 'app-notas-numerica',
  templateUrl: './notas-numerica.component.html',
  styleUrls: ['./notas-numerica.component.css']
})
export class NotasNumericaComponent implements OnInit {
  alunos:any[]=[];
  alunosArray:any[]=[];
  ha : number =0;
  constructor(private cursoService: CursoService) {}

  ngOnInit(): void {
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    this.ha = Number(cursoEscolhido?.haCurso);
    this.alunos = [];
    if (cursoEscolhido) {
      if(cursoEscolhido.alunosFinalObj){
        this.alunos = cursoEscolhido.alunosFinalObj;
      }
      if (cursoEscolhido.discentesMilitares && cursoEscolhido.discentesMilitares.length > 0) {
        this.adicionarAlunos(cursoEscolhido.discentesMilitares);
      }
  
      if (cursoEscolhido.discentesCivisBCeGVC && cursoEscolhido.discentesCivisBCeGVC.length > 0) {
        this.adicionarAlunos(cursoEscolhido.discentesCivisBCeGVC);
      }
  
      if (cursoEscolhido.discentesCivisExternos && cursoEscolhido.discentesCivisExternos.length > 0) {
        this.adicionarAlunos(cursoEscolhido.discentesCivisExternos);
      }
       
      this.organizarArrayAlunos();
  
    }
  }
  
  private adicionarAlunos(discentes: any[]): void {
    for (let i = 0; i < discentes.length; i++) {
      let alunoExistente = this.alunos.find(alunoAux=>alunoAux.user_id === discentes[i].user_id);
      if(!alunoExistente){
        discentes[i].faltas = 0;
        if (discentes[i].excluido) {
          discentes[i].situacao = `Excluído:${discentes[i].motivoExcluido}`;
        } else if (discentes[i].desistente) {
          discentes[i].situacao = `Desistente:${discentes[i].motivoDesistente}`;
        } else {
          discentes[i].situacao = "Reprovado";
        }
        this.alunos.push(discentes[i]);
      }

    }
  }
  
  organizarArrayAlunos(): void {
    // Ordenar alunos
    this.alunos.sort((a, b) => {
      // Primeiro critério de ordenação: alunos excluídos ou desistentes ficam por último
      if (a.excluido || a.desistente) {
        return 1; // a é considerado maior
      } else if (b.excluido || b.desistente) {
        return -1; // b é considerado maior
      }
  
      // Segundo critério de ordenação: alunos aprovados ficam primeiro
      if (a.situacao === "Aprovado" && b.situacao !== "Aprovado") {
        return -1; // a é considerado menor
      } else if (a.situacao !== "Aprovado" && b.situacao === "Aprovado") {
        return 1; // b é considerado menor
      }
  
      // Terceiro critério de ordenação: alunos com maior a.pesoGraduacao ficam primeiro entre aprovados
      if (a.situacao === "Aprovado" && b.situacao === "Aprovado") {
        return b.pesoGraduacao - a.pesoGraduacao; // ordem decrescente por pesoGraduacao
      }
  
      // Quarto critério de ordenação: alunos com maior a.pesoGraduacao ficam primeiro entre reprovados
      if (a.situacao.includes("Reprovado") && b.situacao.includes("Reprovado") ) {
        return b.pesoGraduacao - a.pesoGraduacao; // ordem decrescente por pesoGraduacao
      }
  
      return 0; // a e b são considerados iguais
    });
  }
  
  

  changeInput(aluno: any, campo: string): void {
    this.limitarValor(aluno, campo);
    
    // Verifica situação do aluno
    if (this.verificarReprovacaoPorFalta(aluno)) {
      this.organizarArrayAlunos();
      this.createArrayAlunos();
      this.enviarDadosCursoEscolhido();
      return;
    }
  
    if (this.verificarAprovacaoPorNota(aluno)) {
      this.organizarArrayAlunos();
      this.createArrayAlunos();
      this.enviarDadosCursoEscolhido();
      return;
    }
  
    if (this.verificarAprovacaoPorExame(aluno)) {
      this.organizarArrayAlunos();
      this.createArrayAlunos();
      this.enviarDadosCursoEscolhido();
      return;
    }
  
    aluno.situacao = "Reprovado por nota";
    this.organizarArrayAlunos();
    this.createArrayAlunos();
    this.enviarDadosCursoEscolhido();
  }
  createArrayAlunos():void{
    this.alunosArray=[];
      // Cria o array com as informações dos militares
      this.alunos?.forEach(aluno => {
        this.alunosArray.push([
          "--",
          aluno.graduacao || "EXTERNO",
          aluno.mtcl || aluno.cpf,
          aluno.name,
          aluno.faltas || "--",
          aluno.nota || "--",
          aluno.exame || "--",
          aluno.situacao
        ]);
      });

  }

  private limitarValor(aluno: any, campo: string): void {
    if(campo!="faltas"){
      if (aluno[campo] < 0) {
        aluno[campo] =0;
      } else if (aluno[campo] > 10) {
        aluno[campo] = 10;
      }
    }else{
      if (aluno[campo] < 0) {
        aluno[campo] =0;
      } 
    }
  }
  
  private verificarReprovacaoPorFalta(aluno: any): boolean {
    const presenca = aluno.faltas / this.ha;
    if (presenca > 0.25) {
      aluno.situacao = "Reprovado por falta";
      this.organizarArrayAlunos();
      return true;
    }
    return false;
  }
  
  private verificarAprovacaoPorNota(aluno: any): boolean {
    if (aluno.nota >= 7) {
      aluno.situacao = "Aprovado";
      this.organizarArrayAlunos();
      return true;
    }
    return false;
  }
  
  private verificarAprovacaoPorExame(aluno: any): boolean {
    if (aluno.exame >= 7) {
      aluno.situacao = "Aprovado";
      this.organizarArrayAlunos();
      return true;
    }
    return false;
  }

  enviarDadosCursoEscolhido(){
    this.cursoService.setAtributoByCursoEscolhidoID('alunosFinalObj',this.alunos)
    this.cursoService.setAtributoByCursoEscolhidoID('alunosFinalArray',this.alunosArray)
  }

}
