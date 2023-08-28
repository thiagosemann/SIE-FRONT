import { Injectable } from '@angular/core';
import { Curso } from '../utilitarios/objetoCurso';
import { AtividadeHomologadaService } from './atividadeHomologadaService';
import { AtividadeHomologada } from '../utilitarios/atividadeHomologada';
import { Subitem, Subsubitem } from '../utilitarios/documentoPdf';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private cursos: Curso[] = [];
  private cursoEscolhidoId: number = 0;
  constructor(private atividadeHomologadaService:AtividadeHomologadaService) { }

  // Método para adicionar um novo curso à lista
  adicionarCurso(curso: Curso): void {
    // Atribui um novo ID ao curso
    this.cursos.push(curso);
    console.log(this.cursos)
  }

  // Método para obter todos os cursos
  getCursos(): Curso[] {
    return this.cursos;
  }

  getIdEscolhido() {
    return this.cursoEscolhidoId;
  }

  getCursoEscolhido(){
    return this.cursos.find(curso => curso.id === this.cursoEscolhidoId);
  }

  setCursoPreenchimentoAutomatico(curso: Curso): void {
    const cursoEscolhido = this.cursos.find(curso => curso.id === this.cursoEscolhidoId);
  
    if (cursoEscolhido) {
      Object.assign(cursoEscolhido, curso);
      console.log('Curso escolhido atualizado:', cursoEscolhido);
    } else {
      console.log('Curso escolhido não encontrado com o ID fornecido:', this.cursoEscolhidoId);
    }
  }

  setIdCursoEscolhido(id: number) {
    const curso = this.cursos.find(curso => curso.id === id);
    this.cursoEscolhidoId = id;
  }

  async isHomologado(sigla:string,name:string): Promise<boolean>{
    const atividade = await this.getAtividade(sigla);
    if (atividade && Object.keys(atividade).length > 0) {
      return true; // Curso homologado
    }else if(name !="CursoMilitar"){
      return true; // Curso homologado
    }
    return false
  }

 async inserirPropriedadesHomologadoCursoEscolhido(){
  const curso = this.cursos.find(curso => curso.id === this.cursoEscolhidoId);
    if (curso && curso.sigla) {
        const atividade = await this.getAtividade(curso.sigla);
        if (atividade && Object.keys(atividade).length > 0) {
          curso.atividadeHomologada = atividade;
          curso.sgpe = atividade.sgpe;
          curso.finalidade = atividade.finalidade;
          curso.atividadesPreliminares = atividade.atividadesPreliminares;
          curso.processoSeletivo = this.createItemProcessoSeletivo(atividade.processoSeletivo);
          curso.requisitoEspecifico = this.construirArrayFromString(atividade.reqEspecifico);

        }   
    }
  }

  // Método para obter um curso pelo ID
  getCursoById(id: number): Curso | undefined {
    return this.cursos.find(curso => curso.id === id);
  }
  setCoordenadorOnCursosByCursoEscolhidoID(properties: Partial<Curso>): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      cursoEscolhido.coordenador = properties.coordenador;
      cursoEscolhido.coordenadorContato = `Telefones: ${properties.coordenador?.telefoneFunc ?? ''},  ${properties.coordenador?.telefoneOBM ?? ''} ${properties.coordenador?.email ?? ''}`;
      cursoEscolhido.coordenadorDescricao = `${this.formatarGraduacao(properties.coordenador?.graduacao ?? '',"Abreviar") } BM MTCL ${properties.coordenador?.mtcl ?? ''} ${properties.coordenador?.nomeCompleto ?? ''}`;
    }
  }

  
  setAtributoByCursoEscolhidoID(atributo: string, valor: any[]): void {
    this.setAttributeInCursoEscolhido(atributo, valor);
  }
  
  
  setDatasAbertura(){
    const curso = this.getCursoById(this.cursoEscolhidoId);
    if(curso){
      if(curso.startInscritiondate && curso.endInscritiondate ){
        curso.periodoInscricao = this.formatDateExtenso(curso.startInscritiondate,curso.endInscritiondate)
      }
      if(curso.iniCur && curso.fimCur ){
        curso.periodoAtividade = this.formatDateExtenso(curso.iniCur,curso.fimCur)
      }
    }
  }
  setLocalAbertura(){
    const curso = this.getCursoById(this.cursoEscolhidoId);
    if(curso){
      curso.localApresentacao = curso.localAtiRua +", "+ curso.localAtiNumeral +", "+ curso.localAtiBairro +", "+ curso.localAtiMunicipio +" - "+ curso.localAtiNome;
    }
  }
  setVagasMunicipio() {
    const curso = this.getCursoById(this.cursoEscolhidoId);
    if (curso) {
      curso.vagasMunicipio = curso.municipio1Civil + ", " + curso.municipio2Civil + " e " + curso.municipio3Civil;
    }
  }

  setRedesSociais() {
    const curso = this.getCursoById(this.cursoEscolhidoId);
    if (curso) {
      if (curso.facebook && curso.instagram && curso.outrosMeios) {
        curso.redesSociais = curso.facebook + ", " + curso.instagram + " e " + curso.outrosMeios;
      } else if (curso.facebook && curso.instagram) {
        curso.redesSociais = curso.facebook + " e " + curso.instagram;
      } else if (curso.instagram && curso.outrosMeios) {
        curso.redesSociais = curso.instagram + " e " + curso.outrosMeios;
      } else if (curso.facebook) {
        curso.redesSociais = curso.facebook;
      } else if (curso.instagram) {
        curso.redesSociais = curso.instagram;
      } else if (curso.outrosMeios) {
        curso.redesSociais = curso.outrosMeios;
      }
    }
  }
  
  
  setpromoAtivAbertura(){
    const curso = this.getCursoById(this.cursoEscolhidoId);
    if(curso){
      curso.promoApresentacao = curso.promoAtiRua +", "+ curso.promoAtiNumeral +", "+ curso.promoAtiBairro +", "+ curso.promoAtiMunicipio +" - "+ curso.promoAtiNome;
    }
  }

