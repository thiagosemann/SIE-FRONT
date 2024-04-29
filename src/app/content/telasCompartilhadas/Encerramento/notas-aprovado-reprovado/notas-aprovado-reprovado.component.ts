import { Component } from '@angular/core';
import { EscolaridadeService } from 'src/app/shared/service/escolaridade_service';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { Escolaridade } from 'src/app/shared/utilitarios/escolaridade';

@Component({
  selector: 'app-notas-aprovado-reprovado',
  templateUrl: './notas-aprovado-reprovado.component.html',
  styleUrls: ['./notas-aprovado-reprovado.component.css']
})
export class NotasAprovadoReprovadoComponent {
  alunos:any[]=[];
  alunosArray:any[]=[];
  ha : number =0;
  alunosMatriculados:number =0;
  alunosAprovados:number=0;
  alunosReprovados:number=0;
  alunosInaptos:number=0;
  alunosDesistentes:number=0;
  alunosExcluidos:number=0;
  escolaridades:Escolaridade[]=[];

  constructor(private cursoService: CursoService,private escolaridadeService:EscolaridadeService) {}

  ngOnInit(): void {
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    this.ha = Number(cursoEscolhido?.haCurso);
    this.alunos = [];
    if (cursoEscolhido) {
      if(cursoEscolhido.alunosFinalObj && cursoEscolhido.alunosFinalObj.length > 0 ){
        this.alunos = cursoEscolhido.alunosFinalObj;
      }else{
        if (cursoEscolhido.discentesMilitares && cursoEscolhido.discentesMilitares.length > 0) {
          this.adicionarAlunos(cursoEscolhido.discentesMilitares);
        }
        if (cursoEscolhido.discentesCivisBCeGVC && cursoEscolhido.discentesCivisBCeGVC.length > 0) {
          this.adicionarAlunos(cursoEscolhido.discentesCivisBCeGVC);
        }
        if (cursoEscolhido.discentesCivisExternos && cursoEscolhido.discentesCivisExternos.length > 0) {
          this.adicionarAlunos(cursoEscolhido.discentesCivisExternos);
        }  
      }

    }
    this.escolaridadeService.getEscolaridades().subscribe(
      (escolaridades: Escolaridade[]) => {
        this.escolaridades = escolaridades;
      },
      (error) => {
        console.log('Erro ao obter a lista de usuários:', error);
      }
    );
    this.alunos.forEach(aluno=>{
        if(aluno.excluido){
          this.alunosExcluidos +=1;
        }else if(aluno.desistente){
          this.alunosDesistentes +=1;
        }
        
    })
    this.cursoService.setAttributeInCursoEscolhido('alunosDesistentes',this.alunosDesistentes)
    this.cursoService.setAttributeInCursoEscolhido('alunosExcluidos',this.alunosExcluidos)
  }

  ngOnDestroy(): void {
    this.organizarArrayAlunos();
  }
  
  private adicionarAlunos(discentes: any[]): void {
    for (let i = 0; i < discentes.length; i++) {
      discentes[i].faltas = 0;     
      if (discentes[i].excluido) {
        discentes[i].situacao = `Excluído: ${discentes[i].motivoExcluido}`;
      } else if (discentes[i].desistente) {
        discentes[i].situacao = `Desistente: ${discentes[i].motivoDesistente}`;
      } else {
        discentes[i].situacao = "Reprovado";
      }
      this.alunos.push(discentes[i]);
    
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
  
      // Terceiro critério de ordenação: alunos com maior a.nota ficam primeiro entre aprovados
      if (a.situacao === "Aprovado" && b.situacao === "Aprovado") {
        if (a.nota !== b.nota) {
          return b.nota - a.nota; // ordem decrescente por nota
        } else {
          return b.pesoGraduacao - a.pesoGraduacao; // ordem decrescente por pesoGraduacao
        }
      }
  
      // Quarto critério de ordenação: alunos com maior a.nota ficam primeiro entre reprovados por nota
      if (a.situacao.includes("Reprovado") && b.situacao.includes("Reprovado")) {
        if (a.nota !== b.nota) {
          return b.nota - a.nota; // ordem decrescente por nota
        } else {
          return b.pesoGraduacao - a.pesoGraduacao; // ordem decrescente por pesoGraduacao
        }
      }
  
      // Quinto critério de ordenação: alunos reprovados por falta são ordenados pelo pesoGraduacao
      if (a.situacao === "Reprovado por falta" && b.situacao === "Reprovado por falta") {
        return b.pesoGraduacao - a.pesoGraduacao; // ordem decrescente por pesoGraduacao
      }
  
      // Sexto critério de ordenação: alunos excluídos são ordenados pelo pesoGraduacao
      if (a.excluido && b.excluido) {
        return b.pesoGraduacao - a.pesoGraduacao; // ordem decrescente por pesoGraduacao
      }
  
      // Sétimo critério de ordenação: alunos desistentes são ordenados pelo pesoGraduacao
      if (a.desistente && b.desistente) {
        return b.pesoGraduacao - a.pesoGraduacao; // ordem decrescente por pesoGraduacao
      }
  
      return 0; // a e b são considerados iguais
    });

