import { Component, OnInit,AfterViewInit } from '@angular/core';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { ContentComponent } from '../../content.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-vagas-civil',
  templateUrl: './vagas-civil.component.html',
  styleUrls: ['./vagas-civil.component.css']
})
export class VagasCivilComponent implements OnInit,AfterViewInit {
  municipios = ["Abdon Batista","Abelardo Luz","Agrolândia","Agronômica","Água Doce","Águas de Chapecó","Águas Frias","Águas Mornas","Alfredo Wagner","Alto Bela Vista","Anchieta","Angelina","Anita Garibaldi","Anitápolis","Antônio Carlos","Apiúna","Arabutã","Araquari","Araranguá","Armazém","Arroio Trinta","Arvoredo","Ascurra","Atalanta","Aurora","Balneário Arroio do Silva","Balneário Camboriú","Balneário Barra do Sul","Balneário Gaivota","Bandeirante","Barra Bonita","Barra Velha","Bela Vista do Toldo","Belmonte","Benedito Novo","Biguaçu","Blumenau","Bocaina do Sul","Bombinhas","Bom Jardim da Serra","Bom Jesus","Bom Jesus do Oeste","Bom Retiro","Botuverá","Braço do Norte","Braço do Trombudo","Brunópolis","Brusque","Caçador","Caibi","Calmon","Camboriú","Capão Alto","Campo Alegre","Campo Belo do Sul","Campo Erê","Campos Novos","Canelinha","Canoinhas","Capinzal","Capivari de Baixo","Catanduvas","Caxambu do Sul","Celso Ramos","Cerro Negro","Chapadão do Lageado","Chapecó","Cocal do Sul","Concórdia","Cordilheira Alta","Coronel Freitas","Coronel Martins","Corupá","Correia Pinto","Criciúma","Cunha Porã",
"Cunhataí","Curitibanos","Descanso","Dionísio Cerqueira","Dona Emma","Doutor Pedrinho","Entre Rios","Ermo","Erval Velho","Faxinal dos Guedes","Flor do Sertão","Florianópolis","Formosa do Sul","Forquilhinha","Fraiburgo","Frei Rogério","Galvão","Garopaba","Garuva","Gaspar","Governador Celso Ramos","Grão Pará","Gravatal","Guabiruba","Guaraciaba","Guaramirim","Guarujá do Sul","Guatambú","Herval dOeste","Ibiam","Ibicaré","Ibirama","Içara","Ilhota","Imaruí","Imbituba","Imbuia","Indaial","Iomerê","Ipira","Iporã do Oeste","Ipuaçu","Ipumirim","Iraceminha","Irani","Irati","Irineópolis","Itá","Itaiópolis","Itajaí","Itapema","Itapiranga","Itapoá","Ituporanga","Jaborá","Jacinto Machado","Jaguaruna","Jaraguá do Sul","Jardinópolis","Joaçaba","Joinville","José Boiteux","Jupiá","Lacerdópolis","Lages","Laguna","Lajeado Grande","Laurentino","Lauro Muller","Lebon Régis","Leoberto Leal","Lindóia do Sul","Lontras","Luiz Alves","Luzerna","Macieira","Mafra","Major Gercino","Major Vieira","Maracajá","Maravilha","Marema","Massaranduba","Matos Costa","Meleiro","Mirim Doce","Modelo","Mondaí","Monte Carlo","Monte Castelo","Morro da Fumaça","Morro Grande","Navegantes","Nova Erechim","Nova Itaberaba","Nova Trento","Nova Veneza","Novo Horizonte","Orleans","Otacílio Costa","Ouro","Ouro Verde","Paial","Painel","Palhoça","Palma Sola","Palmeira","Palmitos","Papanduva","Paraíso","Passo de Torres","Passos Maia","Paulo Lopes","Pedras Grandes","Penha","Peritiba","Pescaria Brava","Petrolândia","Balneário Piçarras","Pinhalzinho","Pinheiro Preto","Piratuba","Planalto Alegre","Pomerode","Ponte Alta","Ponte Alta do Norte","Ponte Serrada","Porto Belo","Porto União","Pouso Redondo","Praia Grande","Presidente Castello Branco","Presidente Getúlio","Presidente Nereu","Princesa","Quilombo","Rancho Queimado","Rio das Antas","Rio do Campo","Rio do Oeste","Rio dos Cedros","Rio do Sul","Rio Fortuna","Rio Negrinho","Rio Rufino","Riqueza","Rodeio","Romelândia","Salete","Saltinho","Salto Veloso","Sangão","Santa Cecília","Santa Helena","Santa Rosa de Lima","Santa Rosa do Sul","Santa Terezinha","Santa Terezinha do Progresso","Santiago do Sul","Santo Amaro da Imperatriz","São Bernardino","São Bento do Sul","São Bonifácio","São Carlos","São Cristovão do Sul","São Domingos","São Francisco do Sul","São João do Oeste","São João Batista","São João do Itaperiú","São João do Sul","São Joaquim","São José","São José do Cedro","São José do Cerrito","São Lourenço do Oeste","São Ludgero","São Martinho","São Miguel da Boa Vista","São Miguel do Oeste","São Pedro de Alcântara","Saudades","Schroeder","Seara","Serra Alta","Siderópolis","Sombrio","Sul Brasil","Taió","Tangará","Tigrinhos","Tijucas","Timbé do Sul","Timbó","Timbó Grande","Três Barras","Treviso","Treze de Maio","Treze Tílias","Trombudo Central","Tubarão","Tunápolis","Turvo","União do Oeste","Urubici","Urupema","Urussanga","Vargeão","Vargem","Vargem Bonita","Vidal Ramos","Videira","Vitor Meireles","Witmarsum","Xanxerê","Xavantina","Xaxim","Zortéa"];
  vagasForm: FormGroup;
  cursoEscolhido : Curso | undefined;

  constructor(
    private cursoService: CursoService,
    private contentComponent : ContentComponent,
    private formBuilder: FormBuilder,

  ){
    this.vagasForm = this.formBuilder.group({
      municipio1Civil: null,
      municipio2Civil: null,
      municipio3Civil: null
    });
    
  }

  ngOnInit() {
    this.cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (this.cursoEscolhido) {
      const propertiesGroup = {
        municipio1Civil: this.cursoEscolhido.municipio1Civil,
        municipio2Civil: this.cursoEscolhido.municipio2Civil,
        municipio3Civil: this.cursoEscolhido.municipio3Civil,
      };
      this.vagasForm.patchValue(propertiesGroup);
    }
    this.vagasForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.enviarDados();
      });
  }
  ngAfterViewInit(){
    this.isFormValid()
  }
  enviarDados() {
    const propertiesGroup = {
      municipio1Civil: this.vagasForm.get('municipio1Civil')?.value,
      municipio2Civil: this.vagasForm.get('municipio2Civil')?.value,
      municipio3Civil: this.vagasForm.get('municipio3Civil')?.value
    };
    this.cursoService.setPropertyOnCursosByCursoEscolhidoID(propertiesGroup);
    this.isFormValid();
  }

  isFormValid(): void {
    const formControls = this.vagasForm.controls;
    console.log(formControls)
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.invalid || control.value === null) {
          this.contentComponent.changeValidityByComponentName(VagasCivilComponent, false);
          return;
        }
      }
    }
    this.contentComponent.changeValidityByComponentName(VagasCivilComponent, true);
  }


  
}