// ----------------------------------------------------------------Utilitários---------------------------------------------------------------------------//
 
  setAttributeInCursoEscolhido(atributo: string, valor: any): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      cursoEscolhido[atributo] = valor;
    }
  }


// Função para buscar a atividade de ensino homologada
    getAtividade(sigla: string): Promise<AtividadeHomologada | undefined> {
      return new Promise<AtividadeHomologada | undefined>((resolve, reject) => {
        this.atividadeHomologadaService.getAtividadeBySigla(sigla).subscribe(
          (atividade: AtividadeHomologada | undefined) => {
            resolve(atividade);
          },
          (error) => {
            console.error(error);
            reject(error);
          }
        );
      });
    }
    private createItemProcessoSeletivo(string: string): any[] {
      if(string){
        const objeto = {
          tipo: 'item',
          numero: '',
          texto: "As vagas previstas neste edital serão preenchidas de acordo com os seguintes critérios de seleção:",
          subitens: [] as Subitem[]
        };
        objeto.subitens = this.construirArrayFromString(string)
        return [objeto]
      }else{
        const objeto = {
          tipo: 'item',
          numero: '',
          texto: "As vagas previstas neste edital, observados os requisitos, serão preenchidas de acordo com a ordem de prioridade referida no item anterior.",
          subitens: [] as Subitem[]
        };
        return [objeto]
      }
  
    }
  
    // Função provisória para textos do google scripts
    private construirArrayFromString(string: string): any[] {
      const linhas = string.split('\n');
      const arrayObjetos = [];
    
      for (const linha of linhas) {
        const primeiroCaractere = linha.charAt(0);
        const segundoCaractere = linha.charAt(1);
        
        const texto = linha.substring(2).trim();
        if (primeiroCaractere.match(/[a-z]/i)) { // SubItem
          const objeto = {
            tipo: 'subitem',
            letra: primeiroCaractere.toUpperCase() + ')',
            texto: texto,
            subsubitens: [] as Subsubitem[]
          };
          arrayObjetos.push(objeto);
        } else if (segundoCaractere.match(/[0-9]/)) { // Subsubitem
          const index = arrayObjetos.length-1;
          const objeto = {
            tipo: 'subsubitem',
            letra: '('+segundoCaractere.toUpperCase() + ')',
            texto: texto.substring(1),
            subsubsubitens: []
          };
          arrayObjetos[index].subsubitens.push(objeto);
        } else {
          continue; // Ignorar linhas que não correspondem aos padrões de subitens ou subsubitens
        }
      }
    
      return arrayObjetos;
    }
    
  


  setPropertyOnCursosByCursoEscolhidoID(properties: Partial<Curso>): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      Object.assign(cursoEscolhido, properties);
      cursoEscolhido.localApresentacao = cursoEscolhido.localAtiRua +", "+ cursoEscolhido.localAtiNumeral +", "+ cursoEscolhido.localAtiBairro +", "+ cursoEscolhido.localAtiMunicipio +" - "+ cursoEscolhido.localAtiNome;
    }
  }

  formatDateExtenso(dataIni:string, dataFim:string) {
    const mes = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"]
    let dIni = dataIni[0] + dataIni[1];
    let mIni = dataIni[3] + dataIni[4];
    let aIni = dataIni[6] + dataIni[7] + dataIni[8] + dataIni[9];
    let dFim = dataFim[0] + dataFim[1];
    let mFim = dataFim[3] + dataFim[4];
    let aFim = dataFim[6] + dataFim[7] + dataFim[8] + dataFim[9];
 
    if(dIni == dFim && mIni == mFim){
      return  dIni + " de " + mes[parseInt(mIni)-1] + " de " + aIni;
    }else if(aIni == aFim && mIni == mFim){
      return  dIni + " a " + dFim + " de " + mes[parseInt(mIni)-1] + " de " + aIni;
    }else if(aIni == aFim && mIni != mFim){
      return  dIni + " de " + mes[parseInt(mIni)-1] + " a " + dFim + " de "  + mes[parseInt(mFim)-1] + " de " + aIni;
    } else  if(aIni != aFim){
      return   dIni + " de " + mes[parseInt(mIni)-1] + " de " + aIni + " a " + dFim + " de "  + mes[parseInt(mFim)-1] + " de " + aFim;
    }
    return ""
  } 

  formatarGraduacao(posto:string,formato:string){
    const postoName = ["SOLDADO 3ª CLASSE NQ","SOLDADO 3ª CLASSE","SOLDADO 2ª CLASSE","SOLDADO 1ª CLASSE","CABO","ALUNO SARGENTO","3º SARGENTO ALUNO","2º SARGENTO ALUNO","3º SARGENTO","2º SARGENTO","1º SARGENTO","SUBTENENTE","2º TENENTE","1º TENENTE","CAPITAO","MAJOR","TENENTE CORONEL","CORONEL","CHEFE DO ESTADO-MAIOR GERAL DO CORPO DE BOMBEIROS MILITAR","COMANDANTE-GERAL DO CBMSC","SUBCOMANDANTE-GERAL DOCORPO DE BOMBEIROS MILITAR"];
    const postoAbbreviations = ["SD","SD","SD","SD","CB","ALSGT","ALSGT","ALSGT","SGT","SGT","SGT","ST","TEN","TEN","CAP","MAJ","TC","CEL","CHEFE DO EM","CMD GERAL","SUB CMD GERAL"];
    const postoAbbreviationsTableDoc = ["SD 3ºC","SD 3ºC","SD 2ºC","SD 1ºC","CB","AL SGT","3º SGT AL","2º SGT AL","3º SGT","2º SGT","1º SGT","ST","2º TEN","1º TEN","CAP","MAJ","TC","CEL","CHEFE DO EM","CMD GERAL","SUB CMD GERAL"];
    const postoToLowerCase = ["Soldado","Soldado","Soldado","Soldado","Cabo","Aluno Sargento","3º Sargento Aluno","2º Sargento Aluno","3º Sargento","2º Sargento","1º Sargento","Subtenente","2º Tenente","1º Tenente","Capitão","Major","Tenente Coronel","Coronel","Chefe do Estado Maior","Comandante Geral","Sub Comandante Geral"];
   
    let postoComFormatacao;
    if (formato === "Abreviar") {
      postoComFormatacao = postoAbbreviations;
    } else if (formato === "AbreviarTableDocentes") {
      postoComFormatacao = postoAbbreviationsTableDoc;
    } else if (formato === "AbreviarLowerCase") {
      postoComFormatacao = postoToLowerCase;
    }
    const index = postoName.indexOf(posto);
    return index === -1 || !postoComFormatacao ? "" : postoComFormatacao[index];

  }

}
