import { ClienteFindComponent } from './../cliente/cliente-find.component';
import { ClienteService } from './../cliente/cliente.service';
import { ContratoFornecedorServicoService } from './contratofornecedorservico.service';
import { ServicoService } from './../servico/servico.service';
import { ContratoFornecedorServico } from './contratofornecedorservico';
import { environment } from './../../environments/environment';
import { Moment } from 'moment/moment';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_FORMATS
} from '@angular/material/material-moment-adapter';
import { FornecedorFindComponent } from './../fornecedor/fornecedor-find.component';
import { HttpErrorResponse } from '@angular/common/http';
import { FornecedorService } from './../fornecedor/fornecedor.service';
import { TipoDocumentoService } from './../tipodocumento/tipodocumento.service';
import { TipoDocumento } from './../tipodocumento/tipodocumento';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { ContratoFornecedorService } from './contratofornecedor.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked
} from '@angular/core';
import { Router } from '@angular/router';
import { by, element } from 'protractor';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import {
  ChangeDetectorRef,
  ViewChildren,
  ViewChild,
  ElementRef
} from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { ContratoFornecedor } from './contratofornecedor';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Fornecedor } from '../fornecedor/fornecedor';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS
} from '@angular/material';
import { Servico } from '../servico/servico';
import { Cliente } from '../cliente/cliente';

