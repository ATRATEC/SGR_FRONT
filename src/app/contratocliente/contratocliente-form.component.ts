import { ResiduoService } from './../residuo/residuo.service';
import { Residuo } from './../residuo/residuo';
import { ContratoFornecedorServicoService } from './../contratofornecedor/contratofornecedorservico.service';
import { ContratoFornecedorServico, ContratoFornecedorServicoFiltro } from './../contratofornecedor/contratofornecedorservico';
import { ContratoFornecedorService } from './../contratofornecedor/contratofornecedor.service';
import { UnidadeService } from './../unidade/unidade.service';
import { Unidade } from './../unidade/unidade';
import { ClienteFindComponent } from './../cliente/cliente-find.component';
import { ClienteService } from './../cliente/cliente.service';
import { ContratoClienteServicoService } from './contratoclienteservico.service';
import { ServicoService } from './../servico/servico.service';
import { ContratoClienteServico } from './contratoclienteservico';
import { environment } from './../../environments/environment';
import { Moment } from 'moment/moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material/material-moment-adapter';
import { HttpErrorResponse } from '@angular/common/http';
import { TipoDocumentoService } from './../tipodocumento/tipodocumento.service';
import { TipoDocumento } from './../tipodocumento/tipodocumento';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { ContratoClienteService } from './contratocliente.service';
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
import { ContratoCliente } from './contratocliente';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Cliente } from '../cliente/cliente';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_LOCALE,
         MAT_DATE_FORMATS,  FloatPlaceholderType } from '@angular/material';
import { Servico } from '../servico/servico';
import { FormBuilder, FormGroup} from '@angular/forms';
import { ContratoFornecedor } from '../contratofornecedor/contratofornecedor';

