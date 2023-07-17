import { Component, OnInit } from '@angular/core';
import { GoogleScriptService } from '../../../shared/service/googleScriptService';
import { UserService } from 'src/app/shared/service/user_service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Coordenador } from 'src/app/shared/utilitarios/coordenador';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { ContentComponent } from '../../content.component';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';
import { User } from 'src/app/shared/utilitarios/user';

@Component({
  selector: 'app-coordenador',
  templateUrl: './coordenador.component.html',
  styleUrls: ['./coordenador.component.css']
})
export class CoordenadorComponent implements OnInit {
  efetivo: any[] = [];
  email: string = '';
  logoUrl: string = ''; // URL da imagem
  user: User | undefined;
  coordenadorForm: FormGroup;

  constructor(
    private googleService: GoogleScriptService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private cursoService: CursoService,
    private contentComponent : ContentComponent

  ) {
    this.coordenadorForm = this.formBuilder.group({
      mtcl:null,
      nomeCompleto:null,
      email:null,
      telefoneFunc:null,
      telefoneOBM:null,
    });
  }

  ngOnInit() {
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (cursoEscolhido) {
      const propertiesGroup = {
        mtcl: cursoEscolhido.coordenador?.mtcl,
        nomeCompleto: cursoEscolhido.coordenador?.nomeCompleto,
        email: cursoEscolhido.coordenador?.email,
        telefoneFunc: cursoEscolhido.coordenador?.telefoneFunc,
        telefoneOBM: cursoEscolhido.coordenador?.telefoneOBM,
      };
      this.coordenadorForm.patchValue(propertiesGroup);
      if (cursoEscolhido.coordenador?.ldap) {
        this.logoUrl = "http://satcontrol.cbm.sc.gov.br/lob/fotos_bombeiros/" + cursoEscolhido.coordenador?.ldap;
      } 

    }
    this.coordenadorForm.valueChanges
    .pipe(debounceTime(300)) // Adicione um atraso de 300ms para evitar chamadas excessivas
    .subscribe(() => {
      this.enviarDados();
    });

  }

  ngAfterViewInit(){
    this.isFormValid()
  }

  enviarDados(nomeCompleto?: string) {
    const coordenador: Coordenador = {
      id: this.user?.id,
      mtcl: this.coordenadorForm.get('mtcl')?.value,
      nomeCompleto: nomeCompleto || this.coordenadorForm.get('nomeCompleto')?.value,
      email: this.coordenadorForm.get('email')?.value,
      telefoneFunc: this.coordenadorForm.get('telefoneFunc')?.value,
      telefoneOBM: this.coordenadorForm.get('telefoneOBM')?.value,
      ldap: this.user?.ldap,
      graduacao: this.user?.graduacao
    };
    const properties: Partial<Curso> = {
      coordenador: coordenador
    };
    this.cursoService.setCoordenadorOnCursosByCursoEscolhidoID(properties);
    this.isFormValid();
  }
  
  isFormValid(): void {
    const formControls = this.coordenadorForm.controls;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.invalid || control.value === null) {
          this.contentComponent.changeValidityByComponentName(CoordenadorComponent, false);
          return;
        }
      }
    }
    this.contentComponent.changeValidityByComponentName(CoordenadorComponent, true);
  }

  buscarUsuarioPorMatricula(event: Event) {
    const matricula = (event.target as HTMLInputElement).value;
  
    if (matricula.charAt(0) === '0') {
      (event.target as HTMLInputElement).value = '';
      return;
    }
    
    if (matricula && matricula.length === 8) {
      return this.userService.getUserByMtcl(matricula)
        .pipe(
          debounceTime(500), // Aguarda 500ms de inatividade
          distinctUntilChanged() // Ignora chamadas repetidas com o mesmo valor
        )
        .subscribe(user => {
          if (user) {
            this.logoUrl = "http://satcontrol.cbm.sc.gov.br/lob/fotos_bombeiros/" + user.ldap;
            // Atualizar o valor do campo nomeCompleto e ldap no formulário
            this.coordenadorForm.patchValue({ nomeCompleto: user.name });
            this.user = user;
            this.enviarDados();
          }
          

          //vincular nome completo com propriedade user.name
        });
    }else{
      this.logoUrl = "";
      this.user = undefined;
      this.coordenadorForm.patchValue({ nomeCompleto: "" });
    }
  
    return null; // Adicionado retorno vazio para a segunda instrução if
  }
  


}