      // Definir classificação para cada aluno
    this.alunos.forEach((aluno, index) => {
      aluno.classificacao = index + 1;
    });
        
    this.createArrayAlunos();
    this.enviarDadosCursoEscolhido();

  }
    
  changeInput(aluno: any): void {
    this.limitarValor(aluno);
    aluno.mediaFinal = aluno.nota;
    // Verifica situação do aluno
    if (this.verificarReprovacaoPorFalta(aluno)) {
      this.enviarDadosCursoEscolhido();
      return;
    }
  }

  changeSelect(aluno: any): void {
    // Verifica situação do aluno
    if (this.verificarReprovacaoPorFalta(aluno)) {
      this.enviarDadosCursoEscolhido();
      return;
    }
    aluno.situacao = aluno.conceito;
  }

  createArrayAlunos():void{
    this.alunosArray=[];
    this.alunosMatriculados =this.alunos.length;
    this.alunosAprovados=0;
    this.alunosReprovados=0;

      // Cria o array com as informações dos militares
      this.alunos?.forEach(aluno => {
        this.alunosArray.push([
          aluno.classificacao,
          aluno.graduacao || "EXTERNO",
          aluno.mtcl || aluno.cpf,
          aluno.name,
          aluno.faltas || "--",
          aluno.nota || "--",
          aluno.exame || "--",
          aluno.situacao
        ]);
        if(aluno.situacao=="Aprovado"){
          this.alunosAprovados+=1;
        }else if(aluno.situacao.includes("Reprovado")){
          this.alunosReprovados+=1;
        }
      });
      this.createArrayDiariaDeCurso();
  }

  createArrayDiariaDeCurso():void{
    let diariaDeCursoArray=[];
    let cabecalho=["Posto/Grad","Mtcl/Cpf","Nome completo","Escolaridade","D.M Valor","D.C Qtd","D.C Valor","Alimentação","Soma"];
    diariaDeCursoArray.push(cabecalho)
    this.alunos.forEach(aluno => {
      let array:any=[];
      if(aluno.type=="militar"){
        let diariaMilitar =  "R$ 0,00";
        let diariaDeCurso =  "R$ 0,00";
        array=[
          aluno.graduacao,
          aluno.mtcl,
          aluno.name,
          this.getEscolaridade(aluno.escolaridade_id || 0),
          diariaMilitar,
          "0",
          diariaDeCurso,
          "R$ 0,00",
          "R$ 0,00"
        ]
      }else{
        array=[
          "EXTERNO",
          aluno.cpf,
          aluno.name,
          "--",
          "R$ 0,00",
          "0",
          "R$ 0,00",
          "R$ 0,00",
          "R$ 0,00"
        ]
      }
      diariaDeCursoArray.push(array)
    });
    this.cursoService.setAtributoByCursoEscolhidoID('diariaDeCursoArray',diariaDeCursoArray)

  }
  getEscolaridade(escolaridade_id:number):string{
    let escolaridadeAux=this.escolaridades.find(escolaridade=>escolaridade.id === escolaridade_id);
    return escolaridadeAux?.nome || ""
  }

  private limitarValor(aluno: any): void {
    if (aluno.faltas < 0) {
      aluno.faltas =0;
    } else if (aluno.faltas > 10) {
      aluno.faltas = 10;
    }

  }
  
  private verificarReprovacaoPorFalta(aluno: any): boolean {
    const presenca = aluno.faltas / this.ha;
    if (presenca > 0.25) {
      aluno.situacao = "Reprovado por falta";
      return true;
    }
    return false;
  }
  
  enviarDadosCursoEscolhido(){

    this.cursoService.setAttributeInCursoEscolhido('alunosMatriculados',this.alunosMatriculados)
    this.cursoService.setAttributeInCursoEscolhido('alunosAprovados',this.alunosAprovados)
    this.cursoService.setAttributeInCursoEscolhido('alunosReprovados',this.alunosReprovados)
    this.cursoService.setAttributeInCursoEscolhido('alunosInaptos',this.alunosInaptos)
    this.cursoService.setAtributoByCursoEscolhidoID('alunosFinalObj',this.alunos)
    this.cursoService.setAtributoByCursoEscolhidoID('alunosFinalArray',this.alunosArray)
  }

}
