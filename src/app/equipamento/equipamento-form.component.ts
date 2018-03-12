import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { EquipamentoService } from './equipamento.service';
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
import { Equipamento } from './equipamento';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-equipamento-form',
  templateUrl: './equipamento-form.component.html',
  styleUrls: ['./equipamento-form.component.css']
})
export class EquipamentoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  equipamento: Equipamento;
  emProcessamento = false;
  exibeIncluir = false;

  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;

  constructor(private _equipamentoService: EquipamentoService,
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
    this.equipamento = new Equipamento();
    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._equipamentoService.getEquipamento(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          this.equipamento = JSON.parse(data._body);
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
      if (isNullOrUndefined(this.equipamento.id)) {
        this._equipamentoService.addEquipamento(
          this._tokenManager.retrieve(),
          this.equipamento.descricao).subscribe(
            data => {
              this.emProcessamento = false;
              this.equipamento = data;
              this.exibeIncluir = true;
              this.dialog.success('SGR', 'Equipamento salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            },
          );
      } else {
        this._equipamentoService.editEquipamento(
          this._tokenManager.retrieve(),
          this.equipamento.id,
          this.equipamento.descricao).subscribe(
          data => {
          this.emProcessamento = false;
          this.equipamento = data;
          this.exibeIncluir = true;
          this.dialog.success('SGR', 'Equipamento salvo com sucesso.');
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
    this.equipamento = new Equipamento();
  }

  getDescricaoErrorMessage() {
    let mensagem = '';

    if (this.valDescricao.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

}
