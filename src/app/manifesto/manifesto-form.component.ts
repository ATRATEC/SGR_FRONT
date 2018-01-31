import { TipoResiduoService } from './../tiporesiduo/tiporesiduo.service';
import { TipoResiduo } from './../tiporesiduo/tiporesiduo';
import { Fornecedor } from './../fornecedor/fornecedor';
import { ContratoClienteServicoService } from './../contratocliente/contratoclienteservico.service';
import { TipoTratamentoService } from './../tipotratamento/tipotratamento.service';
import { AcondicionamentoService } from './../acondicionamento/acondicionamento.service';
import { ContratoClienteServico } from './../contratocliente/contratoclienteservico';
import { ContratoClienteFindComponent } from './../contratocliente/contratocliente-find.component';
import { ContratoClienteService } from './../contratocliente/contratocliente.service';
import { ContratoCliente } from './../contratocliente/contratocliente';
import { ResiduoService } from './../residuo/residuo.service';
import { Residuo } from './../residuo/residuo';
import { ContratoFornecedorServicoService } from './../contratofornecedor/contratofornecedorservico.service';
import { ContratoFornecedorServico, ContratoFornecedorServicoFiltro } from './../contratofornecedor/contratofornecedorservico';
import { ContratoFornecedorService } from './../contratofornecedor/contratofornecedor.service';
import { UnidadeService } from './../unidade/unidade.service';
import { Unidade } from './../unidade/unidade';
import { ClienteFindComponent } from './../cliente/cliente-find.component';
import { ClienteService } from './../cliente/cliente.service';
import { ManifestoServicoService } from './manifestoservico.service';
import { ServicoService } from './../servico/servico.service';
import { ManifestoServico } from './manifestoservico';
import { environment } from './../../environments/environment';
import { Moment } from 'moment/moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material/material-moment-adapter';
import { HttpErrorResponse } from '@angular/common/http';
import { TipoDocumentoService } from './../tipodocumento/tipodocumento.service';
import { TipoDocumento } from './../tipodocumento/tipodocumento';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { ManifestoService } from './manifesto.service';
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
import { Manifesto } from './manifesto';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Cliente } from '../cliente/cliente';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_LOCALE,
         MAT_DATE_FORMATS,  FloatPlaceholderType } from '@angular/material';
import { Servico } from '../servico/servico';
import { FormBuilder, FormGroup} from '@angular/forms';
import { ContratoFornecedor } from '../contratofornecedor/contratofornecedor';
import { Acondicionamento } from '../acondicionamento/acondicionamento';
import { TipoTratamento } from '../tipotratamento/tipotratamento';

