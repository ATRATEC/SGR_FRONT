import { TipoAtividadeEnum } from './../tipoatividade/tipoatividade.enum';
import { FornecedorService } from './../fornecedor/fornecedor.service';
import { TipoResiduoService } from './../tiporesiduo/tiporesiduo.service';
import { TipoResiduo } from './../tiporesiduo/tiporesiduo';
import { Fornecedor } from './../fornecedor/fornecedor';
import { ContratoClienteResiduoService } from './../contratocliente/contratoclienteresiduo.service';
import { TipoTratamentoService } from './../tipotratamento/tipotratamento.service';
import { AcondicionamentoService } from './../acondicionamento/acondicionamento.service';
import { ContratoClienteResiduo } from './../contratocliente/ContratoClienteResiduo';
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
import { ItemPesagemService } from './itempesagem.service';
import { ServicoService } from './../servico/servico.service';
import { ItemPesagem } from './itempesagem';
import { environment } from './../../environments/environment';
import { Moment } from 'moment/moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material/material-moment-adapter';
import { HttpErrorResponse } from '@angular/common/http';
import { TipoDocumentoService } from './../tipodocumento/tipodocumento.service';
import { TipoDocumento } from './../tipodocumento/tipodocumento';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { PesagemService } from './pesagem.service';
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
import { Pesagem } from './pesagem';
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
import { FornecedorFindComponent } from '../fornecedor/fornecedor-find.component';

