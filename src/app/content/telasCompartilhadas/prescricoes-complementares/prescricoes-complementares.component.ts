import { Component } from '@angular/core';
import { Prescricao } from 'src/app/shared/utilitarios/prescricao';
import { ContentComponent } from '../../content.component';
import { CursoService } from 'src/app/shared/service/objetosCursosService';

@Component({
  selector: 'app-prescricoes-complementares',
  templateUrl: './prescricoes-complementares.component.html',
  styleUrls: ['./prescricoes-complementares.component.css']
})
export class PrescricoesComplementaresComponent {
  prescricoes: Prescricao[] = [];
  subitensTemp: string[] = [];

  constructor(private contentComponent: ContentComponent, private cursoService: CursoService) {}

  ngOnInit(): void {
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (cursoEscolhido) {
      if (cursoEscolhido.prescricaoComplementar) {
        this.prescricoes = cursoEscolhido.prescricaoComplementar;
      }
    }
  }

  ngAfterViewInit() {
    this.isFormValid();
  }

  isFormValid(): void {
    if (this.prescricoes.length > 0) {
      this.contentComponent.changeValidityByComponentName(PrescricoesComplementaresComponent, true);
    } else {
      this.contentComponent.changeValidityByComponentName(PrescricoesComplementaresComponent, false);
    }
  }

  adicionarPrescricao(novaPrescricao: string) {
    if (novaPrescricao) {
      const prescricao = {
        letra: String.fromCharCode(65 + this.prescricoes.length),
        item: novaPrescricao,
        subitens: []
      };
      this.prescricoes.push(prescricao);
      this.subitensTemp.push('');
    }
    this.cursoService.setPrescricaoComplementarEscolhidoID(this.prescricoes);
    this.isFormValid();
  }

  adicionarSubItem(indexPrescricao: number, subitem: string) {
    if (subitem) {
      this.prescricoes[indexPrescricao].subitens.push(subitem);
      this.subitensTemp[indexPrescricao] = '';
    }
  }

  removerPrescricao(indexPrescricao: number) {
    this.prescricoes.splice(indexPrescricao, 1);
    this.subitensTemp.splice(indexPrescricao, 1);
    this.cursoService.setPrescricaoComplementarEscolhidoID(this.prescricoes);
    this.isFormValid();
  }

  removerSubItem(indexPrescricao: number, indexSubItem: number) {
    this.prescricoes[indexPrescricao].subitens.splice(indexSubItem, 1);
  }
}
