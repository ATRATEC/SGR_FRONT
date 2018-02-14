import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { ClasseResiduoService } from './classeresiduo.service';
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
import { ClasseResiduo } from './classeresiduo';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-classeresiduo-form',
  templateUrl: './classeresiduo-form.component.html',
  styleUrls: ['./classeresiduo-form.component.css']
})
export class ClasseResiduoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  classeresiduo: ClasseResiduo;
  emProcessamento = false;
  exibeIncluir = false;

  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;

  constructor(private _classeresiduoService: ClasseResiduoService,
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
    this.classeresiduo = new ClasseResiduo();
    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._classeresiduoService.getClasseResiduo(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          this.classeresiduo = JSON.parse(data._body);
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
      if (isNullOrUndefined(this.classeresiduo.id)) {
        this._classeresiduoService.addClasseResiduo(
        this._tokenManager.retrieve(),
        this.classeresiduo.descricao).subscribe(
          data => {
            // this.classeresiduo = data;
            this.emProcessamento = false;
            this.classeresiduo = data;
            this.exibeIncluir = true;
            this.dialog.success('SGR', 'Classe de Residuo salvo com sucesso.');
          },
          error => {
            this.emProcessamento = false;
            this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
          },
        );
      } else {
        this._classeresiduoService.editClasseResiduo(
          this._tokenManager.retrieve(),
          this.classeresiduo.id,
          this.classeresiduo.descricao).subscribe(
          data => {
            // this.classeresiduo = data;
            this.emProcessamento = false;
            this.classeresiduo = data;
            this.exibeIncluir = true;
            this.dialog.success('SGR', 'Classe de Residuo salvo com sucesso.');
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
    this.classeresiduo = new ClasseResiduo();
  }

  getDescricaoErrorMessage() {
    let mensagem = '';

    if (this.valDescricao.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

}