@Component({
  selector: 'app-manifesto-form',
  templateUrl: './manifesto-form.component.html',
  styleUrls: ['./manifesto-form.component.css'],
  providers: [
    { provide: DateAdapter,  useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    {provide: LOCALE_ID, useValue: 'pt-BR'}
  ]
})
export class ManifestoFormComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  manifesto: Manifesto;
  manifestoservicos: ManifestoServico[];
  contratoclienteservicos: ContratoClienteServico[];
  // manifestoservico: ManifestoServico;
  acondicionamentos: Acondicionamento[];
  tipotratamentos: TipoTratamento[];
  tiporesiduos: TipoResiduo[];
  emProcessamento = false;
  modelLoaded = false;
  exibeIncluir = false;
  linkDownload = environment.urlbase + '/api/manifestos_anexo/downloadanexo?arquivo=';
  opt: FloatPlaceholderType;

  trocacor = false;

  valCodigo = new FormControl('', [Validators.required]);
  valCodigoCTR = new FormControl('', [Validators.required]);
  valNumero = new FormControl('', [Validators.required]);
  valServico = new FormControl('', [Validators.required]);
  valUnidade = new FormControl('', [Validators.required]);
  valFornecedor = new FormControl('', [Validators.required]);
  valResiduo = new FormControl('', [Validators.required]);
  valData = new FormControl('', [Validators.required]);
  valVigenciaFinal = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('fileInput') fileInput;

  constructor(
    private _manifestoService: ManifestoService,
    private _manifestoservicoService: ManifestoServicoService,
    private _contratoclienteServicoService: ContratoClienteServicoService,
    private _clienteService: ClienteService,
    private _residuoService: ResiduoService,
    private _contratoclienteService: ContratoClienteService,
    private _acondicionamentoService: AcondicionamentoService,
    private _tipotratamentoService: TipoTratamentoService,
    private _tiporesiduoService: TipoResiduoService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService,
    private pesquisa: MatDialog
  ) {
    this.opt = 'never';
  }

  validaCampos() {
    return this.valCodigo.valid && this.valNumero.valid && this.valData.valid && this.validaServicos();
  }

  /**
   * Validação de Serviços marcados
   */

  validaServicos(): boolean {
    let retorno: boolean;
    let msgRetorno = '';
    retorno = true;
    for (let index = 0; index < this.manifestoservicos.length; index++) {
      const servico = this.manifestoservicos[index];
      if ((isNullOrUndefined(servico.quantidade)) || (servico.quantidade === 0)) {
        msgRetorno = 'Quantidade do residuo ' + servico.residuo + ' não informada.';
        break;
      }
      if (msgRetorno === '') {
        if (isNullOrUndefined(servico.id_acondicionamento)) {
            msgRetorno = 'Acondicionamento do resíduo ' + servico.residuo + ' não informado.';
            break;
        }
      }

      if (msgRetorno === '') {
        if (isNullOrUndefined(servico.id_tratamento)) {
            msgRetorno = 'Tipo de Tratamento do resíduo ' + servico.residuo + ' não informado.';
            break;
        }
      }

      if (msgRetorno === '') {
        if (isNullOrUndefined(servico.id_tipo_residuo)) {
            msgRetorno = 'Tipo do resíduo ' + servico.residuo + ' não informado.';
            break;
        }
      }

    }

    if (msgRetorno !== '') {
      retorno = false;
      this.dialog.warning('SGR', 'Campos obrigatórios não preenchidos. ', msgRetorno);
    }

    return retorno;
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.manifesto = new Manifesto();
    this.manifestoservicos = new Array<ManifestoServico>();
    this.contratoclienteservicos = new Array<ContratoClienteServico>();
    // this.manifestoservicos.push(new ManifestoServico(1, 1, 1, 1, 56.87, true, '', '', 'TRANSPORTE'));
    // this.manifestoservicos.push(new ManifestoServico(1, 1, 1, 1, 123.47, true, '', '', 'RECEPÇÃO'));
    this._acondicionamentoService.getListAcondicionamentos(this._tokenManager.retrieve()).subscribe(
      data => {
        this.acondicionamentos = JSON.parse(data._body);
      }
    );

    this._tipotratamentoService.getListTipoTratamento(this._tokenManager.retrieve()).subscribe(
      data => {
        this.tipotratamentos = JSON.parse(data._body);
      }
    );

    this._tiporesiduoService.getListTipoResiduo(this._tokenManager.retrieve()).subscribe(
      data => {
        this.tiporesiduos = JSON.parse(data._body);
      }
    );

    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._manifestoService
          .getManifesto(this._tokenManager.retrieve(), id)
          .subscribe(data => {
            this.manifesto = JSON.parse(data._body);

            if (this.manifesto.caminho) {
              this.linkDownload = this.linkDownload + 'CLI_' +
                                this.manifesto.id_cliente + '_MTR_' +
                                this.manifesto.id + '_' +
                                this.manifesto.caminho;
            }

            this.emProcessamento = false;
            // this.modelLoaded = true;
            // const tp = new TipoDocumento(this.manifesto.id_tipo_documento, this.manifesto.descricao);

            // this.valTipoDocumento.setValue(this.manifesto.id_tipo_documento);
            // console.log('objeto: ' + this.manifesto.id_tipo_documento.toString());
          });
        this._manifestoservicoService
          .getManifestoServico(this._tokenManager.retrieve(), id)
          .subscribe(data => {
            this.manifestoservicos.length = 0;
            this.manifestoservicos = JSON.parse(data._body);
          });
      } else {
        this.emProcessamento = false;
      }
    });

    const idFilter$ = this.valCodigo.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    Observable.combineLatest(idFilter$).debounceTime(500).distinctUntilChanged()
      .map(([id]) => ({ id }))
      .subscribe(filter => {
        this.buscaCliente(filter);
      });

    const idContratoFilter$ = this.valCodigoCTR.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    Observable.combineLatest(idContratoFilter$).debounceTime(500).distinctUntilChanged()
      .map(([id]) => ({ id }))
      .subscribe(filter => {
        this.buscaContrato(filter);
      });

    // this._tipoDocumentoService.getListTipoDocumentos(this._tokenManager.retrieve())
    //     .subscribe(dt => {
    //       this.tipodocumentos = JSON.parse(dt._body);
    //       // if ((this.tipodocumentos.length > 0) && (!isNullOrUndefined(this.manifesto.id_tipo_documento))) {
    //       //   const index = this.tipodocumentos.findIndex(d => d.id === this.manifesto.id_tipo_documento);
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
      if (isNullOrUndefined(this.manifesto.id)) {
        this._manifestoService.addManifesto(this._tokenManager.retrieve(), this.manifesto)
          .subscribe( data => {
              this.manifesto = data;
              // this.emProcessamento = false;
              // this.exibeIncluir = true;
              // this.dialog.success('SGR', 'Manifesto salvo com sucesso.');
              // Salvando lista de serviços

              for (let index = 0; index < this.manifestoservicos.length; index++) {
                this.manifestoservicos[index].id_manifesto = this.manifesto.id;
              }

              this._manifestoservicoService.addManifestoServico(this._tokenManager.retrieve(),
                this.manifesto.id, this.manifestoservicos)
                .subscribe( ctrfsrv => {
                  this.manifestoservicos.length = 0;
                  this.manifestoservicos = ctrfsrv;
                  this.emProcessamento = false;
                  this.exibeIncluir = true;
                  this.dialog.success('SGR', 'Manifesto salvo com sucesso.');
                },
                error => {
                  this.emProcessamento = false;
                  this.dialog.error('SGR', 'Erro ao salvar lista de itens.', error.error + ' - Detalhe: ' + error.message);
                }
              );
              if (fileBrowser.files.length > 0) {
                this.uploadManifesto(this.manifesto, fileBrowser.files[0]);
              }
              // this.exibeIncluir = true;
              // this.dialog.success('SGR', 'Documento salvo com sucesso.');
              // this.valTipoDocumento.setValue(this.manifesto.id_tipo_documento);
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            }
          );
      } else {
        this._manifestoService
          .editManifesto(
            this._tokenManager.retrieve(),
            this.manifesto.id,
            this.manifesto
          )
          .subscribe(
            data => {
              // this.emProcessamento = false;
              // fileBrowser.files[0]
              this.manifesto = data;
              for (let index = 0; index < this.manifestoservicos.length; index++) {
                this.manifestoservicos[index].id_manifesto = this.manifesto.id;
              }
              this._manifestoservicoService.addManifestoServico(this._tokenManager.retrieve(),
                this.manifesto.id, this.manifestoservicos)
                .subscribe( ctrfsrv => {
                  this.manifestoservicos.length = 0;
                  this.manifestoservicos = ctrfsrv;
                  this.emProcessamento = false;
                  this.exibeIncluir = true;
                  this.dialog.success('SGR', 'Manifesto salvo com sucesso.');
                },
                error => {
                  this.emProcessamento = false;
                  this.dialog.error('SGR', 'Erro ao salvar lista de serviços.', error.error + ' - Detalhe: ' + error.message);
                }
              );
              if (fileBrowser.files.length > 0) {
                this.uploadManifesto(this.manifesto, fileBrowser.files[0]);
              }
              // this.exibeIncluir = true;
              // this.dialog.success('SGR', 'Documento salvo com sucesso.');
              // this.valTipoDocumento.setValue(this.manifesto.id_tipo_documento);
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

  uploadManifesto(_manifesto: Manifesto, _file: File) {
    this._manifestoService.uploadManifesto(this._tokenManager.retrieve(), _manifesto, _file).subscribe(
      data => {
        this.manifesto.caminho = data.anexo;
        if (this.manifesto.caminho) {
          this.linkDownload = this.linkDownload + 'CLI_' +
                              this.manifesto.id_cliente + '_MTR_' +
                              this.manifesto.id + '_' +
                              this.manifesto.caminho;
        }
        // console.log('upload ok ' + data.anexo);
      },
      error => {
        console.log('falha no upload ' + error.error + ' - ' + error.message);
      },
    );
  }

  btnIncluir_click() {
    this.manifesto = new Manifesto();
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

    if (this.valNumero.hasError('required')) {
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
      this.manifesto.id_cliente = null;
      this.manifesto.cliente = '';
    }
  }

  validaSaidaCTR(event: string) {
    if (event === '') {
      this.manifesto.id_contrato_cliente = null;
      this.manifesto.descricao = '';
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
            this.manifesto.id_cliente = cliente.id;
            this.manifesto.cliente = cliente.razao_social;
          },
          (err: HttpErrorResponse) => {
            this.manifesto.id_cliente = null;
            this.manifesto.cliente = '';
          }
        );
    }
  }

  buscaContrato(event: any) {
    let contrato: ContratoCliente;
    if (event.id) {
      this._contratoclienteService.getContratoCliente(this._tokenManager.retrieve(), Number(event.id))
        .subscribe(
          data => {
            contrato = JSON.parse(data._body);
            this.manifesto.id_contrato_cliente = contrato.id;
            this.manifesto.descricao = contrato.descricao;
            this.buscarTransportador(this.manifesto.id_contrato_cliente);
            this.buscarDestinador(this.manifesto.id_contrato_cliente);
          },
          (err: HttpErrorResponse) => {
            this.manifesto.id_contrato_cliente = null;
            this.manifesto.descricao = '';
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
        this.manifesto.id_cliente = result.id;
        this.manifesto.cliente = result.razao_social;
      }
    });
  }

  openPesquisaCTR(): void {
    if (isNullOrUndefined(this.manifesto.id_cliente)) {
      this.dialog.warning('SGR', 'Código do cliente não informado.');
    } else {
      const dialogLoginRef = this.pesquisa.open(ContratoClienteFindComponent, {
        width: '1000px',
        height: '430px',
        disableClose: true,
        data: {
          id: this.manifesto.id_cliente,
          descricao: null
        }
      });

      dialogLoginRef.afterClosed().subscribe(result => {
        if (result.id != null && result.id !== undefined) {
          this.manifesto.id_contrato_cliente = result.id;
          this.manifesto.descricao = result.descricao;
          this.buscarTransportador(this.manifesto.id_contrato_cliente);
          this.buscarDestinador(this.manifesto.id_contrato_cliente);
        }
      });
    }

  }

  buscarTransportador(_id_contrato_cliente: number) {
    if (!isNullOrUndefined(_id_contrato_cliente)) {
      this._contratoclienteService.getTransportador(this._tokenManager.retrieve(), _id_contrato_cliente)
      .subscribe(data => {
        const fornecedor: Fornecedor = JSON.parse(data._body);
        this.manifesto.id_transportador = fornecedor.id;
        this.manifesto.transportador = fornecedor.razao_social;
      });
    }
  }

  buscarDestinador(_id_contrato_cliente: number) {
    if (!isNullOrUndefined(_id_contrato_cliente)) {
      this._contratoclienteService.getDestinador(this._tokenManager.retrieve(), _id_contrato_cliente)
      .subscribe(data => {
        const fornecedor: Fornecedor = JSON.parse(data._body);
        this.manifesto.id_destinador = fornecedor.id;
        this.manifesto.destinador = fornecedor.razao_social;
      });
    }
  }

  // limpacampo(servico: ManifestoServico, event: any) {
  //   servico.preco_compra = null;
  //   servico.preco_servico = null;
  //   servico.unidade = '';
  // }

  unidadeChange(event: any) {
    // this.contratoclienteservicos.length = 0;
    // if (!isNullOrUndefined(this.manifestoservico.id_servico)) {
    //   this.loadContratos(this.manifestoservico.id_servico, event.value);
    // } else {
    //   this.dialog.warning('SGR', 'Serviço não preenchido');
    // }

    // console.log('mudou estado ' + event.value);
  }

  loadContratos(cId_Servico: number, cUnidade: string) {
    // let filtro: ContratoFornecedorServicoFiltro;
    // filtro = new ContratoFornecedorServicoFiltro();
    // filtro.id_servico = cId_Servico;
    // filtro.id_cliente = this.manifesto.id_cliente;
    // filtro.unidade = cUnidade.trim();
    // this.contratoclienteservicos.length = 0;
    // this._contratofornecedorServicoService.getContratoFornecedorServicos(this._tokenManager.retrieve(), filtro)
    //   .subscribe(data => {
    //     this.contratoclienteservicos = JSON.parse(data._body);
    // });
  }

  setupItens() {
    if (isNullOrUndefined(this.manifesto.id_contrato_cliente)) {
      this.dialog.warning('SGR', 'Contrato do Cliente não informado.');
    } else {
      if ((!isNullOrUndefined(this.manifesto.id)) && (this.manifestoservicos.length > 0) ) {
        this.dialog.question('SGR', 'Lista de itens já foi salva. Deseja reiniciar-la?').subscribe(
          result => {
            if (result.retorno) {
              for (let index = 0; index < this.manifestoservicos.length; index++) {
                const servico = this.manifestoservicos[index];
                this._manifestoservicoService.deleteManifestoServico(this._tokenManager.retrieve(), servico.id).subscribe(
                  data => {
                  },
                  error => {
                  },
                );
              }
              this.manifestoservicos.length = 0;
              this._contratoclienteServicoService.getContratoClienteServico(this._tokenManager.retrieve(),
              this.manifesto.id_contrato_cliente).subscribe(data => {
                let servicos: ContratoClienteServico[];
                servicos = JSON.parse(data._body);

                if (servicos.length > 0) {
                  for (let index = 0; index < servicos.length; index++) {
                    const servico = servicos[index];

                    // Verificar se o residuo já existe na lista.
                    if (this.manifestoservicos.findIndex(p => p.id_residuo === servico.id_residuo) === -1) {
                      let residuo: Residuo;
                      this._residuoService.getResiduo(this._tokenManager.retrieve(), servico.id_residuo)
                      .subscribe(res => {
                        residuo = JSON.parse(res._body);
                        if (!isNullOrUndefined(residuo)) {
                          this.manifestoservicos.push(new ManifestoServico(
                            null,
                            null,
                            servico.id_residuo,
                            residuo.id_tipo_residuo,
                            residuo.id_acondicionamento,
                            residuo.id_tratamento,
                            servico.unidade,
                            null,
                            '',
                            '',
                            servico.residuo,
                            residuo.tipo_residuo,
                            residuo.acondicionamento,
                            residuo.tratamento
                          ));
                        }
                      });
                    }
                  }
                }
              });
            }
          }
        );
      } else {
        this.manifestoservicos.length = 0;
        this._contratoclienteServicoService.getContratoClienteServico(this._tokenManager.retrieve(),
        this.manifesto.id_contrato_cliente).subscribe(data => {
          let servicos: ContratoClienteServico[];
          servicos = JSON.parse(data._body);

          if (servicos.length > 0) {
            for (let index = 0; index < servicos.length; index++) {
              const servico = servicos[index];
              // Verificar se o residuo já existe na lista.
              if (this.manifestoservicos.findIndex(p => p.id_residuo === servico.id_residuo) === -1) {
                let residuo: Residuo;
                this._residuoService.getResiduo(this._tokenManager.retrieve(), servico.id_residuo)
                .subscribe(res => {
                  residuo = JSON.parse(res._body);
                  if (!isNullOrUndefined(residuo)) {
                    this.manifestoservicos.push(new ManifestoServico(
                      null,
                      null,
                      servico.id_residuo,
                      residuo.id_tipo_residuo,
                      residuo.id_acondicionamento,
                      residuo.id_tratamento,
                      servico.unidade,
                      null,
                      '',
                      '',
                      servico.residuo,
                      residuo.tipo_residuo,
                      residuo.acondicionamento,
                      residuo.tratamento
                    ));
                  }
                });
              }
            }
          }
        });
      }
    }

    // validar se ja foi inserido na lista
    // const index = this.manifestoservicos.findIndex(
    //   p => p.id_contrato_fornecedor === this.manifestoservico.id_contrato_fornecedor &&
    //        p.id_residuo === this.manifestoservico.id_residuo &&
    //        p.id_servico === this.manifestoservico.id_servico);

    // if ((!isNullOrUndefined(index)) && (index > -1)) {
    //   this.dialog.warning('SGR', 'Serviço já foi relacionado');
    // } else {
    //   if (((isNullOrUndefined(this.manifestoservico.preco_compra)) || (this.manifestoservico.preco_compra === 0)) &&
    //      ((isNullOrUndefined(this.manifestoservico.preco_servico) || (this.manifestoservico.preco_servico === 0)))) {
    //     this.dialog.warning('SGR', 'Campo preço não informado.');
    //   } else {
    //     this.manifestoservico.residuo = this.residuos.find(p => p.id === this.manifestoservico.id_residuo).descricao;
    //     this.manifestoservico.servico = this.servicos.find(p => p.id === this.manifestoservico.id_servico).descricao;
    //     this.manifestoservico.fornecedor = this.contratoclienteservicos.find(
    //     p => p.id_contrato === this.manifestoservico.id_contrato_fornecedor).fornecedor;

    //     this.manifestoservicos.push(this.manifestoservico);

    //     this.manifestoservico = new ManifestoServico();
    //   }
    // }
  }

  remlinha(serv: ManifestoServico) {
    // if (!isNullOrUndefined(serv.id)) {
    //   this.dialog.question('SGR', 'Deseja realmente excluir o servico: ' + serv.servico + '?').subscribe(
    //   result => {
    //     if (result.retorno) {
    //       this._manifestoservicoService.deleteManifestoServico(this._tokenManager.retrieve(), serv.id).subscribe(
    //         data => {
    //           this.dialog.success('SGR', 'Servico excluído do contrato com sucesso.');
    //           const index = this.manifestoservicos.indexOf(serv);
    //           this.manifestoservicos.splice(index, 1);
    //         },
    //         error => {
    //           this.dialog.error('SGR', 'Erro ao excluir o serviço.', error.error + ' - Detalhe: ' + error.message);
    //         },
    //       );
    //     }
    //   });
    // } else {
    //   this.dialog.question('SGR', 'Deseja realmente excluir o servico: ' + serv.servico + '?').subscribe(
    //   result => {
    //     const index = this.manifestoservicos.indexOf(serv);
    //     this.manifestoservicos.splice(index, 1);
    //   });
    // }
  }

  editlinha(serv: ManifestoServico) {
    // this.manifestoservico = serv;
    // const index = this.manifestoservicos.indexOf(serv);
    // this.manifestoservicos.splice(index, 1);
  }
}
