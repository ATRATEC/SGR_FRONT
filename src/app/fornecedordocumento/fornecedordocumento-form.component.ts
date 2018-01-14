import { environment } from './../../environments/environment';
import { Moment } from 'moment/moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material/material-moment-adapter';
import { FornecedorFindComponent } from './../fornecedor/fornecedor-find.component';
import { HttpErrorResponse } from '@angular/common/http';
import { FornecedorService } from './../fornecedor/fornecedor.service';
import { TipoDocumentoService } from './../tipodocumento/tipodocumento.service';
import { TipoDocumento } from './../tipodocumento/tipodocumento';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { FornecedorDocumentoService } from './fornecedordocumento.service';
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
import { FornecedorDocumento } from './fornecedordocumento';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { Fornecedor } from '../fornecedor/fornecedor';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';

@Component({
  selector: 'app-fornecedordocumento-form',
  templateUrl: './fornecedordocumento-form.component.html',
  styleUrls: ['./fornecedordocumento-form.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class FornecedorDocumentoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  fornecedordocumento: FornecedorDocumento;
  emProcessamento = false;
  modelLoaded = false;
  exibeIncluir = false;
  tipodocumentos: TipoDocumento[];
  tipodocumentos2: TipoDocumento[];
  linkDownload = environment.urlbase + '/api/documentos/downloadanexo?arquivo=';

  valCodigo = new FormControl('', [Validators.required]);
  valTipoDocumento = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('fileInput') fileInput;


  constructor(private _fornecedordocumentoService: FornecedorDocumentoService,
    private _fornecedorService: FornecedorService,
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
    this.fornecedordocumento = new FornecedorDocumento();

    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._fornecedordocumentoService.getFornecedorDocumento(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          this.fornecedordocumento = JSON.parse(data._body);
          if (this.fornecedordocumento.caminho) {
            this.linkDownload = this.linkDownload + 'FOR_' +
                              this.fornecedordocumento.id_fornecedor + '_DOC_' +
                              this.fornecedordocumento.id + '_' +
                              this.fornecedordocumento.caminho;
          }
          this.emProcessamento = false;
          this.modelLoaded = true;
          // const tp = new TipoDocumento(this.fornecedordocumento.id_tipo_documento, this.fornecedordocumento.descricao);

          this.valTipoDocumento.setValue(this.fornecedordocumento.id_tipo_documento);
          // console.log('objeto: ' + this.fornecedordocumento.id_tipo_documento.toString());
        });
      } else {
        this.emProcessamento = false;
      }
    });

    const idFilter$ = this.valCodigo.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    Observable.combineLatest(idFilter$).debounceTime(500).distinctUntilChanged().
    map(
      ([id]) => ({id})).subscribe(filter => {
        this.buscaFornecedor(filter);
      });

    this._tipoDocumentoService.getListTipoDocumentos(this._tokenManager.retrieve())
        .subscribe(dt => {
          this.tipodocumentos = JSON.parse(dt._body);
          // if ((this.tipodocumentos.length > 0) && (!isNullOrUndefined(this.fornecedordocumento.id_tipo_documento))) {
          //   const index = this.tipodocumentos.findIndex(d => d.id === this.fornecedordocumento.id_tipo_documento);
          //   this.tipodocumentos.splice(index, 1);
          // }
    });
  }

  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {
    // this.vc.first.nativeElement.focus();
    // Promise.resolve(null).then(() => this.focuscomp.nativeElement.focus());
    // for (let index = 0; index < this.tipodocumentos2.length; index++) {
    //   const element = this.tipodocumentos2[index];
    //   this.tipodocumentos.push(element);
    // }
    // this.tipodocumentos2.forEach(element => {
    //   this.tipodocumentos.push(element);
    // });
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
      if (isNullOrUndefined(this.fornecedordocumento.id)) {
        this._fornecedordocumentoService.addFornecedorDocumento(
          this._tokenManager.retrieve(),
          this.fornecedordocumento
          ).subscribe(
            data => {
              this.emProcessamento = false;
              this.fornecedordocumento = data;
              this.exibeIncluir = true;
              if (fileBrowser.files.length > 0) {
                this.uploadDocumento(this.fornecedordocumento, fileBrowser.files[0]);
              }
              this.dialog.success('SGR', 'Documento salvo com sucesso.');
              this.valTipoDocumento.setValue(this.fornecedordocumento.id_tipo_documento);
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            },
          );
      } else {
        this._fornecedordocumentoService.editFornecedorDocumento(
          this._tokenManager.retrieve(),
          this.fornecedordocumento.id,
          this.fornecedordocumento
          ).subscribe(
          data => {
          this.emProcessamento = false;
          // fileBrowser.files[0]
          this.fornecedordocumento = data;
          if (fileBrowser.files.length > 0) {
            this.uploadDocumento(this.fornecedordocumento, fileBrowser.files[0]);
          }
          this.exibeIncluir = true;
          this.dialog.success('SGR', 'Documento salvo com sucesso.');
          this.valTipoDocumento.setValue(this.fornecedordocumento.id_tipo_documento);
        },
        error => {
          this.emProcessamento = false;
          this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
        },
      );
      }
    } else {
      this.emProcessamento = false;
      this.dialog.warning('SGR', 'Campos obrigatórios não preenchidos');
    }
  }

  uploadDocumento(_fornecedorDocumento: FornecedorDocumento, _file: File) {
    this._fornecedordocumentoService.uploadDocumento(this._tokenManager.retrieve(), _fornecedorDocumento, _file).subscribe(
      data => {
        this.fornecedordocumento.caminho = data.anexo;
        this.linkDownload = this.linkDownload + 'FOR_' +
                              this.fornecedordocumento.id_fornecedor + '_DOC_' +
                              this.fornecedordocumento.id + '_' +
                              this.fornecedordocumento.caminho;
        // console.log('upload ok ' + data.anexo);
      },
      error => {
        console.log('falha no upload ' + error);
      },
    );
  }

  btnIncluir_click() {
    this.fornecedordocumento = new FornecedorDocumento();
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

  validaSaida(event: string) {
    console.log(event);
    if (event === '') {
      this.fornecedordocumento.id_fornecedor = null;
      this.fornecedordocumento.razao_social = '';
    }
  }

  buscaFornecedor(event: any) {
    let fornecedor: Fornecedor;
    if (event.id) {
      this._fornecedorService.getFornecedor(this._tokenManager.retrieve(), Number(event.id))
      .subscribe( data => {
        fornecedor = JSON.parse(data._body);
        this.fornecedordocumento.id_fornecedor = fornecedor.id;
        this.fornecedordocumento.razao_social = fornecedor.razao_social;
      },
      (err: HttpErrorResponse) => {
        this.fornecedordocumento.id_fornecedor = null;
        this.fornecedordocumento.razao_social = '';
      });
    }
  }

  openPesquisa(): void {
    const dialogLoginRef = this.pesquisa.open(FornecedorFindComponent, {
      width: '600px',
      height: '400px',
      disableClose: true,
      data: { id: null,
              razao_social: null
            }
    });

    dialogLoginRef.afterClosed().subscribe(result => {
      if ((result.id != null) && (result.id !== undefined)) {
        this.fornecedordocumento.id_fornecedor = result.id;
        this.fornecedordocumento.razao_social = result.razao_social;
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
    this.fornecedordocumento.vencimento = new Date(event.toISOString());
  }

}
