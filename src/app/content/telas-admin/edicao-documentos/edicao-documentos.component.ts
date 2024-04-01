import { Component, OnInit } from '@angular/core';
import { Documento, Capitulo, Item, Subitem, Subsubitem, Tabela } from '../../../shared/utilitarios/documentoPdf';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';
import { PdfService } from 'src/app/shared/service/documentosService/pdfService';
import { DocumentosService } from 'src/app/shared/service/documentosService/documento.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edicao-documentos',
  templateUrl: './edicao-documentos.component.html',
  styleUrls: ['./edicao-documentos.component.css']
})
export class EdicaoDocumentosComponent implements OnInit {
  pdfUrl: SafeResourceUrl | undefined;
  documentos?: Documento[];
  documento: Documento = {
    id: 0,
    nome: '',
    dados: {
      documento: []
    }
  };
  capitulos: Capitulo[] = [];
  novoCapituloNome: string = '';
  novoCapituloNumero: string = '';
  novoItemNome: string = '';
  novoItemNumero: string = '';
  novoSubitemNome: string = '';
  novoSubitemNumero: string = '';
  novoSubsubitemNome: string = '';
  novoSubsubitemLetra:string = '';
  novaTabelaNome: string = '';

  constructor(private pdfService: PdfService, private sanitizer: DomSanitizer, private documentsService: DocumentosService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getDocuments();
  }

  inicializarDocumentoVazio() {
    this.documento = {
      id: 0,
      nome: '',
      dados: {
        documento: []
      }
    };
    this.capitulos = [];
  }

  getDocuments() {
    this.inicializarDocumentoVazio();

    this.documentsService.getDocumentos().subscribe(
      (documentos: Documento[]) => {
        if (documentos && documentos.length > 0) {
          this.documentos = documentos;
          this.documento = { ...documentos[0] };
          if (this.documento.dados && Array.isArray(this.documento.dados.documento)) {
            this.capitulos = this.documento.dados.documento.filter((doc: any) => doc.tipo === 'capitulo');
          }
          console.log(this.documentos);
          this.previewDocumento();
        } else {
          this.documentos = undefined;
        }
      },
      (error) => {
        console.error('Erro ao obter documentos:', error);
        this.documentos = undefined;
      }
    );
  }

  selecionarDocumento(event: any) {
    const novoDocumentoNome = event.target.value;
    const novoDocumento = this.documentos?.find(documento => documento.nome === novoDocumentoNome);

    if (novoDocumento) {
      this.documento.id = novoDocumento.id;
      this.documento.nome = novoDocumento.nome;
      this.documento.dados = { ...novoDocumento.dados };
    }

    if (novoDocumento && novoDocumento.dados && Array.isArray(novoDocumento.dados.documento)) {
      this.capitulos = [];
      this.capitulos = novoDocumento.dados.documento.filter((doc: any) => doc.tipo === 'capitulo');
    }

    this.previewDocumento();
  }

  adicionarCapitulo() {
    const capitulo: Capitulo = {
      tipo: 'capitulo',
      texto: this.novoCapituloNome,
      numero: this.novoCapituloNumero,
      itens: []
    };
    this.capitulos.push(capitulo);
    this.novoCapituloNome = '';
    this.novoCapituloNumero = '';
    this.previewDocumento();
  }

  removerCapitulo(index: number) {
    this.capitulos.splice(index, 1);
    this.previewDocumento();
  }

  adicionarItem(capituloIndex: number) {
    const item: Item = {
      texto: this.novoItemNome,
      tipo: "item",
      numero: this.novoItemNumero,
      subitens: []
    };
    this.capitulos[capituloIndex].itens.push(item);
    this.novoItemNome = '';
    this.novoItemNumero = '';
    this.previewDocumento();
  }

  removerItem(capituloIndex: number, itemIndex: number) {
    this.capitulos[capituloIndex].itens.splice(itemIndex, 1);
    this.previewDocumento();
  }

