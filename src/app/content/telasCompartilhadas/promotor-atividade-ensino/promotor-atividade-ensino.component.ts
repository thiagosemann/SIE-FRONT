import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CursoService } from '../../../shared/service/objetosCursosService';
import { debounceTime } from 'rxjs/operators';
import { ContentComponent } from '../../content.component';
import { ConsultaCepService } from 'src/app/shared/service/cepService';

@Component({
  selector: 'app-promotor-atividade-ensino',
  templateUrl: './promotor-atividade-ensino.component.html',
  styleUrls: ['./promotor-atividade-ensino.component.css']
})
export class PromotorAtividadeEnsinoComponent {
  promoAtivForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cursoService: CursoService,
    private contentComponent: ContentComponent,
    private cepService : ConsultaCepService
  ) {
    this.promoAtivForm = this.formBuilder.group({
      promoAtiBairro: null,
      promoAtiRua: null,
      promoAtiNumeral: null,
      promoAtiNome: null,
      promoAtiMunicipio: null,
      promoAtiDescricao:null
    });
  }

  ngOnInit() {
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (cursoEscolhido) {
      const propertiesGroup = {
        promoAtiBairro: cursoEscolhido.promoAtiBairro,
        promoAtiRua: cursoEscolhido.promoAtiRua,
        promoAtiNumeral: cursoEscolhido.promoAtiNumeral,
        promoAtiNome: cursoEscolhido.promoAtiNome,
        promoAtiMunicipio: cursoEscolhido.promoAtiMunicipio,
        promoAtiDescricao: cursoEscolhido.promoAtiDescricao
      };
      this.promoAtivForm.patchValue(propertiesGroup);
    }
    this.promoAtivForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.enviarDados());
  }
  ngAfterViewInit(){
    this.isFormValid()
  }
  enviarDados() {
    const propertiesGroup = {
      promoAtiBairro: this.promoAtivForm.get('promoAtiBairro')?.value,
      promoAtiRua: this.promoAtivForm.get('promoAtiRua')?.value,
      promoAtiNumeral: this.promoAtivForm.get('promoAtiNumeral')?.value,
      promoAtiNome: this.promoAtivForm.get('promoAtiNome')?.value,
      promoAtiMunicipio:this.promoAtivForm.get('promoAtiMunicipio')?.value,
      promoAtiDescricao: this.promoAtivForm.get('promoAtiDescricao')?.value
    };
    this.cursoService.setPropertyOnCursosByCursoEscolhidoID(propertiesGroup);
    this.cursoService.setpromoAtivAbertura();
    this.isFormValid();
  }

  isFormValid(): void {
    const formControls = this.promoAtivForm.controls;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.invalid || control.value === null) {
          this.contentComponent.changeValidityByComponentName(PromotorAtividadeEnsinoComponent, false);
          return;
        }
      }
    }
    this.contentComponent.changeValidityByComponentName(PromotorAtividadeEnsinoComponent, true);
  }

  consultaCEP(event: Event) {
    const cep = (event.target as HTMLInputElement).value;
    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
      .subscribe((response: any) => {
        const propertiesGroup = {
          promoAtiBairro: response.bairro,
          promoAtiRua: response.logradouro,
          promoAtiMunicipio: response.localidade
        };
        this.promoAtivForm.patchValue(propertiesGroup);
      });
    }
  }
}
