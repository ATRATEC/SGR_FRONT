import { GrupoCliente } from './grupocliente';
import { GrupoClasse } from './grupoclasse';
import { ApLocacao } from './aplocacao';
import { Despesa } from './despesa';
import { Receita } from './receita';
import { ManifestoFindComponent } from './../manifesto/manifesto-find.component';
import { ManifestoService } from './../manifesto/manifesto.service';
import { Manifesto } from './../manifesto/manifesto';
import { ContratoClienteService } from './../contratocliente/contratocliente.service';
import { ClienteFindComponent } from './../cliente/cliente-find.component';
import { ClienteService } from './../cliente/cliente.service';
import { environment } from './../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { Component, OnInit, AfterViewInit, AfterViewChecked, LOCALE_ID } from '@angular/core';
import { Router, Data } from '@angular/router';
import { by, element } from 'protractor';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { ChangeDetectorRef, ViewChildren, ViewChild, ElementRef } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Cliente } from '../cliente/cliente';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_LOCALE,
         MAT_DATE_FORMATS,  FloatPlaceholderType } from '@angular/material';
import { Servico } from '../servico/servico';
import { FormBuilder, FormGroup} from '@angular/forms';
import { ContratoFornecedor } from '../contratofornecedor/contratofornecedor';
import { RelatorioService } from './relatorio.service';
import { FiltroRelatorio } from './filtrorelatorio';
import * as jsPDF from 'jspdf';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-relatorio-form',
  templateUrl: './relatorio-form.component.html',
  styleUrls: ['./relatorio-form.component.css']
})
export class RelatorioFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  // relatorio: Relatorio;
  emProcessamento = false;
  exibeIncluir = false;
  hoje: Date;
  filtroRelatorio: FiltroRelatorio;
  receitas: Receita[];
  despesas: Despesa[];
  grupoclientes: GrupoCliente[];
  grupoclasses: GrupoClasse[];
  locacoes: ApLocacao[];
  sumTotalReceitas: number;
  sumTotalDespesas: number;
  sumTotalLocacoes: number;

  valCodigo = new FormControl();
  valManifesto = new FormControl();
  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('relatorio') el: ElementRef;

  constructor(private _relatorioService: RelatorioService,
    private _clienteService: ClienteService,
    private _manifestoService: ManifestoService,
    private _contratoclienteService: ContratoClienteService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService,
    private pesquisa: MatDialog) {}

  validaCampos() {
    return (
      this.valDescricao.valid
    );
  }

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.hoje = new Date();
    this.hoje.setDate(this.hoje.getDate() - 1);
    // this.relatorio = new Relatorio();

    // this._route.data.subscribe(data => {
    //   console.log(data.objeto);
    // });
    this.filtroRelatorio = new FiltroRelatorio();
    this.receitas = new Array<Receita>();
    this.despesas = new Array<Despesa>();
    this.locacoes = new Array<ApLocacao>();
    this.grupoclientes = new Array<GrupoCliente>();
    this.grupoclasses = new Array<GrupoClasse>();

    // this.receitas.push(new Receita(new Date(Date.now()), '2323', 'AÇO INOX', 'KARDEC', 'KARDEC', 200, 'KG', 2.50, 250));


    if (this._route.snapshot.paramMap.has('id')) {
      this.filtroRelatorio.id = +this._route.snapshot.paramMap.get('id');
      // console.log(this._route.snapshot.paramMap.get('id'));
    }
    if (this._route.snapshot.paramMap.has('id_cliente')) {
      if ((!isNullOrUndefined(this._route.snapshot.paramMap.get('id_cliente'))) &&
         (+this._route.snapshot.paramMap.get('id_cliente') !== NaN)) {
        this.filtroRelatorio.id_cliente = +this._route.snapshot.paramMap.get('id_cliente');
      }
      // console.log(this._route.snapshot.paramMap.get('id_cliente'));
    }

    if (this._route.snapshot.paramMap.has('cliente')) {
      this.filtroRelatorio.cliente = this._route.snapshot.paramMap.get('cliente');
      // console.log(this._route.snapshot.paramMap.get('cliente'));
    }

    if (this._route.snapshot.paramMap.has('receita')) {
      this.filtroRelatorio.receita = this._route.snapshot.paramMap.get('receita') === 'true';
      // console.log(this._route.snapshot.paramMap.get('receita'));
    }

    if (this._route.snapshot.paramMap.has('despesa')) {
      this.filtroRelatorio.despesa = this._route.snapshot.paramMap.get('despesa') === 'true';
      // console.log(this._route.snapshot.paramMap.get('despesa'));
    }

    if (this._route.snapshot.paramMap.has('agrupar_classe')) {
      this.filtroRelatorio.agrupar_classe = this._route.snapshot.paramMap.get('agrupar_classe') === 'true';
      // console.log(this._route.snapshot.paramMap.get('despesa'));
    }

    if (this._route.snapshot.paramMap.has('id_residuo')) {
      this.filtroRelatorio.id_residuo = +this._route.snapshot.paramMap.get('id_residuo');
      // console.log(this._route.snapshot.paramMap.get('id_residuo'));
    }

    if (this._route.snapshot.paramMap.has('datade')) {
      if ((!isNullOrUndefined(this._route.snapshot.paramMap.get('datade')))
        && (this._route.snapshot.paramMap.get('datade') !== 'null')) {
        this.filtroRelatorio.datade = new Date(this._route.snapshot.paramMap.get('datade'));
      }
      // console.log(this._route.snapshot.paramMap.get('id_residuo'));
    }

    if (this._route.snapshot.paramMap.has('dataate')) {
      if (!isNullOrUndefined(this._route.snapshot.paramMap.get('dataate'))) {
        this.filtroRelatorio.dataate = new Date(this._route.snapshot.paramMap.get('dataate'));
      }
      // console.log(this._route.snapshot.paramMap.get('id_residuo'));
    }

    if (this._route.snapshot.paramMap.has('id_manifesto')) {
      this.filtroRelatorio.id_manifesto = +this._route.snapshot.paramMap.get('id_manifesto');
      // console.log(this._route.snapshot.paramMap.get('id_residuo'));
    }

    if (this._route.snapshot.paramMap.has('manifesto')) {
      this.filtroRelatorio.manifesto = this._route.snapshot.paramMap.get('manifesto');
      // console.log(this._route.snapshot.paramMap.get('cliente'));
    }

    if (this.filtroRelatorio.receita) {
      this._relatorioService.getRelatorioReceita(this._tokenManager.retrieve(), this.filtroRelatorio)
      .subscribe(data => {
        this.receitas = data;

        let id_cliente: number;
        let grupocliente: GrupoCliente;
        // separa os registros agrupando por classe e cliente
        for (let index = 0; index < this.receitas.length; index++) {
          const item = this.receitas[index];

          // se o cliente muda gravamos o grupo atual na lista e iniciamos um novo grupo
          if (id_cliente !== item.id_cliente) {
            if (index > 0) {
              this.grupoclientes.push(grupocliente);
            }
            grupocliente = new GrupoCliente();
            id_cliente = item.id_cliente;
            grupocliente.id_cliente = item.id_cliente;
            grupocliente.cliente = item.cliente;
          }
          grupocliente.receitas.push(item);
        }
        grupocliente.total_geral = this.receitas.reduce((sum, item) => sum + Number(item.valor_total), 0);
        this.grupoclientes.push(grupocliente);

        // this.sumTotalReceitas = 0;

        // this.sumTotalReceitas = this.receitas.reduce((sum, item) => sum + Number(item.valor_total), 0);

        this.emProcessamento = false;
      });
    }


      this._relatorioService.getRelatorioReceitaClasse(this._tokenManager.retrieve(), this.filtroRelatorio)
      .subscribe(data => {
        this.receitas.length = 0;
        this.receitas = data;

        let id_cliente: number;
        let id_classe: number;
        let grupocliente: GrupoCliente;
        let grupoclasse: GrupoClasse;
        // separa os registros agrupando por classe e cliente
        for (let index = 0; index < this.receitas.length; index++) {
          const item = this.receitas[index];

          if (id_classe !== item.id_classe) {
            if (index > 0) {
              grupocliente.total_geral = grupocliente.receitas.reduce((sum, it) => sum + Number(it.valor_total), 0);
              grupoclasse.grupo_clientes.push(grupocliente);
              this.grupoclasses.push(grupoclasse);
              grupocliente = new GrupoCliente();
              grupocliente.id_cliente = item.id_cliente;
              grupocliente.cliente = item.cliente;
            }
            grupoclasse = new GrupoClasse();
            id_classe = item.id_classe;
            grupoclasse.id_classe = item.id_classe;
            grupoclasse.classe = item.classe;
          }

          // se o cliente muda gravamos o grupo atual na lista e iniciamos um novo grupo
          if (id_cliente !== item.id_cliente) {
            if (index > 0) {
              grupoclasse.grupo_clientes.push(grupocliente);
            }
            grupocliente = new GrupoCliente();
            id_cliente = item.id_cliente;
            grupocliente.id_cliente = item.id_cliente;
            grupocliente.cliente = item.cliente;
          }
          grupocliente.receitas.push(item);
        }
        grupocliente.total_geral = grupocliente.receitas.reduce((sum, it) => sum + Number(it.valor_total), 0);
        grupoclasse.grupo_clientes.push(grupocliente);
        grupoclasse.total_geral = this.receitas.reduce((sum, item) => sum + Number(item.valor_total), 0);
        this.grupoclasses.push(grupoclasse);

        this.sumTotalReceitas = 0;

        this.emProcessamento = false;
      });



    // if (this.filtroRelatorio.despesa) {
    //   this._relatorioService.getRelatorioDespesaCliente(this._tokenManager.retrieve(), this.filtroRelatorio)
    //   .subscribe(data => {
    //     this.despesas = data;
    //     this.sumTotalDespesas = 0;

    //     this.sumTotalDespesas = this.despesas.reduce((sum, item) => sum + Number(item.valor_total), 0);

    //     this.emProcessamento = false;
    //   });
    // }
  }

  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {
    // this.vc.first.nativeElement.focus();
    // Promise.resolve(null).then(() => this.focuscomp.nativeElement.focus());
  }

  getCodigoErrorMessage() {
    let mensagem = '';

    if (this.valCodigo.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  btnImprimir_click() {
    window.print();
    // this.emProcessamento = true;
    // this._relatorioService
    //   .getRelatorioRelatorioCliente(this._tokenManager.retrieve(), this.relatorio)
    //   .subscribe(data => {
    //     this.emProcessamento = false;
    //     const fileUrl = URL.createObjectURL(data);
    //     const tab = window.open();
    //     tab.location.href = fileUrl;
    //   },
    //   error => {
    //     this.emProcessamento = false;
    //     const err = new HttpErrorResponse(error);
    //     console.log(err);
    //     this.dialog.error('SGR', 'Erro ao gerar o relatório.', '');
    //   },
    // );
  }

  btnSalvar_click() {
    // this.emProcessamento = true;
    // if (this.validaCampos()) {
    //   if (isNullOrUndefined(this.relatorio.id)) {
    //     this._relatorioService.addRelatorio(
    //       this._tokenManager.retrieve(),
    //       this.relatorio).subscribe(
    //         data => {
    //           this.emProcessamento = false;
    //           this.relatorio = data;
    //           this.exibeIncluir = true;
    //           this.dialog.success('SGR', 'Relatorio salvo com sucesso.');
    //         },
    //         error => {
    //           this.emProcessamento = false;
    //           this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
    //         },
    //       );
    //   } else {
    //     this._relatorioService.editRelatorio(
    //       this._tokenManager.retrieve(),
    //       this.relatorio.id,
    //       this.relatorio).subscribe(
    //       data => {
    //       this.emProcessamento = false;
    //       this.relatorio = data;
    //       this.exibeIncluir = true;
    //       this.dialog.success('SGR', 'Relatorio salvo com sucesso.');
    //     },
    //     error => {
    //       this.emProcessamento = false;
    //       this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
    //     },
    //   );
    //   }
    // } else {
    //   this.emProcessamento = false;
    //   this.dialog.warning('SGR', 'Campos obrigatórios não preenchidos');
    // }
  }

  btnIncluir_click() {
    // this.relatorio = new Relatorio();
  }

  getDescricaoErrorMessage() {
    let mensagem = '';

    if (this.valDescricao.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  validaSaida(event: string) {
    // if (event === '') {
    //   this.relatorio.id_cliente = null;
    //   this.relatorio.cliente = '';
    // }
  }

  validaSaidaManifesto(event: string) {
    // if (event === '') {
    //   this.relatorio.id_manifesto = null;
    //   this.relatorio.manifesto = '';
    // }
  }

  buscaCliente(event: any) {
    // let cliente: Cliente;
    // if (event.id) {
    //   this._clienteService
    //     .getCliente(this._tokenManager.retrieve(), Number(event.id))
    //     .subscribe(
    //       data => {
    //         cliente = JSON.parse(data._body);
    //         this.relatorio.id_cliente = cliente.id;
    //         this.relatorio.cliente = cliente.razao_social;
    //       },
    //       (err: HttpErrorResponse) => {
    //         this.relatorio.id_cliente = null;
    //         this.relatorio.cliente = '';
    //       }
    //     );
    // }
  }

  buscaManifesto(event: any) {
    // let manifesto: Manifesto;
    // if (event.id) {
    //   this._manifestoService
    //     .getManifesto(this._tokenManager.retrieve(), Number(event.id))
    //     .subscribe(
    //       data => {
    //         manifesto = JSON.parse(data._body);
    //         this.relatorio.id_manifesto = manifesto.id;
    //         this.relatorio.manifesto = manifesto.descricao;
    //       },
    //       (err: HttpErrorResponse) => {
    //         this.relatorio.id_manifesto = null;
    //         this.relatorio.manifesto = '';
    //       }
    //     );
    // }
  }

  openPesquisa(): void {
    // const dialogLoginRef = this.pesquisa.open(ClienteFindComponent, {
    //   width: '600px',
    //   height: '400px',
    //   disableClose: true,
    //   data: {
    //     id: null,
    //     razao_social: null
    //   }
    // });

    // dialogLoginRef.afterClosed().subscribe(result => {
    //   if (result.id != null && result.id !== undefined) {
    //     this.relatorio.id_cliente = result.id;
    //     this.relatorio.cliente = result.razao_social;
    //   }
    // });
  }

  openPesquisaManifesto(): void {
    // const dialogLoginRef = this.pesquisa.open(ManifestoFindComponent, {
    //   width: '600px',
    //   height: '400px',
    //   disableClose: true,
    //   data: {
    //     id: null,
    //     descricao: null
    //   }
    // });

    // dialogLoginRef.afterClosed().subscribe(result => {
    //   if (result.id != null && result.id !== undefined) {
    //     this.relatorio.id_manifesto = result.id;
    //     this.relatorio.manifesto = result.descricao;
    //   }
    // });
  }

  exportarPDF() {

    this.emProcessamento = true;
    this._relatorioService
      .getPrintPdf2(this._tokenManager.retrieve(), this.filtroRelatorio)
      .subscribe(data => {
        this.emProcessamento = false;
        FileSaver.saveAs(data, 'relatorio.pdf');
        // const fileUrl = URL.createObjectURL(data);
        // const tab = window.open();
        // tab.location.href = fileUrl;
      },
      error => {
        this.emProcessamento = false;
        const err = new HttpErrorResponse(error);
        console.log(err);
        this.dialog.error('SGR', 'Erro ao gerar o relatório.', '');
      },
    );

    // const pdf = new jsPDF('l', 'mm', 'a4');
    // const options = {
    //   pagesplit: false
    // };
    // pdf.addHTML(this.el.nativeElement, 10, 10, options, () => {
    //   pdf.save('relatorio.pdf');
    // });
  }

  // exportarPDF() {

  //   this.emProcessamento = true;
  //   this._relatorioService
  //     .getPrintPdf(this._tokenManager.retrieve(), this.el.nativeElement.innerHTML)
  //     .subscribe(data => {
  //       this.emProcessamento = false;
  //       FileSaver.saveAs(data, 'relatorio.pdf');
  //       // const fileUrl = URL.createObjectURL(data);
  //       // const tab = window.open();
  //       // tab.location.href = fileUrl;
  //     },
  //     error => {
  //       this.emProcessamento = false;
  //       const err = new HttpErrorResponse(error);
  //       console.log(err);
  //       this.dialog.error('SGR', 'Erro ao gerar o relatório.', '');
  //     },
  //   );

  //   // const pdf = new jsPDF('l', 'mm', 'a4');
  //   // const options = {
  //   //   pagesplit: false
  //   // };
  //   // pdf.addHTML(this.el.nativeElement, 10, 10, options, () => {
  //   //   pdf.save('relatorio.pdf');
  //   // });
  // }
  zerasomareceita() {
    this.sumTotalReceitas = 0;
  }
  somareceita(valor: number) {
    this.sumTotalReceitas = Number(this.sumTotalReceitas) + Number(valor);
  }

  getTotalReceita(): number {
    return this.sumTotalReceitas;
  }
}
