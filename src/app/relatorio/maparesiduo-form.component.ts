import { DespesaSintetica } from './despesasintetica';
import { ReceitaSintetica } from './receitasintetica';
import { GrupoFornecedor } from './grupofornecedor';
import { GrupoCliente } from './grupocliente';
import { GrupoClasse } from './grupoclasse';
import { ApLocacao } from './aplocacao';
import { Despesa, DespesaAv, DespesaAvFor } from './despesa';
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
import { ChangeDetectorRef, ViewChildren, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
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
import { MapaResiduo } from './maparesiduo';


@Component({
  selector: 'app-maparesiduo-form',
  templateUrl: './maparesiduo-form.component.html',
  styleUrls: ['./maparesiduo-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MapaResiduoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  // relatorio: Relatorio;
  emProcessamento = false;
  exibeIncluir = false;
  hoje: Date;
  filtroRelatorio: FiltroRelatorio;
  maparesiduos: MapaResiduo[];

  constructor(private _relatorioService: RelatorioService,
    private _clienteService: ClienteService,
    private _manifestoService: ManifestoService,
    private _contratoclienteService: ContratoClienteService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService,
    private pesquisa: MatDialog) {}

  ngOnInit() {
    this.emProcessamento = true;
    this.hoje = new Date();
    this.hoje.setDate(this.hoje.getDate() - 1);
    // this.relatorio = new Relatorio();

    // this._route.data.subscribe(data => {
    //   console.log(data.objeto);
    // });
    this.filtroRelatorio = new FiltroRelatorio();
    this.maparesiduos = new Array<MapaResiduo>();


    // this.receitas.push(new Receita(new Date(Date.now()), '2323', 'AÇO INOX', 'KARDEC', 'KARDEC', 200, 'KG', 2.50, 250));
    //#region Campos filtragem

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

    //#endregion
    this._relatorioService.getRelatorioMapaResiduo(this._tokenManager.retrieve(), this.filtroRelatorio)
        .subscribe(data => {
            this.maparesiduos = data;
            this.emProcessamento = false;
            },
            error => {
              this.emProcessamento = false;
              const err = new HttpErrorResponse(error);
              console.log(err);
              this.dialog.error('SGR', 'Erro ao gerar o relatório.', '');
            }
        );
  }

  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {
    // this.vc.first.nativeElement.focus();
    // Promise.resolve(null).then(() => this.focuscomp.nativeElement.focus());
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

}
