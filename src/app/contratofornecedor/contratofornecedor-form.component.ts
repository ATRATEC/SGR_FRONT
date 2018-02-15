import { DateValidator } from './../datevalidator';
import { ContratoFornecedorResiduoService } from './contratofornecedorresiduo.service';
import { ResiduoService } from './../residuo/residuo.service';
import { ContratoFornecedorResiduo } from './contratofornecedorresiduo';
import { UnidadeService } from './../unidade/unidade.service';
import { Unidade } from './../unidade/unidade';
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
  ElementRef,
  EventEmitter
} from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { FocusDirective } from '../focus/focus.directive';
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
  MAT_DATE_FORMATS,
  FloatPlaceholderType
} from '@angular/material';
import { Servico } from '../servico/servico';
import { Cliente } from '../cliente/cliente';
import {FormBuilder, FormGroup} from '@angular/forms';
import { Residuo } from '../residuo/residuo';

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
  ],
})
export class ContratoFornecedorFormComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  contratofornecedor: ContratoFornecedor;
  contratofornecedorresiduo: ContratoFornecedorResiduo;
  contratofornecedorresiduos: ContratoFornecedorResiduo[];
  residuos: Residuo[];
  servicos: Servico[];
  unidades: Unidade[];
  emProcessamento = false;
  exibeIncluir = false;
  linkDownload = environment.urlbase + '/api/contratos/downloadanexo?arquivo=';
  opt: FloatPlaceholderType;
  trocacor = false;

  valCodigo = new FormControl('', [Validators.required]);
  valVigenciaInicial = new FormControl('', [Validators.required]);
  valVigenciaFinal = new FormControl('', Validators.compose([Validators.required, DateValidator.afterDate(this.valVigenciaInicial)]));
  valCodigoCli = new FormControl();
  valDescricao = new FormControl();

  private inputFocused = new EventEmitter();

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('fileInput') fileInput;

  constructor(
    private _contratofornecedorService: ContratoFornecedorService,
    private _contratofornecedorresiduoService: ContratoFornecedorResiduoService,
    private _fornecedorService: FornecedorService,
    private _clienteService: ClienteService,
    private _servicoService: ServicoService,
    private _residuoService: ResiduoService,
    private _unidadeService: UnidadeService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService,
    private pesquisa: MatDialog
  ) {
    this.opt = 'never';
  }

  validaCampos() {
    return this.valCodigo.valid && this.valVigenciaInicial.valid && this.valVigenciaFinal.valid;
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.contratofornecedor = new ContratoFornecedor();
    this.contratofornecedorresiduo = new ContratoFornecedorResiduo();
    this.contratofornecedorresiduos = new Array<ContratoFornecedorResiduo>();
    this._unidadeService.getListUnidades(this._tokenManager.retrieve()).subscribe(
      data => {
        this.unidades = JSON.parse(data._body);
      }
    );

    this._residuoService.getListResiduos(this._tokenManager.retrieve()).subscribe(
      data => {
        this.residuos = JSON.parse(data._body);
      }
    );

    this._servicoService.getListServicos(this._tokenManager.retrieve()).subscribe(
      data => {
        this.servicos = JSON.parse(data._body);
      }
    );

    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._contratofornecedorService
          .getContratoFornecedor(this._tokenManager.retrieve(), id)
          .subscribe(data => {
            this.contratofornecedor = JSON.parse(data._body);
            if (JSON.parse(data._body).exclusivo === 1) {
              this.contratofornecedor.exclusico = true;
            } else {
              this.contratofornecedor.exclusico = false;
            }

            if (this.contratofornecedor.caminho) {
              this.linkDownload = this.linkDownload + 'FOR_' +
                                this.contratofornecedor.id_fornecedor + '_CTR_' +
                                this.contratofornecedor.id + '_' +
                                this.contratofornecedor.caminho;
            }

            this.emProcessamento = false;
          });
        this._contratofornecedorresiduoService
          .getContratoFornecedorResiduo(this._tokenManager.retrieve(), id)
          .subscribe(data => {
            this.contratofornecedorresiduos.length = 0;
            this.contratofornecedorresiduos = JSON.parse(data._body);
          });
      } else {
        this.emProcessamento = false;
      }
    });

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
  }

  ngAfterViewChecked(): void {}

  ngAfterViewInit(): void {}

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
      if (!this.contratofornecedor.exclusico) {
        this.contratofornecedor.id_cliente = null;
        this.contratofornecedor.cliente = '';
        this.contratofornecedor.exclusico = false;
      }
      if (isNullOrUndefined(this.contratofornecedor.id)) {
        this._contratofornecedorService.addContratoFornecedor(this._tokenManager.retrieve(), this.contratofornecedor)
          .subscribe( data => {
              this.contratofornecedor = data;
              if (data.exclusivo === 1) {
                this.contratofornecedor.exclusico = true;
              } else {
                this.contratofornecedor.exclusico = false;
              }

              for (let index = 0; index < this.contratofornecedorresiduos.length; index++) {
                this.contratofornecedorresiduos[index].id_contrato = this.contratofornecedor.id;
                this.contratofornecedorresiduos[index].id_fornecedor = this.contratofornecedor.id_fornecedor;
              }

              this._contratofornecedorresiduoService.addContratoFornecedorResiduo(this._tokenManager.retrieve(),
              this.contratofornecedor.id, this.contratofornecedorresiduos)
                .subscribe( ctrfres => {
                  this.contratofornecedorresiduos.length = 0;
                  this.contratofornecedorresiduos = ctrfres;
                  this.emProcessamento = false;
                  this.exibeIncluir = true;
                  this.dialog.success('SGR', 'Documento salvo com sucesso.');
                },
                error => {
                  this.emProcessamento = false;
                  this.dialog.error('SGR', 'Erro ao salvar lista de resíduos.', error.error + ' - Detalhe: ' + error.message);
                }
              );
              if (fileBrowser.files.length > 0) {
                this.uploadContrato(this.contratofornecedor, fileBrowser.files[0]);
              }
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            }
          );
      } else {
        this._contratofornecedorService.editContratoFornecedor(
        this._tokenManager.retrieve(), this.contratofornecedor.id, this.contratofornecedor)
          .subscribe(
            data => {
              // this.emProcessamento = false;
              // fileBrowser.files[0]
              this.contratofornecedor = data;
              if (data.exclusivo === 1) {
                this.contratofornecedor.exclusico = true;
              } else {
                this.contratofornecedor.exclusico = false;
              }

              for (let index = 0; index < this.contratofornecedorresiduos.length; index++) {
                this.contratofornecedorresiduos[index].id_contrato = this.contratofornecedor.id;
                this.contratofornecedorresiduos[index].id_fornecedor = this.contratofornecedor.id_fornecedor;
              }

              this._contratofornecedorresiduoService.addContratoFornecedorResiduo(this._tokenManager.retrieve(),
              this.contratofornecedor.id, this.contratofornecedorresiduos)
                .subscribe( ctrfres => {
                  this.contratofornecedorresiduos.length = 0;
                  this.contratofornecedorresiduos = ctrfres;
                  this.emProcessamento = false;
                  this.exibeIncluir = true;
                  this.dialog.success('SGR', 'Documento salvo com sucesso.');
                },
                error => {
                  this.emProcessamento = false;
                  this.dialog.error('SGR', 'Erro ao salvar lista de resíduos.', error.error + ' - Detalhe: ' + error.message);
                }
              );

              if (fileBrowser.files.length > 0) {
                this.uploadContrato(this.contratofornecedor, fileBrowser.files[0]);
              }

            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            }
          );
      }
    } else {
      this.emProcessamento = false;
      let msgDetalhe = '';
      if (this.valCodigo.invalid) {
        if (this.valCodigo.hasError('required')) {
          msgDetalhe = msgDetalhe + 'Campo código do fornecedor não informado.';
          document.getElementById('id_fornecedor').focus();
        }
      }

      if ((this.valVigenciaInicial.invalid) && (msgDetalhe === '')) {
        if (this.valVigenciaInicial.hasError('required')) {
          msgDetalhe = msgDetalhe + 'Campo Data Inicio Vigência não informado.';
          document.getElementById('vigencia_inicio').focus();
        }
      }

      if ((this.valVigenciaFinal.invalid) && (msgDetalhe === '')) {
        if (this.valVigenciaFinal.hasError('required')) {
          msgDetalhe = msgDetalhe + 'Campo Data Final Vigência não informado.';
          document.getElementById('vigencia_final').focus();
        }
      }

      this.dialog.warning('SGR', 'Campos obrigatórios não preenchidos', msgDetalhe);
    }
  }

  uploadContrato(_contratofornecedor: ContratoFornecedor, _file: File) {
    this._contratofornecedorService.uploadContrato(this._tokenManager.retrieve(), _contratofornecedor, _file).subscribe(
      data => {
        this.contratofornecedor.caminho = data.anexo;
        if (this.contratofornecedor.caminho) {
          this.linkDownload = this.linkDownload + 'FOR_' +
                              this.contratofornecedor.id_fornecedor + '_CTR_' +
                              this.contratofornecedor.id + '_' +
                              this.contratofornecedor.caminho;
        }
        // console.log('upload ok ' + data.anexo);
      },
      error => {
        console.log('falha no upload ' + error.error + ' - ' + error.message);
      },
    );
  }

  btnIncluir_click() {
    this.contratofornecedor = new ContratoFornecedor();
  }

  getErrorMessage(control: FormControl) {
    let mensagem = '';

    if (control.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }

    if (control.hasError('date')) {
      const data = new Date(control.getError('date').value);
      data.setDate(data.getDate() + 1);
      mensagem = mensagem + 'Data informada inferior a ' + data.toLocaleDateString();
    }

    if (control.hasError('date.null')) {
      mensagem = mensagem + control.getError('date.null').value;
    }
    return mensagem;
  }

  validaSaida(event: string) {
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
      width: '900px',
      height: '460px',
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
    });
  }

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
      width: '900px',
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
    });
  }

  limpacampo(servico: ContratoFornecedorServico, event: any) {
    servico.preco_compra = null;
    servico.preco_servico = null;
  }

  addLinha() {
    // validar se ja foi inserido na lista
    const index = this.contratofornecedorresiduos.findIndex(
      p => p.id_contrato === this.contratofornecedorresiduo.id_contrato &&
           p.id_residuo === this.contratofornecedorresiduo.id_residuo &&
           p.id_servico === this.contratofornecedorresiduo.id_servico &&
           p.unidade === this.contratofornecedorresiduo.unidade);

    if ((!isNullOrUndefined(index)) && (index > -1)) {
      this.dialog.warning('SGR', 'Resíduo já foi relacionado');
    } else {
      this.contratofornecedorresiduo.residuo = this.residuos.find(p => p.id === this.contratofornecedorresiduo.id_residuo).descricao;
      this.contratofornecedorresiduo.servico = this.servicos.find(p => p.id === this.contratofornecedorresiduo.id_servico).descricao;
      this.contratofornecedorresiduo.id_fornecedor = this.contratofornecedor.id_fornecedor;
      this.contratofornecedorresiduo.fornecedor = this.contratofornecedor.fornecedor;

      this.contratofornecedorresiduos.push(this.contratofornecedorresiduo);

      this.contratofornecedorresiduo = new ContratoFornecedorResiduo();
    }
    this.moveFocus();
  }

  remLinha(res: ContratoFornecedorResiduo) {
    if (!isNullOrUndefined(res.id)) {
      this.dialog.question('SGR', 'Deseja realmente excluir o resíduo: ' + res.residuo + '?').subscribe(
      result => {
        if (result.retorno) {
          this._contratofornecedorresiduoService.deleteContratoFornecedorResiduo(this._tokenManager.retrieve(), res.id).subscribe(
            data => {
              this.dialog.success('SGR', 'Resíduo excluído do contrato com sucesso.');
              const index = this.contratofornecedorresiduos.indexOf(res);
              this.contratofornecedorresiduos.splice(index, 1);
            },
            error => {
              this.dialog.error('SGR', 'Erro ao excluir o resíduo.', error.error + ' - Detalhe: ' + error.message);
            },
          );
        }
      });
    } else {
      this.dialog.question('SGR', 'Deseja realmente excluir o resíduo: ' + res.residuo + '?').subscribe(
      result => {
        const index = this.contratofornecedorresiduos.indexOf(res);
        this.contratofornecedorresiduos.splice(index, 1);
      });
    }
  }

  editlinha(res: ContratoFornecedorResiduo) {
    this.contratofornecedorresiduo = res;
    const index = this.contratofornecedorresiduos.indexOf(res);
    this.contratofornecedorresiduos.splice(index, 1);
  }

  moveFocus() {
    document.getElementById('cbResiduo').focus();
  }
}
