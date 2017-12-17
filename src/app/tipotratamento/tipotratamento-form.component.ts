import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { TipoTratamentoService } from './tipotratamento.service';
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
import { ChangeDetectorRef, ViewChildren } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { TipoTratamento } from './tipotratamento';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-tipotratamento-form',
  templateUrl: './tipotratamento-form.component.html',
  styleUrls: ['./tipotratamento-form.component.css']
})
export class TipoTratamentoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  tipotratamento: TipoTratamento;
  emProcessamento = false;
  exibeIncluir = false;

  valCodigo = new FormControl('', [Validators.required]);
  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;

  constructor(private _tipotratamentoService: TipoTratamentoService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService) {}

  validaCampos() {
    return (
      this.valCodigo.valid && this.valDescricao.valid
    );
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.tipotratamento = new TipoTratamento(null, null, '', '', '');
    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._tipotratamentoService.getTipoTratamento(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          this.tipotratamento = JSON.parse(data._body);
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
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
  }

  btnSalvar_click() {
    this.emProcessamento = true;
    if (this.validaCampos()) {
      if (isNullOrUndefined(this.tipotratamento.id)) {
        this._tipotratamentoService.addTipoTratamento(
          this._tokenManager.retrieve(),
          this.tipotratamento.codigo.toString(),
          this.tipotratamento.descricao).subscribe(
            data => {
              this.emProcessamento = false;
              this.tipotratamento = data;
              this.exibeIncluir = true;
              this.dialog.success('SGR', 'TipoTratamento salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro. msg: ' + error.error);
            },
          );
      } else {
        this._tipotratamentoService.editTipoTratamento(
          this._tokenManager.retrieve(),
          this.tipotratamento.id,
          this.tipotratamento.codigo.toString(),
          this.tipotratamento.descricao).subscribe(
          data => {
          this.emProcessamento = false;
          this.tipotratamento = data;
          this.exibeIncluir = true;
          this.dialog.success('SGR', 'TipoTratamento salvo com sucesso.');
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

  btnIncluir_click() {
    this.tipotratamento = new TipoTratamento(null, null, '', '', '');
  }

  getCodigoErrorMessage() {
    let mensagem = '';
    if (this.valCodigo.hasError('required')) {
      mensagem = 'Campo obrigatório.';
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

}
