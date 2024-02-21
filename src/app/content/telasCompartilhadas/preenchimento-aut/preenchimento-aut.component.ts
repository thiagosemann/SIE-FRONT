import { Component } from '@angular/core';
import {ToastrService } from 'ngx-toastr';
import { DocumentosCriadosService } from 'src/app/shared/service/documentosCriados_service';
import { CursoService } from 'src/app/shared/service/objetosCursosService';

@Component({
  selector: 'app-preenchimento-aut',
  templateUrl: './preenchimento-aut.component.html',
  styleUrls: ['./preenchimento-aut.component.css']
})
export class PreenchimentoAutComponent {

  constructor(private documentosCriadosService: DocumentosCriadosService, private cursoService: CursoService,private toastr: ToastrService) {}

  carregarDados() {
    const codigoAutenticacao = (document.getElementById('inputGrande') as HTMLInputElement).value;
    if (!codigoAutenticacao) {
      console.log('Código de autenticação não pode estar vazio.');
      return;
    }


    this.documentosCriadosService.getCursoByAuth(codigoAutenticacao).subscribe(
      (resp: any) => {
        if (resp) {
          // Aqui você tem o curso correspondente com base no código de autenticação
          console.log('Curso encontrado:', resp.dados);
          if(this.cursoService.getIdEscolhido() == resp.dados.id){
            this.cursoService.setCursoPreenchimentoAutomatico( resp.dados);
            this.toastr.success("Curso preenchido com sucesso!");
            (document.getElementById('inputGrande') as HTMLInputElement).value = ''; // Limpar o valor do input

          }else{
            this.toastr.error("Autenticação não pertence a esse processo!")

          }
        } else {
          this.toastr.error("Autentucação não encontrado!")

        }
      },
      (error: any) => {
        console.log('Erro ao buscar curso:', error);
        // Aqui você pode tratar o erro, exibir uma mensagem de erro ou tomar alguma ação apropriada.
      }
    );
  }
}
