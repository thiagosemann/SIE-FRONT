import { Component } from '@angular/core';
import { EscolaridadeService } from 'src/app/shared/service/escolaridade_service';
import { GraduacaoService } from 'src/app/shared/service/graduacao_service';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { Discente } from 'src/app/shared/utilitarios/discente';
import { Escolaridade } from 'src/app/shared/utilitarios/escolaridade';
import { Graduacao } from 'src/app/shared/utilitarios/graduacao';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';

@Component({
  selector: 'app-diaria-de-curso',
  templateUrl: './diaria-de-curso.component.html',
  styleUrls: ['./diaria-de-curso.component.css']
})
export class DiariaDeCursoComponent {
  alunos:Discente[]=[];
  cursoEscolhido: Curso | undefined ; 
  diariaDeCursoArray:any[]=[];
  escolaridades:Escolaridade[]=[];
  graduacoes: Graduacao[]=[];
  constructor(private cursoService: CursoService, private escolaridadeService:EscolaridadeService,private graduacaoService:GraduacaoService ){}


  ngOnInit(): void {
    this.cursoEscolhido = this.cursoService.getCursoEscolhido();
    if(this.cursoEscolhido && this.cursoEscolhido.alunosFinalObj){
      this.alunos = this.cursoEscolhido.alunosFinalObj
    }
    this.escolaridadeService.getEscolaridades().subscribe(
      (escolaridades: Escolaridade[]) => {
        this.escolaridades = escolaridades;
      },
      (error) => {
        console.log('Erro ao obter a lista de usuários:', error);
      }
    );
    this.graduacaoService.getGraduacoes().subscribe(
      (graduacao: Graduacao[]) => {
        this.graduacoes = graduacao;
      },
      (error) => {
        console.log('Erro ao obter a lista de usuários:', error);
      }
    );
    this.createArrayDiariaDeCurso();
  }

  createArrayDiariaDeCurso():void{
    this.diariaDeCursoArray=[];
    let cabecalho=["Posto/Grad","Mtcl/Cpf","Nome completo","Escolaridade","D.M Valor","D.C Qtd","D.C Valor","Alimentação","Soma"];
    this.diariaDeCursoArray.push(cabecalho)
    this.alunos.forEach(aluno => {
      let array:any=[];
      if(aluno.type=="militar"){
        let diariaMilitar =  "R$ 0,00";
        let diariaDeCurso =  "R$ 0,00";
        
        if(aluno.diariaMilitar){
          diariaMilitar = aluno.diariaMilitar.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        }
        if(aluno.diariaDeCursoQtd){
          let graduacaoAux = this.graduacoes.find(graduacao=>graduacao.id===aluno.graduacao_id);
          let aux=0;
          if(graduacaoAux){
            aux =  aluno.diariaDeCursoQtd * graduacaoAux?.diariaCurso;
          }
          diariaDeCurso = aux.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          aluno.diariaDeCurso = aux;
        }
        array=[
          aluno.graduacao,
          aluno.mtcl,
          aluno.name,
          this.getEscolaridade(aluno.escolaridade_id || 0),
          diariaMilitar,
          aluno.diariaDeCursoQtd,
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
      this.diariaDeCursoArray.push(array)
    });
    this.cursoService.setAtributoByCursoEscolhidoID('diariaDeCursoArray',this.diariaDeCursoArray)

  }
  getEscolaridade(escolaridade_id:number):string{
    let escolaridadeAux=this.escolaridades.find(escolaridade=>escolaridade.id === escolaridade_id);
    return escolaridadeAux?.nome || ""
  }
}
