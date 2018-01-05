import { Moment } from 'moment/moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material/material-moment-adapter';
import { ClienteFindComponent } from './../cliente/cliente-find.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ClienteService } from './../cliente/cliente.service';
import { TipoDocumentoService } from './../tipodocumento/tipodocumento.service';
import { TipoDocumento } from './../tipodocumento/tipodocumento';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { ClienteDocumentoService } from './clientedocumento.service';
import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { by } from 'protractor';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { ChangeDetectorRef, ViewChildren, ViewChild, ElementRef } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { ClienteDocumento } from './clientedocumento';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { Cliente } from '../cliente/cliente';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';

@Component({
  selector: 'app-clientedocumento-form',
  templateUrl: './clientedocumento-form.component.html',
  styleUrls: ['./clientedocumento-form.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class ClienteDocumentoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  clientedocumento: ClienteDocumento;
  emProcessamento = false;
  exibeIncluir = false;
  tipodocumentos: TipoDocumento[];

  valCodigo = new FormControl('', [Validators.required]);
  valTipoDocumento = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('fileInput') fileInput;


  constructor(private _clientedocumentoService: ClienteDocumentoService,
    private _clienteService: ClienteService,
    private _tipoDocumentoService: TipoDocumentoService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService,
    private pesquisa: MatDialog) {}

  validaCampos() {
    return (
      this.valCodigo.valid
    );
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.clientedocumento = new ClienteDocumento();
    this._tipoDocumentoService.getListTipoDocumentos(this._tokenManager.retrieve())
                                                .subscribe(data => {
                                                   this.tipodocumentos = JSON.parse(data._body);
                                                 });
    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._clientedocumentoService.getClienteDocumento(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          this.clientedocumento = JSON.parse(data._body);
          this.emProcessamento = false;
        });
      } else {
        this.emProcessamento = false;
      }
    });

    const idFilter$ = this.valCodigo.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    Observable.combineLatest(idFilter$).debounceTime(500).distinctUntilChanged().
    map(
      ([id]) => ({id})).subscribe(filter => {
        if ((!isNullOrUndefined(filter.id) && (filter.id !== ''))) {
          this.buscaCliente(filter);
        } else {
          this.clientedocumento.id_cliente = null;
          this.clientedocumento.razao_social = '';
        }
      });

  }

  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {
    // this.vc.first.nativeElement.focus();
    // Promise.resolve(null).then(() => this.focuscomp.nativeElement.focus());
  }

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
  }

  btnSalvar_click() {
    this.emProcessamento = true;
    const fileBrowser = this.fileInput.nativeElement;
    if (this.validaCampos()) {
      if (isNullOrUndefined(this.clientedocumento.id)) {
        this._clientedocumentoService.addClienteDocumento(
          this._tokenManager.retrieve(),
          this.clientedocumento
          ).subscribe(
            data => {
              this.emProcessamento = false;
              this.clientedocumento = data;
              this.exibeIncluir = true;
              this.dialog.success('SGR', 'Documento salvo com sucesso.');
              this.uploadDocumento(this.clientedocumento, fileBrowser.files[0]);
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro. msg: ' + error.error);
            },
          );
      } else {
        this._clientedocumentoService.editClienteDocumento(
          this._tokenManager.retrieve(),
          this.clientedocumento.id,
          this.clientedocumento
          ).subscribe(
          data => {
          this.emProcessamento = false;
          // fileBrowser.files[0]
          this.uploadDocumento(this.clientedocumento, fileBrowser.files[0]);
          this.clientedocumento = data;
          this.exibeIncluir = true;
          this.dialog.success('SGR', 'Documento salvo com sucesso.');
        },
        error => {
          this.emProcessamento = false;
          this.dialog.error('SGR', 'Erro ao salvar o registro. msg: ' + error.error);
        },
      );
      }
    } else {
      this.emProcessamento = false;
      this.dialog.warning('SGR', 'Campos obrigatórios não preenchidos');
    }
  }

  uploadDocumento(_clienteDocumento: ClienteDocumento, _file: File) {
    this._clientedocumentoService.uploadDocumento(this._tokenManager.retrieve(), _clienteDocumento, _file).subscribe(
      data => {
        this.clientedocumento.caminho = data.anexo;
        // console.log('upload ok ' + data.anexo);
      },
      error => {
        console.log('falha no upload ' + error);
      },
    );
  }

  btnIncluir_click() {
    this.clientedocumento = new ClienteDocumento();
  }

  getCodigoErrorMessage() {
    let mensagem = '';

    if (this.valCodigo.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  getTipoDocumentoErrorMessage() {
    let mensagem = '';

    if (this.valTipoDocumento.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  buscaCliente(event: any) {
    let cliente: Cliente;
    // this.clientedocumento.id_cliente = null;
    // this.clientedocumento.razao_social = '';
    this._clienteService.getCliente(this._tokenManager.retrieve(), Number(event.id))
    .subscribe( data => {
      cliente = JSON.parse(data._body);
      this.clientedocumento.id_cliente = cliente.id;
      this.clientedocumento.razao_social = cliente.razao_social;
    },
    (err: HttpErrorResponse) => {
      this.clientedocumento.id_cliente = null;
      this.clientedocumento.razao_social = '';
    });
    // console.log('mudou estado ' + event.value);
  }

  openPesquisa(): void {
    const dialogLoginRef = this.pesquisa.open(ClienteFindComponent, {
      width: '600px',
      height: '400px',
      disableClose: true,
      data: { id: null,
              razao_social: null
            }
    });

    dialogLoginRef.afterClosed().subscribe(result => {
      if ((result.id != null) && (result.id !== undefined)) {
        this.clientedocumento.id_cliente = result.id;
        this.clientedocumento.razao_social = result.razao_social;
      }
      // console.log('The dialog was closed');
      // alert('sua mensagem de retorno foi' + result.retorno );
      // console.log(result.retorno);
      // if ((result.Usuario != null) || (result.Usuario !== undefined)) {
      //   this.Usuario = result.Usuario;
      //   this.Logado = result.logado;
      //   this.tokenManager.store(result.token);
      //   localStorage.setItem('currentUser', JSON.stringify(this.Usuario));
      //   localStorage.setItem('Logado', JSON.stringify({Logado: this.Logado}));
      // }
    });
  }

  setDate(event: Moment) {
    this.clientedocumento.vencimento = new Date(event.toISOString());
  }

}
