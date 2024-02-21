import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentosCriadosService } from '../shared/service/documentosCriados_service';
import { Curso } from '../shared/utilitarios/objetoCurso';
import { ToastrService } from 'ngx-toastr';
import { IbgeService } from '../shared/service/ibgeService';
import { ConsultaCepService } from '../shared/service/cepService';
import { UserCivilService } from '../shared/service/usersCivil_service';
import { UserCivil } from '../shared/utilitarios/userCivil';
import { InscricaoService } from '../shared/service/inscrition_service';


@Component({
  selector: 'app-inscrition',
  templateUrl: './inscrition.component.html',
  styleUrls: ['./inscrition.component.css']
})
export class InscritionComponent implements OnInit {
  nomeAtividade: String = "";
  objetoCurso: Curso | undefined;
  registrationForm: FormGroup;
  estados: any[] = [];
  documentId:number | undefined;
  municipios: any[] = [];
  birthCityArray: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private documentosCriadosService: DocumentosCriadosService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private ibgeService: IbgeService,
    private cepService : ConsultaCepService,
    private userCivilService: UserCivilService,
    private inscritionService: InscricaoService

    ) {
    this.registrationForm = this.fb.group({
      acceptTerms: [false, Validators.required],
      fullName: ['', Validators.required],
      cpf: ['', Validators.required],
      birthdate: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmacaoEmail: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      fatherName: ['', Validators.required],
      motherName: ['', Validators.required],
      nationality: ['', Validators.required],
      birthState: ['', Validators.required],
      birthCity: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      raca: ['', Validators.required],
      cep: ['', Validators.required],
      estado: ['', Validators.required],
      municipio: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: ['', Validators.required],
      logradouro: ['', Validators.required],
      bairro: ['', Validators.required],
      problemaSaudeBool: ['', Validators.required],
      problemaSaude: ['',Validators.required],
      conclusaoCBAEBool: ['', Validators.required],
      conclusaoCBAEAno: ['', Validators.required],
    });
  }

  ngOnInit(): void {
      const auth = this.route.snapshot.paramMap.get('id') ?? '';
      this.ibgeService.getEstados().subscribe(estados => {
        this.estados = estados;
      });
      this.documentosCriadosService.getCursoByAuth(auth).subscribe({
        next: (resp: any) => {
          this.objetoCurso = resp.dados;
          this.documentId = resp.id;
        },
        error: (error: any) => {
          console.log('Erro ao buscar curso:', error);
          this.router.navigate(['/login']);
        },
      });
        // Assinar mudanças no campo de estado
      this.registrationForm.get('estado')?.valueChanges.subscribe(estadoId => {
        if (estadoId) {
          this.ibgeService.getMunicipios(estadoId).subscribe(municipios => {
            this.municipios = municipios;
          });
        }
      });
      this.registrationForm.get('birthState')?.valueChanges.subscribe(estadoId => {
        if (estadoId) {
          this.ibgeService.getMunicipios(estadoId).subscribe(municipios => {
            this.birthCityArray = municipios;
          });
        }
      });
      // Simulação de valores iniciais para teste
      this.registrationForm.patchValue({
        acceptTerms: true,
        fullName: 'John Doe',
        cpf: '123.456.789-06',
        birthdate: '1990-01-01', // Certifique-se de ajustar o formato da data conforme necessário
        gender: 'Masculino',
        email: 'john.doe@example.com',
        confirmacaoEmail: 'john.doe@example.com',
        telefone: '123456789',
        fatherName: 'Pai do John',
        motherName: 'Mãe do John',
        nationality: 'brasileiro',
      //  birthState: 'SP',
     //   birthCity: 'São Paulo',
        maritalStatus: 'solteiro',
        raca: 'Branca',
        cep: '12345-678',
       // estado: 'SP',
      //  municipio: 'São Paulo',
        numero: '123',
        complemento: 'Apto 101',
        logradouro: 'Rua Exemplo',
        bairro: 'Centro',
        problemaSaudeBool: 'Não',
        problemaSaude: 'Teste',
        conclusaoCBAEBool: 'Sim',
        conclusaoCBAEAno: '2022',
      });

      
    }

    onSubmit() {
      if(this.registrationForm.value.acceptTerms){
        if (this.registrationForm.valid) {
          const userCivilData: UserCivil = this.registrationForm.value as UserCivil;
          const email = this.registrationForm.value.email;
          const confirmacaoEmail = this.registrationForm.value.confirmacaoEmail;
          if (email === confirmacaoEmail) {
            const userCivilData: UserCivil = this.registrationForm.value as UserCivil;
            this.userCivilService.createUserCivil(userCivilData).subscribe(
              (response: any) => {
                this.createInscricao(response.userId); // Cria a inscrição após a atualização ou criação do usuário
    
              },
              (error: any) => {
                console.error('Erro ao criar UserCivil:', error);
              }
            );
  
          } else {
            this.toastr.info("Os endereços de e-mail não coincidem.");
          }
          

        } else {
          this.toastr.info("Preencha todos os campos do formulário.");
          console.log('Formulário inválido. Por favor, verifique os campos.');
        }
      }else{
        this.toastr.info("Aceite o TERMO DE USO e a POLÍTICA DE PRIVACIDADE  ");

      }
     
    }

    private createInscricao(userId: number): void {
      // Lógica para criar uma inscrição usando o userId
      if(this.objetoCurso && this.objetoCurso.numeroProcesso && this.documentId ){
        console.log("this.objetoCurso",this.objetoCurso)
        const inscricaoData = {
          // Preencha os campos da inscrição conforme necessário
          procNum: this.objetoCurso.numeroProcesso,
          documentosCriadosId: this.documentId,
          userCivilId: userId,
          situacao: 'Pendente',
          classificacao:999
        };
        this.inscritionService.addInscricao(inscricaoData).subscribe(
          (inscricaoResponse: any) => {
            // Adicione lógica conforme necessário após a criação da inscrição
            // Exemplo: criação bem-sucedida, redirecionamento, etc.
            console.log('Inscrição criada com sucesso:', inscricaoResponse);
            this.toastr.success("Inscrição efetuada com sucesso!")
            this.registrationForm.reset();
          },
          (inscricaoError: any) => {
            console.error('Erro ao criar inscrição:', inscricaoError);
            if (inscricaoError.error && inscricaoError.error.error === 'User already registered') {
              // Exibe mensagem informando que o usuário já está inscrito
              this.toastr.warning('Você já está inscrito nesta atividade.');
              this.registrationForm.reset();
            } else {
              // Adicione lógica para lidar com outros erros de criação da inscrição
              this.toastr.error(inscricaoError.error.error);
            }
          }
        );
      }
    }
    
  // Método para carregar municípios com base no estado selecionado
  onEstadoSelected(estadoId: number): void {
    this.ibgeService.getMunicipios(estadoId).subscribe(municipios => {
      this.municipios = municipios;
    });
  }

  consultaCEP(event: Event) {
    const cep = (event.target as HTMLInputElement).value;
    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep).subscribe(
        (response: any) => {
          console.log(response);
  
          // Verifique se o serviço de CEP retornou as informações esperadas
          if (response.uf && response.localidade) {
            // Encontre o estado correspondente no array de estados
            const estadoSelecionado = this.estados.find((estado: any) => estado.sigla === response.uf);
  
            if (estadoSelecionado) {
              // Preencha o campo do estado no formulário
              this.registrationForm.get('estado')?.setValue(estadoSelecionado.id);
  
              // Preencha outros campos conforme necessário
              this.registrationForm.patchValue({
                municipio: response.localidade,
                logradouro: response.logradouro,
                bairro: response.bairro,
                // Adicione outros campos conforme necessário
              });
  
              // Carregue municípios com base no estado selecionado
              this.onEstadoSelected(estadoSelecionado.id);

            } else {
              console.warn('Estado não encontrado para a sigla:', response.uf);
            }
          } else {
            // Limpe os campos do estado e município se as informações não estiverem disponíveis
            this.registrationForm.patchValue({
              estado: null,
              municipio: null,
              logradouro: null,
              bairro: null,
              // Limpe outros campos conforme necessário
            });
  
          }
        },
        (error: any) => {
          console.error('Erro ao consultar CEP:', error);
        }
      );
    }
  }
  

}