@Component({
  selector: 'app-contratocliente-form',
  templateUrl: './contratocliente-form.component.html',
  styleUrls: ['./contratocliente-form.component.css'],
  providers: [
    { provide: DateAdapter,  useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    {provide: LOCALE_ID, useValue: 'pt-BR'}
  ]
})
export class ContratoClienteFormComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  contratocliente: ContratoCliente;
  contratoclienteservicos: ContratoClienteServico[];
  contratofornecedorservicos: ContratoFornecedorServico[];
  contratoclienteservico: ContratoClienteServico;
  servicos: Servico[];
  unidades: Unidade[];
  residuos: Residuo[];
  emProcessamento = false;
  modelLoaded = false;
  exibeIncluir = false;
  tipodocumentos: TipoDocumento[];
  tipodocumentos2: TipoDocumento[];
  linkDownload = environment.urlbase + '/api/contratos/downloadanexo?arquivo=';
  opt: FloatPlaceholderType;

  trocacor = false;

  valCodigo = new FormControl('', [Validators.required]);
  valDescricao = new FormControl('', [Validators.required]);
  valServico = new FormControl('', [Validators.required]);
  valUnidade = new FormControl('', [Validators.required]);
  valFornecedor = new FormControl('', [Validators.required]);
  valResiduo = new FormControl('', [Validators.required]);
  valVigenciaInicio = new FormControl('', [Validators.required]);
  valVigenciaFinal = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('fileInput') fileInput;

  constructor(
    private _contratoclienteService: ContratoClienteService,
    private _contratoclienteservicoService: ContratoClienteServicoService,
    private _contratofornecedorServicoService: ContratoFornecedorServicoService,
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
    return this.valCodigo.valid && this.valDescricao.valid && this.valVigenciaInicio.valid && this.valVigenciaFinal.valid;
  }

  /**
   * Validação de Serviços marcados
   */

  validaServicos(): boolean {
    let retorno: boolean;
    const msgRetorno = '';
    retorno = true;
    // for (let index = 0; index < this.contratoclienteservicos.length; index++) {
    //   const cfs = this.contratoclienteservicos[index];
    //   if (cfs.selecionado) {
    //     if (cfs.unidade === '') {
    //       msgRetorno = 'Unidade do serviço ' + cfs.descricao + ' deve ser informada.';
    //       break;
    //     }

    //     if (msgRetorno === '') {
    //       if (((isNullOrUndefined(cfs.preco_compra)) || (cfs.preco_compra === 0)) &&
    //         ((isNullOrUndefined(cfs.preco_servico)) || (cfs.preco_servico === 0))) {
    //           msgRetorno = 'Preço de compra ou preço de serviço deve ser informado em ' + cfs.descricao;
    //           break;
    //       }
    //     }
    //   }
    // }

    if (msgRetorno !== '') {
      retorno = false;
      this.dialog.warning('SGR', 'Campos obrigatórios não preenchidos. ', msgRetorno);
    }

    return retorno;
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.contratocliente = new ContratoCliente();
    this.contratoclienteservico = new ContratoClienteServico();
    this.contratoclienteservicos = new Array<ContratoClienteServico>();
    this.contratofornecedorservicos = new Array<ContratoFornecedorServico>();
    // this.contratoclienteservicos.push(new ContratoClienteServico(1, 1, 1, 1, 56.87, true, '', '', 'TRANSPORTE'));
    // this.contratoclienteservicos.push(new ContratoClienteServico(1, 1, 1, 1, 123.47, true, '', '', 'RECEPÇÃO'));
    this._unidadeService.getListUnidades(this._tokenManager.retrieve()).subscribe(
      data => {
        this.unidades = JSON.parse(data._body);
      }
    );

    this._servicoService.getListServicos(this._tokenManager.retrieve()).subscribe(
      data => {
        this.servicos = JSON.parse(data._body);
      }
    );

    this._residuoService.getListResiduos(this._tokenManager.retrieve()).subscribe(
      data => {
        this.residuos = JSON.parse(data._body);
      }
    );


    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._contratoclienteService
          .getContratoCliente(this._tokenManager.retrieve(), id)
          .subscribe(data => {
            this.contratocliente = JSON.parse(data._body);

            if (this.contratocliente.caminho) {
              this.linkDownload = this.linkDownload + 'CLI_' +
                                this.contratocliente.id_cliente + '_CTR_' +
                                this.contratocliente.id + '_' +
                                this.contratocliente.caminho;
            }

            this.emProcessamento = false;
            // this.modelLoaded = true;
            // const tp = new TipoDocumento(this.contratocliente.id_tipo_documento, this.contratocliente.descricao);

            // this.valTipoDocumento.setValue(this.contratocliente.id_tipo_documento);
            // console.log('objeto: ' + this.contratocliente.id_tipo_documento.toString());
          });
        this._contratoclienteservicoService
          .getContratoClienteServico(this._tokenManager.retrieve(), id)
          .subscribe(data => {
            this.contratoclienteservicos.length = 0;
            this.contratoclienteservicos = JSON.parse(data._body);
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
        this.buscaCliente(filter);
      });

    // this._tipoDocumentoService.getListTipoDocumentos(this._tokenManager.retrieve())
    //     .subscribe(dt => {
    //       this.tipodocumentos = JSON.parse(dt._body);
    //       // if ((this.tipodocumentos.length > 0) && (!isNullOrUndefined(this.contratocliente.id_tipo_documento))) {
    //       //   const index = this.tipodocumentos.findIndex(d => d.id === this.contratocliente.id_tipo_documento);
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
    const fileBrowser = this.fileInput.nativeElement;
    if (this.validaCampos()) {
      if (isNullOrUndefined(this.contratocliente.id)) {
        this._contratoclienteService.addContratoCliente(this._tokenManager.retrieve(), this.contratocliente)
          .subscribe( data => {
              this.contratocliente = data;
              // this.emProcessamento = false;
              //     this.exibeIncluir = true;
              //     this.dialog.success('SGR', 'Contrato salvo com sucesso.');
              // Salvando lista de serviços
              for (let index = 0; index < this.contratoclienteservicos.length; index++) {
                this.contratoclienteservicos[index].id_contrato_cliente = this.contratocliente.id;
              }

              this._contratoclienteservicoService.addContratoClienteServico(this._tokenManager.retrieve(),
                this.contratocliente.id, this.contratoclienteservicos)
                .subscribe( ctrfsrv => {
                  this.contratoclienteservicos.length = 0;
                  this.contratoclienteservicos = ctrfsrv;
                  this.emProcessamento = false;
                  this.exibeIncluir = true;
                  this.dialog.success('SGR', 'Contrato salvo com sucesso.');
                },
                error => {
                  this.emProcessamento = false;
                  this.dialog.error('SGR', 'Erro ao salvar lista de serviços.', error.error + ' - Detalhe: ' + error.message);
                }
              );
              if (fileBrowser.files.length > 0) {
                this.uploadContrato(this.contratocliente, fileBrowser.files[0]);
              }
              // this.exibeIncluir = true;
              // this.dialog.success('SGR', 'Documento salvo com sucesso.');
              // this.valTipoDocumento.setValue(this.contratocliente.id_tipo_documento);
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            }
          );
      } else {
        this._contratoclienteService
          .editContratoCliente(
            this._tokenManager.retrieve(),
            this.contratocliente.id,
            this.contratocliente
          )
          .subscribe(
            data => {
              // this.emProcessamento = false;
              // fileBrowser.files[0]
              this.contratocliente = data;
              for (let index = 0; index < this.contratoclienteservicos.length; index++) {
                this.contratoclienteservicos[index].id_contrato_cliente = this.contratocliente.id;
              }
              this._contratoclienteservicoService.addContratoClienteServico(this._tokenManager.retrieve(),
                this.contratocliente.id, this.contratoclienteservicos)
                .subscribe( ctrfsrv => {
                  this.contratoclienteservicos.length = 0;
                  this.contratoclienteservicos = ctrfsrv;
                  this.emProcessamento = false;
                  this.exibeIncluir = true;
                  this.dialog.success('SGR', 'Contrato salvo com sucesso.');
                },
                error => {
                  this.emProcessamento = false;
                  this.dialog.error('SGR', 'Erro ao salvar lista de serviços.', error.error + ' - Detalhe: ' + error.message);
                }
              );
              if (fileBrowser.files.length > 0) {
                this.uploadContrato(this.contratocliente, fileBrowser.files[0]);
              }
              // this.exibeIncluir = true;
              // this.dialog.success('SGR', 'Documento salvo com sucesso.');
              // this.valTipoDocumento.setValue(this.contratocliente.id_tipo_documento);
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

  uploadContrato(_contratocliente: ContratoCliente, _file: File) {
    this._contratoclienteService.uploadContrato(this._tokenManager.retrieve(), _contratocliente, _file).subscribe(
      data => {
        this.contratocliente.caminho = data.anexo;
        if (this.contratocliente.caminho) {
          this.linkDownload = this.linkDownload + 'CLI_' +
                              this.contratocliente.id_cliente + '_CTR_' +
                              this.contratocliente.id + '_' +
                              this.contratocliente.caminho;
        }
        // console.log('upload ok ' + data.anexo);
      },
      error => {
        console.log('falha no upload ' + error.error + ' - ' + error.message);
      },
    );
  }

  btnIncluir_click() {
    this.contratocliente = new ContratoCliente();
  }

  getCodigoErrorMessage() {
    let mensagem = '';

    if (this.valCodigo.hasError('required')) {
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

  getErrorMessage(campo: FormControl) {
    let mensagem = '';

    if (campo.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  validaSaida(event: string) {
    if (event === '') {
      this.contratocliente.id_cliente = null;
      this.contratocliente.cliente = '';
    }
  }

  buscaCliente(event: any) {
    let cliente: Cliente;
    if (event.id) {
      this._clienteService
        .getCliente(this._tokenManager.retrieve(), Number(event.id))
        .subscribe(
          data => {
            cliente = JSON.parse(data._body);
            this.contratocliente.id_cliente = cliente.id;
            this.contratocliente.cliente = cliente.razao_social;
          },
          (err: HttpErrorResponse) => {
            this.contratocliente.id_cliente = null;
            this.contratocliente.cliente = '';
          }
        );
    }
  }

  openPesquisa(): void {
    const dialogLoginRef = this.pesquisa.open(ClienteFindComponent, {
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
        this.contratocliente.id_cliente = result.id;
        this.contratocliente.cliente = result.razao_social;
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
  //   this.contratocliente.vigencia_inicio = new Date(event.toLocaleString());
  // }

  // formatadata(data: Date): Date {
  //   const d = data.toString().substring(0, 10);
  //   return new Date(d.toString());
  // }

  limpacampo(servico: ContratoClienteServico, event: any) {
    servico.preco_compra = null;
    servico.preco_servico = null;
    servico.unidade = '';
  }

  unidadeChange(event: any) {
    // this.contratofornecedorservicos.length = 0;
    if (!isNullOrUndefined(this.contratoclienteservico.id_servico)) {
      this.loadContratos(this.contratoclienteservico.id_servico, event.value);
    } else {
      this.dialog.warning('SGR', 'Serviço não preenchido');
    }

    // console.log('mudou estado ' + event.value);
  }

  loadContratos(cId_Servico: number, cUnidade: string) {
    let filtro: ContratoFornecedorServicoFiltro;
    filtro = new ContratoFornecedorServicoFiltro();
    filtro.id_servico = cId_Servico;
    filtro.id_cliente = this.contratocliente.id_cliente;
    filtro.unidade = cUnidade.trim();
    this.contratofornecedorservicos.length = 0;
    this._contratofornecedorServicoService.getContratoFornecedorServicos(this._tokenManager.retrieve(), filtro)
      .subscribe(data => {
        this.contratofornecedorservicos = JSON.parse(data._body);
    });
  }

  addlinha() {
    // validar se ja foi inserido na lista
    const index = this.contratoclienteservicos.findIndex(
      p => p.id_contrato_fornecedor === this.contratoclienteservico.id_contrato_fornecedor &&
           p.id_residuo === this.contratoclienteservico.id_residuo &&
           p.id_servico === this.contratoclienteservico.id_servico);

    if ((!isNullOrUndefined(index)) && (index > -1)) {
      this.dialog.warning('SGR', 'Serviço já foi relacionado');
    } else {
      if (((isNullOrUndefined(this.contratoclienteservico.preco_compra)) || (this.contratoclienteservico.preco_compra === 0)) &&
         ((isNullOrUndefined(this.contratoclienteservico.preco_servico) || (this.contratoclienteservico.preco_servico === 0)))) {
        this.dialog.warning('SGR', 'Campo preço não informado.');
      } else {
        this.contratoclienteservico.residuo = this.residuos.find(p => p.id === this.contratoclienteservico.id_residuo).descricao;
        this.contratoclienteservico.servico = this.servicos.find(p => p.id === this.contratoclienteservico.id_servico).descricao;
        this.contratoclienteservico.fornecedor = this.contratofornecedorservicos.find(
        p => p.id_contrato === this.contratoclienteservico.id_contrato_fornecedor).fornecedor;

        this.contratoclienteservicos.push(this.contratoclienteservico);

        this.contratoclienteservico = new ContratoClienteServico();
      }
    }
  }

  remlinha(serv: ContratoClienteServico) {
    if (!isNullOrUndefined(serv.id)) {
      this.dialog.question('SGR', 'Deseja realmente excluir o servico: ' + serv.servico + '?').subscribe(
      result => {
        if (result.retorno) {
          this._contratoclienteservicoService.deleteContratoClienteServico(this._tokenManager.retrieve(), serv.id).subscribe(
            data => {
              this.dialog.success('SGR', 'Servico excluído do contrato com sucesso.');
              const index = this.contratoclienteservicos.indexOf(serv);
              this.contratoclienteservicos.splice(index, 1);
            },
            error => {
              this.dialog.error('SGR', 'Erro ao excluir o serviço.', error.error + ' - Detalhe: ' + error.message);
            },
          );
        }
      });
    } else {
      this.dialog.question('SGR', 'Deseja realmente excluir o servico: ' + serv.servico + '?').subscribe(
      result => {
        const index = this.contratoclienteservicos.indexOf(serv);
        this.contratoclienteservicos.splice(index, 1);
      });
    }
  }

  editlinha(serv: ContratoClienteServico) {
    this.contratoclienteservico = serv;
    const index = this.contratoclienteservicos.indexOf(serv);
    this.contratoclienteservicos.splice(index, 1);
  }
}