  adicionarSubitem(capituloIndex: number, itemIndex: number) {
    const item = this.capitulos[capituloIndex].itens[itemIndex];
    if (!item.hasOwnProperty('subitens')) {
      item.subitens = [];
    }
    const subitem: Subitem = {
      tipo: 'subitem',
      texto: this.novoSubitemNome,
      letra: this.novoSubitemNumero,
      subsubitens: []
    };
    item.subitens.push(subitem);
    this.novoSubitemNome = '';
    this.novoSubitemNumero = '';
    this.previewDocumento();
  }

  removerSubitem(capituloIndex: number, itemIndex: number, subitemIndex: number) {
    this.capitulos[capituloIndex].itens[itemIndex].subitens.splice(subitemIndex, 1);
    this.previewDocumento();
  }

  adicionarSubsubitem(capituloIndex: number, itemIndex: number, subitemIndex: number) {
    const subsubitem: Subsubitem = {
      tipo: 'subsubitem',
      letra: this.novoSubsubitemLetra,
      texto: this.novoSubsubitemNome,
      subsubsubitens:[]
    };
    if (!this.capitulos[capituloIndex].itens[itemIndex].subitens[subitemIndex].subsubitens) {
      this.capitulos[capituloIndex].itens[itemIndex].subitens[subitemIndex].subsubitens = [];
    }
    this.capitulos[capituloIndex].itens[itemIndex].subitens[subitemIndex].subsubitens.push(subsubitem);

    this.novoSubsubitemNome = '';
    this.previewDocumento();
  }

  removerSubsubitem(capituloIndex: number, itemIndex: number, subitemIndex: number, subsubitemIndex: number) {
    this.capitulos[capituloIndex].itens[itemIndex].subitens[subitemIndex].subsubitens.splice(subsubitemIndex, 1);
    this.previewDocumento();
  }

  toggleEdicaoCapitulo(capitulo: Capitulo) {
    capitulo.editando = !capitulo.editando;
    if (!capitulo.editando) {
      this.previewDocumento();
    }
  }

  toggleEdicaoItem(item: Item) {
    item.editando = !item.editando;
    if (!item.editando) {
      this.previewDocumento();
    }
  }

  toggleEdicaoSubitem(subitem: Subitem) {
    subitem.editando = !subitem.editando;
    if (!subitem.editando) {
      this.previewDocumento();
    }
  }

  toggleEdicaoSubsubitem(subsubitem: Subsubitem) {
    subsubitem.editando = !subsubitem.editando;
    if (!subsubitem.editando) {
      this.previewDocumento();
    }
  }

  previewDocumento() {
    this.documento.dados.documento = this.capitulos;
    this.generatePdf();
  }

  async generatePdf(): Promise<void> {
    const selectElement = document.getElementById("seletor") as HTMLSelectElement;
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const selectedText = selectedOption ? selectedOption.text : '';
    let type = "plano";
    let nomeCurso = "Capacitacao";
    if (selectedText.includes("edital")) {
      type = "edital";
      nomeCurso = selectedText.replace(/edital/gi, "");
    } else if (selectedText.includes("plano")) {
      type = "plano";
      nomeCurso = selectedText.replace(/plano/gi, "");
    } else if (selectedText.includes("relatorio")) {
      type = "plano";
    }
    const curso: Curso = { id: 1 };

    if (curso) {
   //   const pdfBlob = await this.pdfService.edicaoDocument(this.documento.dados);
    //  const pdfUrl = URL.createObjectURL(pdfBlob);
  //    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
    }
  }

  salvarNoBancoDeDados() {
    this.documentsService.updateDocumento(this.documento.id, this.documento).subscribe(
      (response) => {
        this.toastr.success("Documento salvo com sucesso!")
      },
      (error) => {
        this.toastr.error("Erro ao salvar o documento!")
      }
    );
  }
}
