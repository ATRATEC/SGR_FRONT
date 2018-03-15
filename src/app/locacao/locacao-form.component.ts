import { EquipamentoService } from './../equipamento/equipamento.service';
import { Equipamento } from './../equipamento/equipamento';
import { ContratoClienteEquipamento } from './../contratocliente/contratoclienteequipamento';
import { ContratoClienteFindComponent } from './../contratocliente/contratocliente-find.component';
import { ContratoClienteService } from './../contratocliente/contratocliente.service';
import { ContratoCliente } from './../contratocliente/contratocliente';
import { UnidadeService } from './../unidade/unidade.service';
import { Unidade } from './../unidade/unidade';
import { ClienteFindComponent } from './../cliente/cliente-find.component';
import { ClienteService } from './../cliente/cliente.service';
import { LocacaoEquipamentoService } from './locacaoequipamento.service';
import { LocacaoEquipamento } from './locacaoequipamento';
import { environment } from './../../environments/environment';
import { Moment } from 'moment/moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material/material-moment-adapter';
import { HttpErrorResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { LocacaoService } from './locacao.service';
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
import { Locacao } from './locacao';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Cliente } from '../cliente/cliente';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_LOCALE,
         MAT_DATE_FORMATS,  FloatPlaceholderType } from '@angular/material';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-locacao-form',
  templateUrl: './locacao-form.component.html',
  styleUrls: ['./locacao-form.component.css'],
  providers: [
    { provide: DateAdapter,  useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    {provide: LOCALE_ID, useValue: 'pt-BR'}
  ]
})
export class LocacaoFormComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  locacao: Locacao;
  locacao_ant: Locacao;
  locacaoequipamento: LocacaoEquipamento;
  locacaoequipamentosCombo: LocacaoEquipamento[];
  locacaoequipamentos: LocacaoEquipamento[];
  locacaoequipamentos_ant: LocacaoEquipamento[];
  contratoclienteequipamentos: ContratoClienteEquipamento[];
  // locacaoequipamento: LocacaoEquipamento;
  equipamentos: Equipamento[];
  emProcessamento = false;
  modelLoaded = false;
  exibeIncluir = false;
  opt: FloatPlaceholderType;
  trocacor = false;

  valCodigo = new FormControl('', [Validators.required]);
  valCodigoCTR = new FormControl('', [Validators.required]);
  valUnidade = new FormControl('', [Validators.required]);
  valEquipamento = new FormControl('', [Validators.required]);
  valData = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('fileInput') fileInput;

  constructor(
    private _locacaoService: LocacaoService,
    private _locacaoequipamentoService: LocacaoEquipamentoService,
    private _clienteService: ClienteService,
    private _equipamentoService: EquipamentoService,
    private _contratoclienteService: ContratoClienteService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService,
    private pesquisa: MatDialog
  ) {
    this.opt = 'never';
  }

  validaCampos() {
    return this.valCodigo.valid && this.valData.valid && this.validaEquipamentos();
  }

  /**
   * Validação de Serviços marcados
   */

  validaEquipamentos(): boolean {
    let retorno: boolean;
    let msgRetorno = '';
    retorno = true;
    for (let index = 0; index < this.locacaoequipamentos.length; index++) {
      const servico = this.locacaoequipamentos[index];
      if ((isNullOrUndefined(servico.quantidade)) || (servico.quantidade === 0)) {
        msgRetorno = 'Quantidade do equipamento ' + servico.equipamento + ' não informada.';
        break;
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
    this.locacao = new Locacao();
    this.locacao_ant = new Locacao();
    this.locacaoequipamentos = new Array<LocacaoEquipamento>();
    this.locacaoequipamentos_ant = new Array<LocacaoEquipamento>();
    this.locacaoequipamentosCombo = new Array<LocacaoEquipamento>();
    this.locacaoequipamento = new LocacaoEquipamento();
    this.contratoclienteequipamentos = new Array<ContratoClienteEquipamento>();

    this._equipamentoService.getListEquipamento(this._tokenManager.retrieve()).subscribe(
      data => {
        this.equipamentos = JSON.parse(data._body);
      }
    );


    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._locacaoService
          .getLocacao(this._tokenManager.retrieve(), id)
          .subscribe(data => {
            this.locacao = JSON.parse(data._body);
            this.locacao_ant = JSON.parse(data._body);
            this.emProcessamento = false;
          });
        this._locacaoequipamentoService
          .getLocacaoEquipamento(this._tokenManager.retrieve(), id)
          .subscribe(data => {
            this.locacaoequipamentos.length = 0;
            this.locacaoequipamentos_ant.length = 0;
            this.locacaoequipamentos = JSON.parse(data._body);
            this.locacaoequipamentos_ant = JSON.parse(data._body);
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
    if (this.validaCampos()) {
      if (isNullOrUndefined(this.locacao.id)) {
        this._locacaoService.addLocacao(this._tokenManager.retrieve(), this.locacao)
          .subscribe( data => {
              this.locacao = data;
              this.locacao_ant = data;
              for (let index = 0; index < this.locacaoequipamentos.length; index++) {
                this.locacaoequipamentos[index].id_locacao = this.locacao.id;
              }

              this._locacaoequipamentoService.addLocacaoEquipamento(this._tokenManager.retrieve(),
                this.locacao.id, this.locacaoequipamentos)
                .subscribe( ctrfsrv => {
                  this.locacaoequipamentos.length = 0;
                  this.locacaoequipamentos_ant.length = 0;
                  this.locacaoequipamentos = ctrfsrv;
                  this.locacaoequipamentos_ant = ctrfsrv;
                  this.emProcessamento = false;
                  this.exibeIncluir = true;
                  this.dialog.success('SGR', 'Locacao salvo com sucesso.');
                },
                error => {
                  this.emProcessamento = false;
                  this.dialog.error('SGR', 'Erro ao salvar lista de itens.', error.error + ' - Detalhe: ' + error.message);
                }
              );
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            }
          );
      } else {
        this._locacaoService
          .editLocacao(
            this._tokenManager.retrieve(),
            this.locacao.id,
            this.locacao
          )
          .subscribe(
            data => {
              // this.emProcessamento = false;
              // fileBrowser.files[0]
              this.locacao = data;
              this.locacao_ant = data;
              for (let index = 0; index < this.locacaoequipamentos.length; index++) {
                this.locacaoequipamentos[index].id_locacao = this.locacao.id;
              }
              this._locacaoequipamentoService.addLocacaoEquipamento(this._tokenManager.retrieve(),
                this.locacao.id, this.locacaoequipamentos)
                .subscribe( ctrfsrv => {
                  this.locacaoequipamentos.length = 0;
                  this.locacaoequipamentos_ant.length = 0;
                  this.locacaoequipamentos = ctrfsrv;
                  this.locacaoequipamentos_ant = ctrfsrv;
                  this.emProcessamento = false;
                  this.exibeIncluir = true;
                  this.dialog.success('SGR', 'Locacao salvo com sucesso.');
                },
                error => {
                  this.emProcessamento = false;
                  this.dialog.error('SGR', 'Erro ao salvar lista de serviços.', error.error + ' - Detalhe: ' + error.message);
                }
              );
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
    this.locacao = new Locacao();
    this.locacao_ant = new Locacao();
    this.locacaoequipamentosCombo.length = 0;
    this.locacaoequipamentos.length = 0;
    this.locacaoequipamentos_ant.length = 0;
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
      this.locacao.id_cliente = null;
      this.locacao.cliente = '';
    }
  }


  validaSaidaCTR(event: string) {
    if (event === '') {
      this.locacao.id_contrato_cliente = null;
      this.locacao.descricao = '';
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
            this.locacao.id_cliente = cliente.id;
            this.locacao.cliente = cliente.razao_social;
          },
          (err: HttpErrorResponse) => {
            this.locacao.id_cliente = null;
            this.locacao.cliente = '';
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
            this.locacao.id_contrato_cliente = contrato.id;
            this.locacao.descricao = contrato.descricao;
            this.setupComboEquipamento();
          },
          (err: HttpErrorResponse) => {
            this.locacao.id_contrato_cliente = null;
            this.locacao.descricao = '';
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
        this.locacao.id_cliente = result.id;
        this.locacao.cliente = result.razao_social;
      }
    });
  }

  openPesquisaCTR(): void {
    if (isNullOrUndefined(this.locacao.id_cliente)) {
      this.dialog.warning('SGR', 'Código do cliente não informado.');
    } else {
      const dialogLoginRef = this.pesquisa.open(ContratoClienteFindComponent, {
        width: '1000px',
        height: '430px',
        disableClose: true,
        data: {
          id: this.locacao.id_cliente,
          descricao: null
        }
      });

      dialogLoginRef.afterClosed().subscribe(result => {
        if (result.id != null && result.id !== undefined) {
          this.locacao.id_contrato_cliente = result.id;
          this.locacao.descricao = result.descricao;
          this.setupComboEquipamento();
        }
      });
    }

  }

  unidadeChange(event: any) {

  }

  loadContratos(cId_Servico: number, cUnidade: string) {

  }


  addlinha() {
    let itemEquipamnento: LocacaoEquipamento;

    const index = this.locacaoequipamentosCombo.findIndex(p => p.id_equipamento === this.locacaoequipamento.id_equipamento);
    itemEquipamnento = this.locacaoequipamentosCombo[index];

    this.locacaoequipamento.equipamento = itemEquipamnento.equipamento;
    this.locacaoequipamento.unidade = itemEquipamnento.unidade;

    const index2 = this.locacaoequipamentos.findIndex(p => p.id_equipamento === this.locacaoequipamento.id_equipamento);

    if ((!isNullOrUndefined(index2)) && (index2 > -1)) {
      this.dialog.warning('SGR', 'Equipamento já foi relacionado a Apuração de Locação');
    } else {
      this.locacaoequipamentos.push(this.locacaoequipamento);
      this.locacaoequipamento = new LocacaoEquipamento();
    }
  }

  remlinha(serv: LocacaoEquipamento) {
    if (!isNullOrUndefined(serv.id)) {
      this.dialog.question('SGR', 'Deseja realmente excluir o Equipamento: ' + serv.equipamento + '?').subscribe(
      result => {
        if (result.retorno) {
          this._locacaoequipamentoService.deleteLocacaoEquipamento(this._tokenManager.retrieve(), serv.id).subscribe(
            data => {
              this.dialog.success('SGR', 'Equipamento excluído da Apuração de Locação com sucesso.');
              const index = this.locacaoequipamentos.indexOf(serv);
              this.locacaoequipamentos.splice(index, 1);
            },
            error => {
              this.dialog.error('SGR', 'Erro ao excluir o Equipamento.', error.error + ' - Detalhe: ' + error.message);
            },
          );
        }
      });
    } else {
      this.dialog.question('SGR', 'Deseja realmente excluir o Equipamento: ' + serv.equipamento + '?').subscribe(
      result => {
        const index = this.locacaoequipamentos.indexOf(serv);
        this.locacaoequipamentos.splice(index, 1);
      });
    }
  }

  editlinha(serv: LocacaoEquipamento) {
    this.locacaoequipamento = serv;
    const index = this.locacaoequipamentos.indexOf(serv);
    this.locacaoequipamentos.splice(index, 1);
  }

  setupComboEquipamento() {
    if ((!isNullOrUndefined(this.locacao.id_contrato_cliente))) {
      this.locacaoequipamentosCombo.length = 0;
      this._locacaoequipamentoService.getListEquipamentoLocacao(this._tokenManager.retrieve(), this.locacao.id_contrato_cliente)
      .subscribe(data => {
        this.locacaoequipamentosCombo = JSON.parse(data._body);
      });
    }
  }

  canDeactivate(): Observable<boolean> | boolean {

    if (((JSON.stringify(this.locacao) === JSON.stringify(this.locacao_ant))) &&
    ((JSON.stringify(this.locacaoequipamentos) === JSON.stringify(this.locacaoequipamentos_ant)))) {
      return true;
    }

    return this.dialog.confirm('Existem dados não salvos. Deseja descarta-los?');
  }
}
