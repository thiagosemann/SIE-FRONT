import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { debounceTime } from 'rxjs/operators';
import { ContentComponent } from '../../content.component';

@Component({
  selector: 'app-meios-divulgacao',
  templateUrl: './meios-divulgacao.component.html',
  styleUrls: ['./meios-divulgacao.component.css']
})
export class MeiosDivulgacaoComponent implements OnInit {
  meiosDivulgacaoForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private cursoService: CursoService,private contentComponent: ContentComponent ) {
    this.meiosDivulgacaoForm = this.formBuilder.group({
      facebook: '',
      instagram: '',
      outrosMeios: ''
    });
  }

  ngOnInit() {
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (cursoEscolhido) {
      const propertiesGroup = {
        facebook: cursoEscolhido.facebook,
        instagram: cursoEscolhido.instagram,
        outrosMeios: cursoEscolhido.outrosMeios
      };
      this.meiosDivulgacaoForm.patchValue(propertiesGroup);
    }
    this.meiosDivulgacaoForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.enviarDados());
  }
  ngAfterViewInit(){
    this.isFormValid()
  }
  enviarDados() {
    const propertiesGroup = {
      facebook: this.meiosDivulgacaoForm.get('facebook')?.value,
      instagram: this.meiosDivulgacaoForm.get('instagram')?.value,
      outrosMeios: this.meiosDivulgacaoForm.get('outrosMeios')?.value
    };
    this.cursoService.setPropertyOnCursosByCursoEscolhidoID(propertiesGroup);
    this.cursoService.setRedesSociais();
    this.cursoService.setpromoAtivAbertura();
    this.isFormValid();
  }

  isFormValid(): void {
    const formControls = this.meiosDivulgacaoForm.controls;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.invalid || control.value === null) {
          this.contentComponent.changeValidityByComponentName(MeiosDivulgacaoComponent, false);
          return;
        }
      }
    }
    this.contentComponent.changeValidityByComponentName(MeiosDivulgacaoComponent, true);
  }
}
