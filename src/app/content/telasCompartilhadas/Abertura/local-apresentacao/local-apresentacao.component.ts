import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CursoService } from '../../../../shared/service/objetosCursosService';
import { debounceTime } from 'rxjs/operators';
import { ContentComponent } from '../../../content.component';
import { ConsultaCepService } from 'src/app/shared/service/cepService';
import { Endereco } from '../../../../shared/utilitarios/cepRespObjeto'

@Component({
  selector: 'app-local-apresentacao',
  templateUrl: './local-apresentacao.component.html',
  styleUrls: ['./local-apresentacao.component.css']
})
export class LocalApresentacaoComponent implements OnInit {
  localForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cursoService: CursoService,
    private contentComponent: ContentComponent,
    private cepService : ConsultaCepService
  ) {
    this.localForm = this.formBuilder.group({
      localAtiBairro: null,
      localAtiRua: null,
      localAtiNumeral: null,
      localAtiNome: null,
      localAtiMunicipio: null
    });
  }

  ngOnInit() {
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (cursoEscolhido) {
      const propertiesGroup = {
        localAtiBairro: cursoEscolhido.localAtiBairro,
        localAtiRua: cursoEscolhido.localAtiRua,
        localAtiNumeral: cursoEscolhido.localAtiNumeral,
        localAtiNome: cursoEscolhido.localAtiNome,
        localAtiMunicipio: cursoEscolhido.localAtiMunicipio,
        
      };
      this.localForm.patchValue(propertiesGroup);
    }
    this.localForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.enviarDados());
  }
  ngAfterViewInit(){
    this.isFormValid()
  }
  enviarDados() {
    const propertiesGroup = {
      localAtiBairro: this.localForm.get('localAtiBairro')?.value,
      localAtiRua: this.localForm.get('localAtiRua')?.value,
      localAtiNumeral: this.localForm.get('localAtiNumeral')?.value,
      localAtiNome: this.localForm.get('localAtiNome')?.value,
      localAtiMunicipio:this.localForm.get('localAtiMunicipio')?.value
    };
    this.cursoService.setPropertyOnCursosByCursoEscolhidoID(propertiesGroup);
    this.cursoService.setLocalAbertura();
    this.isFormValid();
  }

  isFormValid(): void {
    const formControls = this.localForm.controls;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.invalid || control.value === null) {
          this.contentComponent.changeValidityByComponentName(LocalApresentacaoComponent, false);
          return;
        }
      }
    }
    this.contentComponent.changeValidityByComponentName(LocalApresentacaoComponent, true);
  }

  consultaCEP(event: Event) {
    const cep = (event.target as HTMLInputElement).value;
    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
      .subscribe((response: any) => {
        const propertiesGroup = {
          localAtiBairro: response.bairro,
          localAtiRua: response.logradouro,
          localAtiMunicipio: response.localidade
        };
        this.localForm.patchValue(propertiesGroup);
      });
    }
  }
  
  
}


