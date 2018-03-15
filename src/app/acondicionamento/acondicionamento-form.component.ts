import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { AcondicionamentoService } from './acondicionamento.service';
import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
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
  acondicionamento_ant: Acondicionamento;
  emProcessamento = false;
  exibeIncluir = false;

  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;

  constructor(private _acondicionamentoService: AcondicionamentoService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService) {}

  validaCampos() {
    return (
      this.valDescricao.valid
    );
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.acondicionamento = new Acondicionamento();
    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._acondicionamentoService.getAcondicionamento(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          this.acondicionamento = JSON.parse(data._body);
          this.acondicionamento_ant = JSON.parse(data._body);
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
    Promise.resolve(null).then(() => this.focuscomp.nativeElement.focus());
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
      if (isNullOrUndefined(this.acondicionamento.id)) {
        this._acondicionamentoService.addAcondicionamento(
          this._tokenManager.retrieve(),
          this.acondicionamento.descricao).subscribe(
            data => {
              this.emProcessamento = false;
              this.acondicionamento = data;
              this.acondicionamento_ant = data;
              this.exibeIncluir = true;
              this.dialog.success('SGR', 'Acondicionamento salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            },
          );
      } else {
        this._acondicionamentoService.editAcondicionamento(
          this._tokenManager.retrieve(),
          this.acondicionamento.id,
          this.acondicionamento.descricao).subscribe(
          data => {
          this.emProcessamento = false;
          this.acondicionamento = data;
          this.acondicionamento_ant = data;
          this.exibeIncluir = true;
          this.dialog.success('SGR', 'Acondicionamento salvo com sucesso.');
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
    this.acondicionamento = new Acondicionamento();
    this.acondicionamento_ant = new Acondicionamento();
  }

  getDescricaoErrorMessage() {
    let mensagem = '';

    if (this.valDescricao.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  canDeactivate(): Observable<boolean> | boolean {

    if (JSON.stringify(this.acondicionamento) === JSON.stringify(this.acondicionamento_ant)) {
      return true;
    }
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    // if (!this.crisis || this.crisis.name === this.editName) {
    //   return true;
    // }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    return this.dialog.confirm('Existem dados não salvos. Deseja descarta-los?');
  }

}
