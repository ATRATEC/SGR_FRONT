import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { AcondicionamentoService } from './acondicionamento.service';
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
import { Acondicionamento } from './acondicionamento';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-acondicionamento-form',
  templateUrl: './acondicionamento-form.component.html',
  styleUrls: ['./acondicionamento-form.component.css']
})
export class AcondicionamentoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  acondicionamento: Acondicionamento;
  emProcessamento = false;
  exibeIncluir = false;

  valCodigo = new FormControl('', [Validators.required]);
  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;

  constructor(private _acondicionamentoService: AcondicionamentoService,
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
    this.acondicionamento = new Acondicionamento(null, null, '', '', '');
    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._acondicionamentoService.getAcondicionamento(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          this.acondicionamento = JSON.parse(data._body);
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
      if (isNullOrUndefined(this.acondicionamento.id)) {
        this._acondicionamentoService.addAcondicionamento(
          this._tokenManager.retrieve(),
          this.acondicionamento.codigo.toString(),
          this.acondicionamento.descricao).subscribe(
            data => {
              this.emProcessamento = false;
              this.acondicionamento = data;
              this.exibeIncluir = true;
              this.dialog.success('SGR', 'Acondicionamento salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro. msg: ' + error.error);
            },
          );
      } else {
        this._acondicionamentoService.editAcondicionamento(
          this._tokenManager.retrieve(),
          this.acondicionamento.id,
          this.acondicionamento.codigo.toString(),
          this.acondicionamento.descricao).subscribe(
          data => {
          this.emProcessamento = false;
          this.acondicionamento = data;
          this.exibeIncluir = true;
          this.dialog.success('SGR', 'Acondicionamento salvo com sucesso.');
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
    this.acondicionamento = new Acondicionamento(null, null, '', '', '');
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
