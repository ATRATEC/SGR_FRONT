import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { TipoResiduoService } from './tiporesiduo.service';
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
import { TipoResiduo } from './tiporesiduo';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-tiporesiduo-form',
  templateUrl: './tiporesiduo-form.component.html',
  styleUrls: ['./tiporesiduo-form.component.css']
})
export class TipoResiduoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  tiporesiduo: TipoResiduo;
  tiporesiduo_ant: TipoResiduo;
  emProcessamento = false;
  exibeIncluir = false;

  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;

  constructor(private _tiporesiduoService: TipoResiduoService,
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
    this.tiporesiduo = new TipoResiduo();
    this.tiporesiduo_ant = new TipoResiduo();
    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._tiporesiduoService.getTipoResiduo(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          this.tiporesiduo = JSON.parse(data._body);
          this.tiporesiduo_ant = JSON.parse(data._body);
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
      if (isNullOrUndefined(this.tiporesiduo.id)) {
        this._tiporesiduoService.addTipoResiduo(
          this._tokenManager.retrieve(),
          this.tiporesiduo.descricao).subscribe(
            data => {
              this.emProcessamento = false;
              this.tiporesiduo = data;
              this.tiporesiduo_ant = data;
              this.exibeIncluir = true;
              this.dialog.success('SGR', 'TipoResiduo salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            },
          );
      } else {
        this._tiporesiduoService.editTipoResiduo(
          this._tokenManager.retrieve(),
          this.tiporesiduo.id,
          this.tiporesiduo.descricao).subscribe(
          data => {
          this.emProcessamento = false;
          this.tiporesiduo = data;
          this.tiporesiduo_ant = data;
          this.exibeIncluir = true;
          this.dialog.success('SGR', 'TipoResiduo salvo com sucesso.');
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
    this.tiporesiduo = new TipoResiduo();
    this.tiporesiduo_ant = new TipoResiduo();
  }

  getDescricaoErrorMessage() {
    let mensagem = '';

    if (this.valDescricao.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  canDeactivate(): Observable<boolean> | boolean {

    if (JSON.stringify(this.tiporesiduo) === JSON.stringify(this.tiporesiduo_ant)) {
      return true;
    }

    return this.dialog.confirm('Existem dados não salvos. Deseja descarta-los?');
  }

}