@Component({
  selector: 'app-contratofornecedor-form',
  templateUrl: './contratofornecedor-form.component.html',
  styleUrls: ['./contratofornecedor-form.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class ContratoFornecedorFormComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  contratofornecedor: ContratoFornecedor;
  contratofornecedorservicos: ContratoFornecedorServico[];
  emProcessamento = false;
  modelLoaded = false;
  exibeIncluir = false;
  tipodocumentos: TipoDocumento[];
  tipodocumentos2: TipoDocumento[];
  linkDownload = environment.urlbase + '/api/documentos/downloadanexo?arquivo=';
  trocacor = false;

  valCodigo = new FormControl('', [Validators.required]);
  valCodigoCli = new FormControl();
  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('fileInput') fileInput;

  constructor(
    private _contratofornecedorService: ContratoFornecedorService,
    private _contratofornecedorservicoService: ContratoFornecedorServicoService,
    private _fornecedorService: FornecedorService,
    private _clienteService: ClienteService,
    private _servicoService: ServicoService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService,
    private pesquisa: MatDialog
  ) {}

  validaCampos() {
    return this.valCodigo.valid;
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.contratofornecedor = new ContratoFornecedor();
    this.contratofornecedorservicos = new Array<ContratoFornecedorServico>();
    // this.contratofornecedorservicos.push(new ContratoFornecedorServico(1, 1, 1, 1, 56.87, true, '', '', 'TRANSPORTE'));
    // this.contratofornecedorservicos.push(new ContratoFornecedorServico(1, 1, 1, 1, 123.47, true, '', '', 'RECEPÇÃO'));

    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._contratofornecedorService
          .getContratoFornecedor(this._tokenManager.retrieve(), id)
          .subscribe(data => {
            this.contratofornecedor = JSON.parse(data._body);
            // this.linkDownload = this.linkDownload + 'FOR_' +
            //                     this.contratofornecedor.id_fornecedor + '_DOC_' +
            //                     this.contratofornecedor.id + '_' +
            //                     this.contratofornecedor.caminho;
            this.emProcessamento = false;
            // this.modelLoaded = true;
            // const tp = new TipoDocumento(this.contratofornecedor.id_tipo_documento, this.contratofornecedor.descricao);

            // this.valTipoDocumento.setValue(this.contratofornecedor.id_tipo_documento);
            // console.log('objeto: ' + this.contratofornecedor.id_tipo_documento.toString());
          });
        this._contratofornecedorservicoService
          .getContratoFornecedorServico(this._tokenManager.retrieve(), id)
          .subscribe(data => {
            this.contratofornecedorservicos.length = 0;
            this.contratofornecedorservicos = JSON.parse(data._body);
          });
      } else {
        this.emProcessamento = false;
      }
    });

    // se a lista de servicos está zerada vamos fazer o setup dela.
    if (this.contratofornecedorservicos.length <= 0) {
      this._servicoService
        .getListServicos(this._tokenManager.retrieve())
        .subscribe(data => {
          let servicos: Servico[];
          servicos = JSON.parse(data._body);
          if (this.contratofornecedorservicos.length === 0) {
            for (let index = 0; index < servicos.length; index++) {
              const servico = servicos[index];
              this.contratofornecedorservicos.push(
                new ContratoFornecedorServico(
                  null,
                  null,
                  null,
                  servico.id,
                  null,
                  false,
                  '',
                  '',
                  servico.descricao
                )
              );
            }
          }
        });
    }

    const idFilter$ = this.valCodigo.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .startWith('');
    Observable.combineLatest(idFilter$)
      .debounceTime(500)
      .distinctUntilChanged()
      .map(([id]) => ({ id }))
      .subscribe(filter => {
        this.buscaFornecedor(filter);
      });

      const idFilterCli$ = this.valCodigoCli.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .startWith('');
    Observable.combineLatest(idFilterCli$)
      .debounceTime(500)
      .distinctUntilChanged()
      .map(([id]) => ({ id }))
      .subscribe(filter => {
        this.buscaCliente(filter);
      });

    // this._tipoDocumentoService.getListTipoDocumentos(this._tokenManager.retrieve())
    //     .subscribe(dt => {
    //       this.tipodocumentos = JSON.parse(dt._body);
    //       // if ((this.tipodocumentos.length > 0) && (!isNullOrUndefined(this.contratofornecedor.id_tipo_documento))) {
    //       //   const index = this.tipodocumentos.findIndex(d => d.id === this.contratofornecedor.id_tipo_documento);
    //       //   this.tipodocumentos.splice(index, 1);
    //       // }
    // });
  }

  ngAfterViewChecked(): void {}

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
    if (this.validaCampos()) {
      if (!this.contratofornecedor.exclusico) {
        this.contratofornecedor.id_cliente = null;
        this.contratofornecedor.cliente = '';
        this.contratofornecedor.exclusico = false;
      }
      if (isNullOrUndefined(this.contratofornecedor.id)) {
        this._contratofornecedorService.addContratoFornecedor(this._tokenManager.retrieve(), this.contratofornecedor)
          .subscribe( data => {
              this.contratofornecedor = data;
              // Salvando lista de serviços
              for (let index = 0; index < this.contratofornecedorservicos.length; index++) {
                if (this.contratofornecedorservicos[index].selecionado) {
                  this.contratofornecedorservicos[
                    index
                  ].id_contrato = this.contratofornecedor.id;
                  this.contratofornecedorservicos[
                    index
                  ].id_fornecedor = this.contratofornecedor.id_fornecedor;
                }
              }

              this._contratofornecedorservicoService.addContratoFornecedorServico(this._tokenManager.retrieve(),
                this.contratofornecedor.id, this.contratofornecedorservicos)
                .subscribe( ctrfsrv => {
                  this.contratofornecedorservicos.length = 0;
                  this.contratofornecedorservicos = ctrfsrv;
                  this.emProcessamento = false;
                  this.exibeIncluir = true;
                  this.dialog.success('SGR', 'Documento salvo com sucesso.');
                },
                error => {
                  this.emProcessamento = false;
                  this.dialog.error('SGR', 'Erro ao salvar lista de serviços.', error.error + ' - Detalhe: ' + error.message);
                }
              );
              // if (fileBrowser.files.length > 0) {
              //   this.uploadDocumento(this.contratofornecedor, fileBrowser.files[0]);
              // }
              // this.exibeIncluir = true;
              // this.dialog.success('SGR', 'Documento salvo com sucesso.');
              // this.valTipoDocumento.setValue(this.contratofornecedor.id_tipo_documento);
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            }
          );
      } else {
        this._contratofornecedorService
          .editContratoFornecedor(
            this._tokenManager.retrieve(),
            this.contratofornecedor.id,
            this.contratofornecedor
          )
          .subscribe(
            data => {
              // this.emProcessamento = false;
              // fileBrowser.files[0]
              this.contratofornecedor = data;
              for (let index = 0; index < this.contratofornecedorservicos.length; index++) {
                if (this.contratofornecedorservicos[index].selecionado) {
                  this.contratofornecedorservicos[
                    index
                  ].id_contrato = this.contratofornecedor.id;
                  this.contratofornecedorservicos[
                    index
                  ].id_fornecedor = this.contratofornecedor.id_fornecedor;
                }
              }
              this._contratofornecedorservicoService.addContratoFornecedorServico(this._tokenManager.retrieve(),
                this.contratofornecedor.id, this.contratofornecedorservicos)
                .subscribe( ctrfsrv => {
                  this.contratofornecedorservicos.length = 0;
                  this.contratofornecedorservicos = ctrfsrv;
                  this.emProcessamento = false;
                  this.exibeIncluir = true;
                  this.dialog.success('SGR', 'Documento salvo com sucesso.');
                },
                error => {
                  this.emProcessamento = false;
                  this.dialog.error('SGR', 'Erro ao salvar lista de serviços.', error.error + ' - Detalhe: ' + error.message);
                }
              );
              // if (fileBrowser.files.length > 0) {
              //   this.uploadDocumento(this.contratofornecedor, fileBrowser.files[0]);
              // }
              // this.exibeIncluir = true;
              // this.dialog.success('SGR', 'Documento salvo com sucesso.');
              // this.valTipoDocumento.setValue(this.contratofornecedor.id_tipo_documento);
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error(
                'SGR',
                'Erro ao salvar o registro.',
                error.error + ' - Detalhe: ' + error.message
              );
            }
          );
      }
    } else {
      this.emProcessamento = false;
      this.dialog.warning('SGR', 'Campos obrigatórios não preenchidos');
    }
  }

  // uploadDocumento(_fornecedorDocumento: ContratoFornecedor, _file: File) {
  //   this._contratofornecedorService.uploadDocumento(this._tokenManager.retrieve(), _fornecedorDocumento, _file).subscribe(
  //     data => {
  //       this.contratofornecedor.caminho = data.anexo;
  //       this.linkDownload = this.linkDownload + 'FOR_' +
  //                             this.contratofornecedor.id_fornecedor + '_DOC_' +
  //                             this.contratofornecedor.id + '_' +
  //                             this.contratofornecedor.caminho;
  //       // console.log('upload ok ' + data.anexo);
  //     },
  //     error => {
  //       console.log('falha no upload ' + error);
  //     },
  //   );
  // }

  btnIncluir_click() {
    this.contratofornecedor = new ContratoFornecedor();
  }

  getCodigoErrorMessage() {
    let mensagem = '';

    if (this.valCodigo.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  getCodigoClienteErrorMessage() {
    let mensagem = '';

    if (this.valCodigoCli.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  getDescricaoErrorMessage() {
    let mensagem = '';

    if (this.valDescricao.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  validaSaida(event: string) {
    console.log(event);
    if (event === '') {
      this.contratofornecedor.id_fornecedor = null;
      this.contratofornecedor.fornecedor = '';
    }
  }

  buscaFornecedor(event: any) {
    let fornecedor: Fornecedor;
    if (event.id) {
      this._fornecedorService
        .getFornecedor(this._tokenManager.retrieve(), Number(event.id))
        .subscribe(
          data => {
            fornecedor = JSON.parse(data._body);
            this.contratofornecedor.id_fornecedor = fornecedor.id;
            this.contratofornecedor.fornecedor = fornecedor.razao_social;
          },
          (err: HttpErrorResponse) => {
            this.contratofornecedor.id_fornecedor = null;
            this.contratofornecedor.fornecedor = '';
          }
        );
    }
  }

  openPesquisa(): void {
    const dialogLoginRef = this.pesquisa.open(FornecedorFindComponent, {
      width: '600px',
      height: '400px',
      disableClose: true,
      data: {
        id: null,
        razao_social: null
      }
    });

    dialogLoginRef.afterClosed().subscribe(result => {
      if (result.id != null && result.id !== undefined) {
        this.contratofornecedor.id_fornecedor = result.id;
        this.contratofornecedor.fornecedor = result.razao_social;
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

  // setDate(event: Date) {
  //   this.contratofornecedor.vigencia_inicio = new Date(event.toLocaleString());
  // }

  // formatadata(data: Date): Date {
  //   const d = data.toString().substring(0, 10);
  //   return new Date(d.toString());
  // }

  validaSaidaCliente(event: string) {
    if (event === '') {
      this.contratofornecedor.id_cliente = null;
      this.contratofornecedor.cliente = '';
    }
  }

  buscaCliente(event: any) {
    let cliente: Cliente;
    // this.clientedocumento.id_cliente = null;
    // this.clientedocumento.razao_social = '';
    if (event.id) {
      this._clienteService.getCliente(this._tokenManager.retrieve(), Number(event.id))
      .subscribe( data => {
        cliente = JSON.parse(data._body);
        this.contratofornecedor.id_cliente = cliente.id;
        this.contratofornecedor.cliente = cliente.razao_social;
      },
      (err: HttpErrorResponse) => {
        this.contratofornecedor.id_cliente = null;
        this.contratofornecedor.cliente = '';
      });
    }
    // console.log('mudou estado ' + event.value);
  }

  openPesquisaCliente(): void {
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
        this.contratofornecedor.id_cliente = result.id;
        this.contratofornecedor.cliente = result.razao_social;
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
}