@Component({
  selector: 'app-pesagem-form',
  templateUrl: './pesagem-form.component.html',
  styleUrls: ['./pesagem-form.component.css'],
  providers: [
    { provide: DateAdapter,  useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    {provide: LOCALE_ID, useValue: 'pt-BR'}
  ]
})
export class PesagemFormComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  pesagem: Pesagem;
  itempesagem: ItemPesagem;
  itempesagemsCombo: ItemPesagem[];
  itempesagems: ItemPesagem[];
  contratoclienteservicos: ContratoClienteResiduo[];
  // itempesagem: ItemPesagem;
  residuos: Residuo[];
  acondicionamentos: Acondicionamento[];
  tipotratamentos: TipoTratamento[];
  tiporesiduos: TipoResiduo[];
  emProcessamento = false;
  modelLoaded = false;
  exibeIncluir = false;

  opt: FloatPlaceholderType;

  TipoAtividadeEnum: typeof TipoAtividadeEnum = TipoAtividadeEnum;

  trocacor = false;

  valCodigo = new FormControl('', [Validators.required]);
  valCodigoCTR = new FormControl('', [Validators.required]);
  valUnidade = new FormControl('', [Validators.required]);
  valResiduo = new FormControl('', [Validators.required]);
  valData = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('fileInput') fileInput;

  constructor(
    private _pesagemService: PesagemService,
    private _itempesagemService: ItemPesagemService,
    private _contratoclienteResiduoService: ContratoClienteResiduoService,
    private _clienteService: ClienteService,
    private _residuoService: ResiduoService,
    private _contratoclienteService: ContratoClienteService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService,
    private pesquisa: MatDialog
  ) {
    this.opt = 'never';
  }

  validaCampos() {
    return this.valCodigo.valid && this.valData.valid;
  }

  /**
   * Validação de Serviços marcados
   */

  // validaServicos(): boolean {
  //   let retorno: boolean;
  //   let msgRetorno = '';
  //   retorno = true;
  //   for (let index = 0; index < this.itempesagems.length; index++) {
  //     const servico = this.itempesagems[index];
  //     if ((isNullOrUndefined(servico.quantidade)) || (servico.quantidade === 0)) {
  //       msgRetorno = 'Quantidade do residuo ' + servico.residuo + ' não informada.';
  //       break;
  //     }
  //     if (msgRetorno === '') {
  //       if (isNullOrUndefined(servico.id_acondicionamento)) {
  //           msgRetorno = 'Acondicionamento do resíduo ' + servico.residuo + ' não informado.';
  //           break;
  //       }
  //     }

  //     if (msgRetorno === '') {
  //       if (isNullOrUndefined(servico.id_tratamento)) {
  //           msgRetorno = 'Tipo de Tratamento do resíduo ' + servico.residuo + ' não informado.';
  //           break;
  //       }
  //     }

  //     if (msgRetorno === '') {
  //       if (isNullOrUndefined(servico.id_tipo_residuo)) {
  //           msgRetorno = 'Tipo do resíduo ' + servico.residuo + ' não informado.';
  //           break;
  //       }
  //     }

  //   }

  //   if (msgRetorno !== '') {
  //     retorno = false;
  //     this.dialog.warning('SGR', 'Campos obrigatórios não preenchidos. ', msgRetorno);
  //   }

  //   return retorno;
  // }

  ngOnInit() {
    this.emProcessamento = true;
    this.pesagem = new Pesagem();
    this.itempesagems = new Array<ItemPesagem>();
    this.itempesagemsCombo = new Array<ItemPesagem>();
    this.itempesagem = new ItemPesagem();
    this.contratoclienteservicos = new Array<ContratoClienteResiduo>();

    this._residuoService.getListResiduos(this._tokenManager.retrieve()).subscribe(
      data => {
        this.residuos = JSON.parse(data._body);
      }
    );


    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._pesagemService
          .getPesagem(this._tokenManager.retrieve(), id)
          .retry(3)
          .subscribe(data => {
            this.pesagem = JSON.parse(data._body);
            this.emProcessamento = false;
          });
        this._itempesagemService
          .getItemPesagem(this._tokenManager.retrieve(), id)
          .retry(3)
          .subscribe(data => {
            this.itempesagems.length = 0;
            this.itempesagems = JSON.parse(data._body);
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
  }

  ngAfterViewChecked(): void {}

  ngAfterViewInit(): void {
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
      if (isNullOrUndefined(this.pesagem.id)) {
        this._pesagemService.addPesagem(this._tokenManager.retrieve(), this.pesagem)
          .subscribe( data => {
              this.pesagem = data;
              // this.emProcessamento = false;
              // this.exibeIncluir = true;
              // this.dialog.success('SGR', 'Pesagem salvo com sucesso.');
              // Salvando lista de serviços

              for (let index = 0; index < this.itempesagems.length; index++) {
                this.itempesagems[index].id_pesagem = this.pesagem.id;
              }

              this._itempesagemService.addItemPesagem(this._tokenManager.retrieve(),
                this.pesagem.id, this.itempesagems)
                .subscribe( ctrfsrv => {
                  this.itempesagems.length = 0;
                  this.itempesagems = ctrfsrv;
                  this.emProcessamento = false;
                  this.exibeIncluir = true;
                  this.dialog.success('SGR', 'Pesagem salvo com sucesso.');
                },
                error => {
                  this.emProcessamento = false;
                  this.dialog.error('SGR', 'Erro ao salvar lista de itens.', error.error + ' - Detalhe: ' + error.message);
                }
              );
              // this.exibeIncluir = true;
              // this.dialog.success('SGR', 'Documento salvo com sucesso.');
              // this.valTipoDocumento.setValue(this.pesagem.id_tipo_documento);
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            }
          );
      } else {
        this._pesagemService
          .editPesagem(
            this._tokenManager.retrieve(),
            this.pesagem.id,
            this.pesagem
          )
          .subscribe(
            data => {
              // this.emProcessamento = false;
              // fileBrowser.files[0]
              this.pesagem = data;
              for (let index = 0; index < this.itempesagems.length; index++) {
                this.itempesagems[index].id_pesagem = this.pesagem.id;
              }
              this._itempesagemService.addItemPesagem(this._tokenManager.retrieve(),
                this.pesagem.id, this.itempesagems)
                .subscribe( ctrfsrv => {
                  this.itempesagems.length = 0;
                  this.itempesagems = ctrfsrv;
                  this.emProcessamento = false;
                  this.exibeIncluir = true;
                  this.dialog.success('SGR', 'Pesagem salvo com sucesso.');
                },
                error => {
                  this.emProcessamento = false;
                  this.dialog.error('SGR', 'Erro ao salvar lista de serviços.', error.error + ' - Detalhe: ' + error.message);
                }
              );
              // this.exibeIncluir = true;
              // this.dialog.success('SGR', 'Documento salvo com sucesso.');
              // this.valTipoDocumento.setValue(this.pesagem.id_tipo_documento);
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

  btnIncluir_click() {
    this.pesagem = new Pesagem();
    this.itempesagemsCombo.length = 0;
    this.itempesagems.length = 0;
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
      this.pesagem.id_cliente = null;
      this.pesagem.cliente = '';
    }
  }

  validaSaidaCTR(event: string) {
    if (event === '') {
      this.pesagem.id_contrato_cliente = null;
      this.pesagem.descricao = '';
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
            this.pesagem.id_cliente = cliente.id;
            this.pesagem.cliente = cliente.razao_social;
          },
          (err: HttpErrorResponse) => {
            this.pesagem.id_cliente = null;
            this.pesagem.cliente = '';
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
            this.pesagem.id_contrato_cliente = contrato.id;
            this.pesagem.descricao = contrato.descricao;
            this.setupComboResiduo();
          },
          (err: HttpErrorResponse) => {
            this.pesagem.id_contrato_cliente = null;
            this.pesagem.descricao = '';
          }
        );
    }
  }

  openPesquisa(): void {
    const dialogLoginRef = this.pesquisa.open(ClienteFindComponent, {
      width: '900px',
      height: '47 0px',
      disableClose: true,
      data: {
        id: null,
        razao_social: null
      }
    });

    dialogLoginRef.afterClosed().subscribe(result => {
      if (result.id != null && result.id !== undefined) {
        this.pesagem.id_cliente = result.id;
        this.pesagem.cliente = result.razao_social;
      }
    });
  }

  openPesquisaCTR(): void {
    if (isNullOrUndefined(this.pesagem.id_cliente)) {
      this.dialog.warning('SGR', 'Código do cliente não informado.');
    } else {
      const dialogLoginRef = this.pesquisa.open(ContratoClienteFindComponent, {
        width: '1000px',
        height: '430px',
        disableClose: true,
        data: {
          id: this.pesagem.id_cliente,
          descricao: null
        }
      });

      dialogLoginRef.afterClosed().subscribe(result => {
        if (result.id != null && result.id !== undefined) {
          this.pesagem.id_contrato_cliente = result.id;
          this.pesagem.descricao = result.descricao;
          this.setupComboResiduo();
        }
      });
    }
  }

  // limpacampo(servico: ItemPesagem, event: any) {
  //   servico.preco_compra = null;
  //   servico.preco_servico = null;
  //   servico.unidade = '';
  // }

  unidadeChange(event: any) {
    // this.contratoclienteservicos.length = 0;
    // if (!isNullOrUndefined(this.itempesagem.id_servico)) {
    //   this.loadContratos(this.itempesagem.id_servico, event.value);
    // } else {
    //   this.dialog.warning('SGR', 'Serviço não preenchido');
    // }

    // console.log('mudou estado ' + event.value);
  }

  loadContratos(cId_Servico: number, cUnidade: string) {
    // let filtro: ContratoFornecedorServicoFiltro;
    // filtro = new ContratoFornecedorServicoFiltro();
    // filtro.id_servico = cId_Servico;
    // filtro.id_cliente = this.pesagem.id_cliente;
    // filtro.unidade = cUnidade.trim();
    // this.contratoclienteservicos.length = 0;
    // this._contratofornecedorServicoService.getContratoFornecedorServicos(this._tokenManager.retrieve(), filtro)
    //   .subscribe(data => {
    //     this.contratoclienteservicos = JSON.parse(data._body);
    // });
  }

  // setupItens() {
  //   if (isNullOrUndefined(this.pesagem.id_contrato_cliente)) {
  //     this.dialog.warning('SGR', 'Contrato do Cliente não informado.');
  //   } else {
  //     if ((!isNullOrUndefined(this.pesagem.id)) && (this.itempesagems.length > 0) ) {
  //       this.dialog.question('SGR', 'Lista de itens já foi salva. Deseja reiniciar-la?').subscribe(
  //         result => {
  //           if (result.retorno) {
  //             for (let index = 0; index < this.itempesagems.length; index++) {
  //               const servico = this.itempesagems[index];
  //               this._itempesagemService.deleteItemPesagem(this._tokenManager.retrieve(), servico.id).subscribe(
  //                 data => {
  //                 },
  //                 error => {
  //                 },
  //               );
  //             }
  //             this.itempesagems.length = 0;
  //             this._contratoclienteResiduoService.getContratoClienteResiduo(this._tokenManager.retrieve(),
  //             this.pesagem.id_contrato_cliente).subscribe(data => {
  //               let servicos: ContratoClienteResiduo[];
  //               servicos = JSON.parse(data._body);

  //               if (servicos.length > 0) {
  //                 for (let index = 0; index < servicos.length; index++) {
  //                   const servico = servicos[index];

  //                   // Verificar se o residuo já existe na lista.
  //                   if (this.itempesagems.findIndex(p => p.id_residuo === servico.id_residuo) === -1) {
  //                     let residuo: Residuo;
  //                     this._residuoService.getResiduo(this._tokenManager.retrieve(), servico.id_residuo)
  //                     .subscribe(res => {
  //                       residuo = JSON.parse(res._body);
  //                       if (!isNullOrUndefined(residuo)) {
  //                         this.itempesagems.push(new ItemPesagem(
  //                           null,
  //                           null,
  //                           servico.id_residuo,
  //                           residuo.id_tipo_residuo,
  //                           residuo.id_acondicionamento,
  //                           residuo.id_tratamento,
  //                           servico.unidade,
  //                           null,
  //                           '',
  //                           '',
  //                           servico.residuo,
  //                           residuo.tipo_residuo,
  //                           residuo.acondicionamento,
  //                           residuo.tratamento
  //                         ));
  //                       }
  //                     });
  //                   }
  //                 }
  //               }
  //             });
  //           }
  //         }
  //       );
  //     } else {
  //       this.itempesagems.length = 0;
  //       this._contratoclienteResiduoService.getContratoClienteResiduo(this._tokenManager.retrieve(),
  //       this.pesagem.id_contrato_cliente).subscribe(data => {
  //         let servicos: ContratoClienteResiduo[];
  //         servicos = JSON.parse(data._body);

  //         if (servicos.length > 0) {
  //           for (let index = 0; index < servicos.length; index++) {
  //             const servico = servicos[index];

  //             this._residuoService.getResiduo(this._tokenManager.retrieve(), servico.id_residuo)
  //               .subscribe(res => {
  //                 let residuo: Residuo;
  //                 residuo = JSON.parse(res._body);
  //                 if (!isNullOrUndefined(residuo)) {
  //                   // Verificar se o residuo já existe na lista.
  //                   if (this.itempesagems.findIndex(p => p.id_residuo === servico.id_residuo) === -1) {
  //                     this.itempesagems.push(new ItemPesagem(
  //                       null,
  //                       null,
  //                       servico.id_residuo,
  //                       residuo.id_tipo_residuo,
  //                       residuo.id_acondicionamento,
  //                       residuo.id_tratamento,
  //                       servico.unidade,
  //                       null,
  //                       '',
  //                       '',
  //                       servico.residuo,
  //                       residuo.tipo_residuo,
  //                       residuo.acondicionamento,
  //                       residuo.tratamento
  //                     ));
  //                   }
  //                 }
  //               });
  //           }
  //         }
  //       });
  //     }
  //   }

  //   // validar se ja foi inserido na lista
  //   // const index = this.itempesagems.findIndex(
  //   //   p => p.id_contrato_fornecedor === this.itempesagem.id_contrato_fornecedor &&
  //   //        p.id_residuo === this.itempesagem.id_residuo &&
  //   //        p.id_servico === this.itempesagem.id_servico);

  //   // if ((!isNullOrUndefined(index)) && (index > -1)) {
  //   //   this.dialog.warning('SGR', 'Serviço já foi relacionado');
  //   // } else {
  //   //   if (((isNullOrUndefined(this.itempesagem.preco_compra)) || (this.itempesagem.preco_compra === 0)) &&
  //   //      ((isNullOrUndefined(this.itempesagem.preco_servico) || (this.itempesagem.preco_servico === 0)))) {
  //   //     this.dialog.warning('SGR', 'Campo preço não informado.');
  //   //   } else {
  //   //     this.itempesagem.residuo = this.residuos.find(p => p.id === this.itempesagem.id_residuo).descricao;
  //   //     this.itempesagem.servico = this.servicos.find(p => p.id === this.itempesagem.id_servico).descricao;
  //   //     this.itempesagem.fornecedor = this.contratoclienteservicos.find(
  //   //     p => p.id_contrato === this.itempesagem.id_contrato_fornecedor).fornecedor;

  //   //     this.itempesagems.push(this.itempesagem);

  //   //     this.itempesagem = new ItemPesagem();
  //   //   }
  //   // }
  // }

  addlinha() {
    let itemResiduo: ItemPesagem;

    const index = this.itempesagemsCombo.findIndex(p => p.id_residuo === this.itempesagem.id_residuo);
    itemResiduo = this.itempesagemsCombo[index];

    this.itempesagem.residuo = itemResiduo.residuo;
    this.itempesagem.unidade = itemResiduo.unidade;

    const index2 = this.itempesagems.findIndex(p => p.id_residuo === this.itempesagem.id_residuo);

    if ((!isNullOrUndefined(index2)) && (index2 > -1)) {
      this.dialog.warning('SGR', 'Resíduo já foi relacionado ao Pesagem');
    } else {
      this.itempesagems.push(this.itempesagem);
      this.itempesagem = new ItemPesagem();
    }

    // validar se ja foi inserido na lista
    // let mensagem = '';

    // if ((this.valServico.invalid) && (mensagem === '')) {
    //   mensagem = 'Serviço não informado.';
    // }

    // if ((this.valResiduo.invalid) && (mensagem === '')) {
    //   mensagem = 'Resíduo não informado.';
    // }

    // if ((this.valUnidade.invalid) && (mensagem === '')) {
    //   mensagem = 'Unidade não informada.';
    // }

    // if ((this.valCtrFornecedor.invalid) && (mensagem === '')) {
    //   mensagem = 'Contrato do fornecedor não informado.';
    // }

    // if (mensagem === '') {
    //   const index = this.contratoclienteresiduos.findIndex(
    //     p => p.id_contrato_fornecedor === this.contratoclienteresiduo.id_contrato_fornecedor &&
    //          p.id_residuo === this.contratoclienteresiduo.id_residuo &&
    //          p.id_servico === this.contratoclienteresiduo.id_servico &&
    //          p.unidade === this.contratoclienteresiduo.unidade);

    //   if ((!isNullOrUndefined(index)) && (index > -1)) {
    //     mensagem = 'Resíduo já foi relacionado';
    //   }
    // }

    // if (mensagem === '') {
    //   if (((isNullOrUndefined(this.contratoclienteresiduo.preco_compra)) || (this.contratoclienteresiduo.preco_compra === 0)) &&
    //      ((isNullOrUndefined(this.contratoclienteresiduo.preco_servico) || (this.contratoclienteresiduo.preco_servico === 0)))) {
    //     mensagem = 'Campo preço não informado.';
    //   }
    // }


    // if (mensagem === '') {
    //   this.contratoclienteresiduo.residuo = this.residuos.find(p => p.id === this.contratoclienteresiduo.id_residuo).descricao;
    //   this.contratoclienteresiduo.servico = this.servicos.find(p => p.id === this.contratoclienteresiduo.id_servico).descricao;
    //     this.contratoclienteresiduos.push(this.contratoclienteresiduo);
    //     // this.contratoclienteresiduo = null;
    //     this.contratofornecedorresiduos.length = 0;
    //     this.limpaValidadores();
    //     this.contratoclienteresiduo = new ContratoClienteResiduo();
    //     document.getElementById('id_servico').focus();
    // } else {
    //   this.dialog.warning('SGR', 'Resíduo não adicionado', 'Detalhe: ' + mensagem);
    // }

    // const index = this.contratoclienteresiduos.findIndex(
    //   p => p.id_contrato_fornecedor === this.contratoclienteresiduo.id_contrato_fornecedor &&
    //        p.id_residuo === this.contratoclienteresiduo.id_residuo &&
    //        p.id_servico === this.contratoclienteresiduo.id_servico &&
    //        p.unidade === this.contratoclienteresiduo.unidade);

    // if ((!isNullOrUndefined(index)) && (index > -1)) {
    //   mensagem = 'Resíduo já foi relacionado';
    //   this.dialog.warning('SGR', 'Resíduo já foi relacionado');
    // } else {
    //   if (((isNullOrUndefined(this.contratoclienteresiduo.preco_compra)) || (this.contratoclienteresiduo.preco_compra === 0)) &&
    //      ((isNullOrUndefined(this.contratoclienteresiduo.preco_servico) || (this.contratoclienteresiduo.preco_servico === 0)))) {
    //     mensagem = 'Campo preço não informado.';
    //     this.dialog.warning('SGR', 'Campo preço não informado.');
    //   } else {
    //     this.contratoclienteresiduo.residuo = this.residuos.find(p => p.id === this.contratoclienteresiduo.id_residuo).descricao;
    //     this.contratoclienteresiduos.push(this.contratoclienteresiduo);

    //     this.contratoclienteresiduo = new ContratoClienteResiduo();
    //   }
    // }
  }

  remlinha(serv: ItemPesagem) {
    if (!isNullOrUndefined(serv.id)) {
      this.dialog.question('SGR', 'Deseja realmente excluir o Resíduo: ' + serv.residuo + '?').subscribe(
      result => {
        if (result.retorno) {
          this._itempesagemService.deleteItemPesagem(this._tokenManager.retrieve(), serv.id).subscribe(
            data => {
              this.dialog.success('SGR', 'Resíduo excluído do Pesagem com sucesso.');
              const index = this.itempesagems.indexOf(serv);
              this.itempesagems.splice(index, 1);
            },
            error => {
              this.dialog.error('SGR', 'Erro ao excluir o Resíduo.', error.error + ' - Detalhe: ' + error.message);
            },
          );
        }
      });
    } else {
      this.dialog.question('SGR', 'Deseja realmente excluir o Resíduo: ' + serv.residuo + '?').subscribe(
      result => {
        const index = this.itempesagems.indexOf(serv);
        this.itempesagems.splice(index, 1);
      });
    }
  }

  editlinha(serv: ItemPesagem) {
    this.itempesagem = serv;
    const index = this.itempesagems.indexOf(serv);
    this.itempesagems.splice(index, 1);
  }

  setupComboResiduo() {
    if ((!isNullOrUndefined(this.pesagem.id_contrato_cliente))) {
      this.itempesagemsCombo.length = 0;
      this._itempesagemService.getListResiduoItemPesagem(
      this._tokenManager.retrieve(), this.pesagem.id_contrato_cliente)
      .subscribe(data => {
        this.itempesagemsCombo = JSON.parse(data._body);
      });
    }
  }
}
