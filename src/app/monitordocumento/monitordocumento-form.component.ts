import { FornecedorDocumento } from './../fornecedor/fornecedordocumento';
import { ClienteDocumento } from './../cliente/clientedocumento';
import { environment } from './../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { Component, OnInit, AfterViewInit, AfterViewChecked, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
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
import { FormBuilder, FormGroup} from '@angular/forms';
import { MonitorDocumentoService } from './monitordocumento.service';


@Component({
  selector: 'app-monitordocumento-form',
  templateUrl: './monitordocumento-form.component.html',
  styleUrls: ['./monitordocumento-form.component.css']
})
export class MonitorDocumentoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  clientedocumentos7: ClienteDocumento[];
  clientedocumentos15: ClienteDocumento[];
  clientedocumentos30: ClienteDocumento[];
  clientedocumentos60: ClienteDocumento[];
  clientedocumentos90: ClienteDocumento[];

  fornecedordocumentos7: FornecedorDocumento[];
  fornecedordocumentos15: FornecedorDocumento[];
  fornecedordocumentos30: FornecedorDocumento[];
  fornecedordocumentos60: FornecedorDocumento[];
  fornecedordocumentos90: FornecedorDocumento[];

  panelOpenState = false;


  emProcessamento = false;
  exibeIncluir = false;

  valCodigo = new FormControl();
  valManifesto = new FormControl();
  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;

  constructor(private _monitordocumentoService: MonitorDocumentoService,
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

    this.clientedocumentos7 = new Array<ClienteDocumento>();
    this.clientedocumentos15 = new Array<ClienteDocumento>();
    this.clientedocumentos30 = new Array<ClienteDocumento>();
    this.clientedocumentos60 = new Array<ClienteDocumento>();
    this.clientedocumentos90 = new Array<ClienteDocumento>();

    this.fornecedordocumentos7 = new Array<FornecedorDocumento>();
    this.fornecedordocumentos15 = new Array<FornecedorDocumento>();
    this.fornecedordocumentos30 = new Array<FornecedorDocumento>();
    this.fornecedordocumentos60 = new Array<FornecedorDocumento>();
    this.fornecedordocumentos90 = new Array<FornecedorDocumento>();


    this._monitordocumentoService.getDocumentoClientes(this._tokenManager.retrieve(), 7)
      .retry(3)
      .subscribe(data => {
        this.clientedocumentos7 = JSON.parse(data._body);
      });

    this._monitordocumentoService.getDocumentoClientes(this._tokenManager.retrieve(), 15)
      .retry(3)
      .subscribe(data => {
        this.clientedocumentos15 = JSON.parse(data._body);
    });

    this._monitordocumentoService.getDocumentoClientes(this._tokenManager.retrieve(), 30)
      .retry(3)
      .subscribe(data => {
        this.clientedocumentos30 = JSON.parse(data._body);
    });

    this._monitordocumentoService.getDocumentoClientes(this._tokenManager.retrieve(), 60)
      .retry(3)
      .subscribe(data => {
        this.clientedocumentos60 = JSON.parse(data._body);
    });

    this._monitordocumentoService.getDocumentoClientes(this._tokenManager.retrieve(), 90)
      .retry(3)
      .subscribe(data => {
        this.clientedocumentos90 = JSON.parse(data._body);
        this.emProcessamento = false;
    });

    this._monitordocumentoService.getDocumentoFornecedores(this._tokenManager.retrieve(), 7)
      .retry(3)
      .subscribe(data => {
        this.fornecedordocumentos7 = JSON.parse(data._body);
      });

    this._monitordocumentoService.getDocumentoFornecedores(this._tokenManager.retrieve(), 15)
      .retry(3)
      .subscribe(data => {
        this.fornecedordocumentos15 = JSON.parse(data._body);
    });

    this._monitordocumentoService.getDocumentoFornecedores(this._tokenManager.retrieve(), 30)
      .retry(3)
      .subscribe(data => {
        this.fornecedordocumentos30 = JSON.parse(data._body);
    });

    this._monitordocumentoService.getDocumentoFornecedores(this._tokenManager.retrieve(), 60)
      .retry(3)
      .subscribe(data => {
        this.fornecedordocumentos60 = JSON.parse(data._body);
    });

    this._monitordocumentoService.getDocumentoFornecedores(this._tokenManager.retrieve(), 90)
      .retry(3)
      .subscribe(data => {
        this.fornecedordocumentos90 = JSON.parse(data._body);
        this.emProcessamento = false;
    });


    // this.emProcessamento = true;
    // this.relatorio = new Relatorio();
    // const ta = this._tipoatividadeService.getListTipoAtividades(this._tokenManager.retrieve())
    //   .retry(3)
    //   .subscribe(
    //     data => {
    //       this.tipoatividades = JSON.parse(data._body);
    //       // console.log(2);
    //       this._route.params.forEach((params: Params) => {
    //         const id: number = +params['id'];
    //         if (id) {
    //           this._relatorioService.getRelatorio(this._tokenManager.retrieve(), id)
    //           .retry(3)
    //           .subscribe( dt => {
    //             this.relatorio = JSON.parse(dt._body);
    //             // console.log(1);
    //             this.emProcessamento = false;
    //           });
    //         } else {
    //           this.emProcessamento = false;
    //         }
    //       });
    //     },
    //     error => {
    //       this.emProcessamento = false;
    //       this.dialog.error('SGR', 'Erro ao carregar o registro.', error.error + ' - Detalhe: ' + error.message);
    //     }
    //   );
    // const idFilter$ = this.valCodigo.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    // Observable.combineLatest(idFilter$).debounceTime(500).distinctUntilChanged().map(([id]) => ({ id })).subscribe(filter => {
        // this.buscaCliente(filter);
      // });

    // const idManifesto$ = this.valManifesto.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    // Observable.combineLatest(idManifesto$).debounceTime(500).distinctUntilChanged().map(([id]) => ({ id })).subscribe(filter => {
        // this.buscaManifesto(filter);
      // });

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
      // .getRelatorioReceita(this._tokenManager.retrieve(), this.relatorio)
      // .subscribe(data => {
        // this.emProcessamento = false;
        // const fileUrl = URL.createObjectURL(data);
        // const tab = window.open();
        // tab.location.href = fileUrl;
      // },
      // error => {
        // this.emProcessamento = false;
        // const err = new HttpErrorResponse(error);
        // console.log(err);
        // this.dialog.error('SGR', 'Erro ao gerar o relatório.', '');
      // },
    // );
  }

  btnSalvar_click() {
    // this.emProcessamento = true;
    // if (this.validaCampos()) {
      // if (isNullOrUndefined(this.relatorio.id)) {
        // this._relatorioService.addRelatorio(
          // this._tokenManager.retrieve(),
          // this.relatorio).subscribe(
            // data => {
              // this.emProcessamento = false;
              // this.relatorio = data;
              // this.exibeIncluir = true;
              // this.dialog.success('SGR', 'Relatorio salvo com sucesso.');
            // },
            // error => {
              // this.emProcessamento = false;
              // this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            // },
          // );
      // } else {
        // this._relatorioService.editRelatorio(
          // this._tokenManager.retrieve(),
          // this.relatorio.id,
          // this.relatorio).subscribe(
          // data => {
          // this.emProcessamento = false;
          // this.relatorio = data;
          // this.exibeIncluir = true;
          // this.dialog.success('SGR', 'Relatorio salvo com sucesso.');
        // },
        // error => {
          // this.emProcessamento = false;
          // this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
        // },
      // );
      // }
    // } else {
      // this.emProcessamento = false;
      // this.dialog.warning('SGR', 'Campos obrigatórios não preenchidos');
    // }
  }

  btnIncluir_click() {
    // this.relatorio = new Relatorio();
  }

  getDescricaoErrorMessage() {
    // let mensagem = '';

    // if (this.valDescricao.hasError('required')) {
      // mensagem = mensagem + 'Campo obrigatório.';
    // }
    // return mensagem;
  }

  validaSaida(event: string) {
    // if (event === '') {
      // this.relatorio.id_cliente = null;
      // this.relatorio.cliente = '';
    // }
  }

  validaSaidaManifesto(event: string) {
    // if (event === '') {
      // this.relatorio.id_manifesto = null;
      // this.relatorio.manifesto = '';
    // }
  }

  buscaCliente(event: any) {
    // let cliente: Cliente;
    // if (event.id) {
      // this._clienteService
        // .getCliente(this._tokenManager.retrieve(), Number(event.id))
        // .subscribe(
          // data => {
            // cliente = JSON.parse(data._body);
            // this.relatorio.id_cliente = cliente.id;
            // this.relatorio.cliente = cliente.razao_social;
          // },
          // (err: HttpErrorResponse) => {
            // this.relatorio.id_cliente = null;
            // this.relatorio.cliente = '';
          // }
        // );
    // }
  }

  buscaManifesto(event: any) {
    // let manifesto: Manifesto;
    // if (event.id) {
      // this._manifestoService
        // .getManifesto(this._tokenManager.retrieve(), Number(event.id))
        // .subscribe(
          // data => {
            // manifesto = JSON.parse(data._body);
            // this.relatorio.id_manifesto = manifesto.id;
            // this.relatorio.manifesto = manifesto.descricao;
          // },
          // (err: HttpErrorResponse) => {
            // this.relatorio.id_manifesto = null;
            // this.relatorio.manifesto = '';
          // }
        // );
    // }
  }

  openPesquisa(): void {
    // const dialogLoginRef = this.pesquisa.open(ClienteFindComponent, {
      // width: '600px',
      // height: '400px',
      // disableClose: true,
      // data: {
        // id: null,
        // razao_social: null
      // }
    // });

    // dialogLoginRef.afterClosed().subscribe(result => {
      // if (result.id != null && result.id !== undefined) {
        // this.relatorio.id_cliente = result.id;
        // this.relatorio.cliente = result.razao_social;
      // }
    // });
  }

  openPesquisaManifesto(): void {
    // const dialogLoginRef = this.pesquisa.open(ManifestoFindComponent, {
      // width: '600px',
      // height: '400px',
      // disableClose: true,
      // data: {
        // id: null,
        // descricao: null
      // }
    // });

    // dialogLoginRef.afterClosed().subscribe(result => {
      // if (result.id != null && result.id !== undefined) {
        // this.relatorio.id_manifesto = result.id;
        // this.relatorio.manifesto = result.descricao;
      // }
    // });
  }

}
