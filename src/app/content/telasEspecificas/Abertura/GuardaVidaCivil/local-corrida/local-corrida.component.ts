import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContentComponent } from 'src/app/content/content.component';
import { ConsultaCepService } from 'src/app/shared/service/cepService';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-local-corrida',
  templateUrl: './local-corrida.component.html',
  styleUrls: ['./local-corrida.component.css']
})
export class LocalCorridaComponent {
  localForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cursoService: CursoService,
    private contentComponent: ContentComponent,
    private cepService: ConsultaCepService
  ) {
    this.localForm = this.formBuilder.group({
      localCorridaBairro: null,
      localCorridaRua: null,
      localCorridaNumeral: null,
      localCorridaNome: null,
      localCorridaMunicipio: null
    });
  }
  ngOnInit() {
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (cursoEscolhido) {
      const propertiesGroup = {
        localCorridaBairro: cursoEscolhido.localCorridaBairro,
        localCorridaRua: cursoEscolhido.localCorridaRua,
        localCorridaNumeral: cursoEscolhido.localCorridaNumeral,
        localCorridaNome: cursoEscolhido.localCorridaNome,
        localCorridaMunicipio: cursoEscolhido.localCorridaMunicipio,
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
      localCorridaBairro: this.localForm.get('localCorridaBairro')?.value,
      localCorridaRua: this.localForm.get('localCorridaRua')?.value,
      localCorridaNumeral: this.localForm.get('localCorridaNumeral')?.value,
      localCorridaNome: this.localForm.get('localCorridaNome')?.value,
      localCorridaMunicipio: this.localForm.get('localCorridaMunicipio')?.value
    };
    this.cursoService.setPropertyOnCursosByCursoEscolhidoID(propertiesGroup);
    this.cursoService.setLocalCorridaAbertura();
    this.isFormValid();
  }

  isFormValid(): void {
    const formControls = this.localForm.controls;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.invalid || control.value === null) {
          this.contentComponent.changeValidityByComponentName(LocalCorridaComponent, false);
          return;
        }
      }
    }
    this.contentComponent.changeValidityByComponentName(LocalCorridaComponent, true);
  }

  consultaCEP(event: Event) {
    const cep = (event.target as HTMLInputElement).value;
    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
        .subscribe((response: any) => {
          const propertiesGroup = {
            localCorridaBairro: response.bairro,
            localCorridaRua: response.logradouro,
            localCorridaMunicipio: response.localidade
          };
          this.localForm.patchValue(propertiesGroup);
        });
    }
  }
}

