import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { TipoDocumentoService } from './tipodocumento.service';
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
import { TipoDocumento } from './tipodocumento';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-tipodocumento-form',
  templateUrl: './tipodocumento-form.component.html',
  styleUrls: ['./tipodocumento-form.component.css']
})
export class TipoDocumentoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  tipodocumento: TipoDocumento;
  emProcessamento = false;
  exibeIncluir = false;

  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;

  constructor(private _tipodocumentoService: TipoDocumentoService,
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
    this.tipodocumento = new TipoDocumento();
    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._tipodocumentoService.getTipoDocumento(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          this.tipodocumento = JSON.parse(data._body);
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
      if (isNullOrUndefined(this.tipodocumento.id)) {
        this._tipodocumentoService.addTipoDocumento(
          this._tokenManager.retrieve(),
          this.tipodocumento.descricao).subscribe(
            data => {
              this.emProcessamento = false;
              this.tipodocumento = data;
              this.exibeIncluir = true;
              this.dialog.success('SGR', 'TipoDocumento salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            },
          );
      } else {
        this._tipodocumentoService.editTipoDocumento(
          this._tokenManager.retrieve(),
          this.tipodocumento.id,
          this.tipodocumento.descricao).subscribe(
          data => {
          this.emProcessamento = false;
          this.tipodocumento = data;
          this.exibeIncluir = true;
          this.dialog.success('SGR', 'TipoDocumento salvo com sucesso.');
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
    this.tipodocumento = new TipoDocumento();
  }

  getDescricaoErrorMessage() {
    let mensagem = '';

    if (this.valDescricao.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

}
