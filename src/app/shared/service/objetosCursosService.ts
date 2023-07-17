import { Injectable } from '@angular/core';
import { Curso } from '../utilitarios/objetoCurso';
import { User } from '../utilitarios/user';
import { Requisito } from '../utilitarios/requisito';
import { Prescricao } from '../utilitarios/prescricao';
import { Alimento } from '../utilitarios/alimento';
import { Uniforme } from '../utilitarios/uniforme';
import { Material } from '../utilitarios/material';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private cursos: Curso[] = [];
  private cursoEscolhidoId: number = 0;

  constructor() { }

  // Método para adicionar um novo curso à lista
  adicionarCurso(curso: Curso): void {
    // Atribui um novo ID ao curso
    this.cursos.push(curso);
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
  
  // Método para encontrar um curso pelo ID e definir como curso escolhido
  setIdCursoEscolhido(id: number): void {
    this.cursoEscolhidoId = id;
  }

  // Método para obter um curso pelo ID
  getCursoById(id: number): Curso | undefined {
    return this.cursos.find(curso => curso.id === id);
  }

  setPropertyOnCursosByCursoEscolhidoID(properties: Partial<Curso>): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      Object.assign(cursoEscolhido, properties);
    }
    console.log(this.getCursos())
  }
  setCoordenadorOnCursosByCursoEscolhidoID(properties: Partial<Curso>): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      cursoEscolhido.coordenador = properties.coordenador;
      cursoEscolhido.coordenadorContato = `Telefones: ${properties.coordenador?.telefoneFunc ?? ''},  ${properties.coordenador?.telefoneOBM ?? ''} ${properties.coordenador?.email ?? ''}`;
      cursoEscolhido.coordenadorDescricao = `${this.formatarGraduacao(properties.coordenador?.graduacao ?? '',"Abreviar") } BM MTCL ${properties.coordenador?.mtcl ?? ''} ${properties.coordenador?.nomeCompleto ?? ''}`;
    }
    console.log(this.getCursos());
  }
  
  setSelectedProfessorsByCursoEscolhidoID(selectedProfessors: User[]): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      cursoEscolhido.selectedProfessors = selectedProfessors;
    }
    console.log(this.getCursos());
  }
  setRequisitoComplementarEscolhidoID(requisitoComplementar: Requisito[]): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      cursoEscolhido.requisitoComplementar = requisitoComplementar;
    }
    console.log(this.getCursos());
  }
  setPrescricaoComplementarEscolhidoID(prescricaoComplementar: Prescricao[]): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      cursoEscolhido.prescricaoComplementar = prescricaoComplementar;
    }
    console.log(this.getCursos());
  }
  setAlimentosEscolhidoID(alimentos: Alimento[]): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      cursoEscolhido.alimentos = alimentos;
    }
    console.log(this.getCursos());
  }
  setUniformesEscolhidoID(uniformes: Uniforme[]): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      cursoEscolhido.uniformes = uniformes;
    }
    console.log(this.getCursos());
  }  
  setMaterialEscolhidoID(material: Material[], type: string): void {
    const cursoEscolhido = this.getCursoById(this.cursoEscolhidoId);
    if (cursoEscolhido) {
      if(type === "Coletivo"){
        cursoEscolhido.materialColetivo = material;
      }else{
        cursoEscolhido.materialIndividual = material;
      }
    }
    console.log(this.getCursos());
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
