import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ContentComponent } from 'src/app/content/content.component';
import { EscolaridadeService } from 'src/app/shared/service/escolaridade_service';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { UserService } from 'src/app/shared/service/user_service';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';

@Component({
  selector: 'app-diaria-militar',
  templateUrl: './diaria-militar.component.html',
  styleUrls: ['./diaria-militar.component.css']
})
export class DiariaMilitarComponent implements OnInit {
  cursoEscolhido: Curso | undefined ; 
  professores: any[] = []; // Array para armazenar os professores
  arrayAux: any[] = []; // Array para armazenar os professores

  constructor(private cursoService: CursoService){}

  ngOnInit(): void {
    this.cursoEscolhido = this.cursoService.getCursoEscolhido();
    if(this.cursoEscolhido && this.cursoEscolhido.docentesQTSObj){
      this.professores = this.cursoEscolhido.docentesQTSObj
    }
  }

  createProfessorArray(): void {
    this.arrayAux = [];
    let cabecalho=["Posto/Grad","Mtcl/Cpf","Nome completo","Escolaridade","D.M Valor","H/A Qtd","H/A Valor","Alimentação","Soma"];
    this.arrayAux.push(cabecalho)
    this.professores.forEach(professor=>{
      let resp:any[]=[];
        resp=[
          professor.graduacao,
          professor.mtcl,
          professor.name,
          professor.escolaridade,
          Number(professor.diariaMilitar).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          professor.horaAulaQtd,
          professor.horaAulaValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          "R$ 0,00",
          professor.horaAulaValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })  
        ];
        this.arrayAux.push(resp)
    })
    this.cursoService.setAtributoByCursoEscolhidoID('docentesQTS',this.arrayAux)
    this.cursoService.setAtributoByCursoEscolhidoID('docentesQTSObj',this.professores)

  }

}
