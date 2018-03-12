import { TipoResiduoService } from './../tiporesiduo/tiporesiduo.service';
import { ClasseResiduoService } from './../classeresiduo/classeresiduo.service';
import { ClasseResiduo } from './../classeresiduo/classeresiduo';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { ResiduoService } from './residuo.service';
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
import { Residuo } from './residuo';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { TipoResiduo } from '../tiporesiduo/tiporesiduo';
import { Acondicionamento } from '../acondicionamento/acondicionamento';
import { TipoTratamento } from '../tipotratamento/tipotratamento';

@Component({
  selector: 'app-residuo-form',
  templateUrl: './residuo-form.component.html',
  styleUrls: ['./residuo-form.component.css']
})
export class ResiduoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  residuo: Residuo;
  residuo_ant: Residuo;
  emProcessamento = false;
  exibeIncluir = false;
  classeresiduos: ClasseResiduo[];
  tiporesiduos: TipoResiduo[];


  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;

  constructor(private _residuoService: ResiduoService,
    private _classeresiduoService: ClasseResiduoService,
    private _tipoResiduoService: TipoResiduoService,
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
    this.residuo = new Residuo();
    this.residuo_ant = new Residuo();
    this._classeresiduoService.getListClasseResiduos(this._tokenManager.retrieve())
      .retry(3)
      .subscribe(data => {
        this.classeresiduos = JSON.parse(data._body);
      });

    this._tipoResiduoService.getListTipoResiduo(this._tokenManager.retrieve())
      .retry(3)
      .subscribe(data => {
        this.tiporesiduos = JSON.parse(data._body);
    });

    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._residuoService.getResiduo(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          this.residuo = JSON.parse(data._body);
          this.residuo_ant = JSON.parse(data._body);
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
      if (isNullOrUndefined(this.residuo.id)) {
        this._residuoService.addResiduo(
          this._tokenManager.retrieve(),
          this.residuo).subscribe(
            data => {
              this.emProcessamento = false;
              this.residuo = data;
              this.residuo_ant = data;
              this.exibeIncluir = true;
              this.dialog.success('SGR', 'Tipo de Resíduo salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            },
          );
      } else {
        this._residuoService.editResiduo(
          this._tokenManager.retrieve(),
          this.residuo.id,
          this.residuo).subscribe(
          data => {
          this.emProcessamento = false;
          this.residuo = data;
          this.residuo_ant = data;
          this.exibeIncluir = true;
          this.dialog.success('SGR', 'Tipo de Resíduo salvo com sucesso.');
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
    this.residuo = new Residuo();
    this.residuo_ant = new Residuo();
  }

  getDescricaoErrorMessage() {
    let mensagem = '';

    if (this.valDescricao.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  canDeactivate(): Observable<boolean> | boolean {

    if (JSON.stringify(this.residuo) === JSON.stringify(this.residuo_ant)) {
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
