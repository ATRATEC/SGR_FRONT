import { ClienteService } from './../cliente/cliente.service';
import { Cliente } from './../cliente/cliente';
import { HttpErrorResponse } from '@angular/common/http';
import { FornecedorService } from './../fornecedor/fornecedor.service';
import { environment } from './../../environments/environment';
import { Moment } from 'moment/moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material/material-moment-adapter';
import { FornecedorFindComponent } from './../fornecedor/fornecedor-find.component';
import { ContratoFornecedorServicoService } from './contratofornecedorservico.service';
import { ContratoFornecedorServico } from './contratofornecedorservico';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { ContratoFornecedorService } from './contratofornecedor.service';
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
import { ContratoFornecedor } from './contratofornecedor';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { Fornecedor } from '../fornecedor/fornecedor';

@Component({
  selector: 'app-contratofornecedor-form',
  templateUrl: './contratofornecedor-form.component.html',
  styleUrls: ['./contratofornecedor-form.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class ContratoFornecedorFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  contratofornecedor: ContratoFornecedor;
  contratofornecedorservico: ContratoFornecedorServico[];
  emProcessamento = false;
  exibeIncluir = false;

  valCodigo = new FormControl('', [Validators.required]);
  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;

  constructor(private _contratofornecedorService: ContratoFornecedorService,
    private _contratofornecedorservicoService: ContratoFornecedorServicoService,
    private _fornecedorService: FornecedorService,
    private _clienteService: ClienteService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService,
    private pesquisa: MatDialog) {}

  validaCampos() {
    return (
      this.valDescricao.valid
    );
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.contratofornecedor = new ContratoFornecedor();
    this.contratofornecedor.cliente = new Cliente();
    this.contratofornecedor.fornecedor = new Fornecedor();

    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._contratofornecedorservicoService.getContratoFornecedorServico(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          // this.contratofornecedor = JSON.parse(data._body);
          this.contratofornecedorservico = JSON.parse(data._body);
          if (this.contratofornecedorservico.length > 0) {
            this.contratofornecedor = this.contratofornecedorservico[0].contrato_fornecedor;
            this.contratofornecedor.fornecedor = this.contratofornecedorservico[0].fornecedor;
            if (this.contratofornecedor.id_cliente != null) {
              this._clienteService.getCliente(this._tokenManager.retrieve(), this.contratofornecedor.id_cliente)
              .subscribe( dt => {
                this.contratofornecedor.cliente = JSON.parse(dt._body);
              });
            }


          }
          this.emProcessamento = false;
        });
      } else {
        this.emProcessamento = false;
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
    if (this.validaCampos()) {
      if (isNullOrUndefined(this.contratofornecedor.id)) {
        this._contratofornecedorService.addContratoFornecedor(
          this._tokenManager.retrieve(),
          this.contratofornecedor.descricao).subscribe(
            data => {
              this.emProcessamento = false;
              this.contratofornecedor = data;
              this.exibeIncluir = true;
              this.dialog.success('SGR', 'ContratoFornecedor salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            },
          );
      } else {
        this._contratofornecedorService.editContratoFornecedor(
          this._tokenManager.retrieve(),
          this.contratofornecedor.id,
          this.contratofornecedor.descricao).subscribe(
          data => {
          this.emProcessamento = false;
          this.contratofornecedor = data;
          this.exibeIncluir = true;
          this.dialog.success('SGR', 'ContratoFornecedor salvo com sucesso.');
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
    }
  }

  buscaFornecedor(event: any) {
    let fornecedor: Fornecedor;
    if (event.id) {
      this._fornecedorService.getFornecedor(this._tokenManager.retrieve(), Number(event.id))
      .subscribe( data => {
        fornecedor = JSON.parse(data._body);
        this.contratofornecedor.fornecedor = fornecedor;

      },
      (err: HttpErrorResponse) => {
        this.contratofornecedor.fornecedor = null;
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
        this.contratofornecedor.fornecedor = new Fornecedor();
        this.contratofornecedor.id_fornecedor = result.id;
        this.contratofornecedor.fornecedor.id = result.id;
        this.contratofornecedor.fornecedor.razao_social = result.razao_social;
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
    this.contratofornecedor.vigencia_final = new Date(event.toISOString());
  }

}
