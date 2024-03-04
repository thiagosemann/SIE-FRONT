import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContentComponent } from 'src/app/content/content.component';
import { ConsultaCepService } from 'src/app/shared/service/cepService';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-local-natacao',
  templateUrl: './local-natacao.component.html',
  styleUrls: ['./local-natacao.component.css']
})
export class LocalNatacaoComponent {
  localForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cursoService: CursoService,
    private contentComponent: ContentComponent,
    private cepService: ConsultaCepService
  ) {
    this.localForm = this.formBuilder.group({
      localNatacaoBairro: null,
      localNatacaoRua: null,
      localNatacaoNumeral: null,
      localNatacaoNome: null,
      localNatacaoMunicipio: null
    });
  }
  ngOnInit() {
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (cursoEscolhido) {
      const propertiesGroup = {
        localNatacaoBairro: cursoEscolhido.localNatacaoBairro,
        localNatacaoRua: cursoEscolhido.localNatacaoRua,
        localNatacaoNumeral: cursoEscolhido.localNatacaoNumeral,
        localNatacaoNome: cursoEscolhido.localNatacaoNome,
        localNatacaoMunicipio: cursoEscolhido.localNatacaoMunicipio,
      };
      this.localForm.patchValue(propertiesGroup);
    }
    this.localForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.enviarDados());
  }

  ngAfterViewInit() {
    this.isFormValid();
  }

  enviarDados() {
    const propertiesGroup = {
      localNatacaoBairro: this.localForm.get('localNatacaoBairro')?.value,
      localNatacaoRua: this.localForm.get('localNatacaoRua')?.value,
      localNatacaoNumeral: this.localForm.get('localNatacaoNumeral')?.value,
      localNatacaoNome: this.localForm.get('localNatacaoNome')?.value,
      localNatacaoMunicipio: this.localForm.get('localNatacaoMunicipio')?.value
    };
    this.cursoService.setPropertyOnCursosByCursoEscolhidoID(propertiesGroup);
    this.cursoService.setLocalNatacaoAbertura();
    this.isFormValid();
  }

  isFormValid(): void {
    const formControls = this.localForm.controls;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.invalid || control.value === null) {
          this.contentComponent.changeValidityByComponentName(LocalNatacaoComponent, false);
          return;
        }
      }
    }
    this.contentComponent.changeValidityByComponentName(LocalNatacaoComponent, true);
  }

  consultaCEP(event: Event) {
    const cep = (event.target as HTMLInputElement).value;
    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
        .subscribe((response: any) => {
          const propertiesGroup = {
            localNatacaoBairro: response.bairro,
            localNatacaoRua: response.logradouro,
            localNatacaoMunicipio: response.localidade
          };
          this.localForm.patchValue(propertiesGroup);
        });
    }
  }
}
