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
import { ChangeDetectorRef, ViewChildren } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { Residuo } from './residuo';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-residuo-form',
  templateUrl: './residuo-form.component.html',
  styleUrls: ['./residuo-form.component.css']
})
export class ResiduoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  residuo: Residuo;
  emProcessamento = false;
  exibeIncluir = false;
  classeresiduos: ClasseResiduo[];

  valCodigo = new FormControl('', [Validators.required]);
  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;

  constructor(private _residuoService: ResiduoService,
    private _classeresiduoService: ClasseResiduoService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService) {}

  ngOnInit() {
    this.emProcessamento = true;
    this.residuo = new Residuo(null, null, '', null, '', '', '');
    this._classeresiduoService.getListClasseResiduos(this._tokenManager.retrieve())
                                                .subscribe(data => {
                                                   this.classeresiduos = JSON.parse(data._body);
                                                 });
    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._residuoService.getResiduo(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          this.residuo = JSON.parse(data._body);
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
    if (isNullOrUndefined(this.residuo.id)) {
      this._residuoService.addResiduo(
        this._tokenManager.retrieve(),
        this.residuo.codigo.toString(),
        this.residuo.descricao,
        this.residuo.id_classe).subscribe(
          data => {
            this.emProcessamento = false;
            this.exibeIncluir = true;
            this.dialog.success('SGR', 'Tipo de Resíduo salvo com sucesso.');
          },
          error => {
            this.emProcessamento = false;
            this.dialog.error('SGR', 'Erro ao salvar o registro. msg: ' + error.error);
          },
        );
    } else {
      this._residuoService.editResiduo(
        this._tokenManager.retrieve(),
        this.residuo.id,
        this.residuo.codigo.toString(),
        this.residuo.descricao,
        this.residuo.id_classe).subscribe(
        data => {
        this.emProcessamento = false;
        this.exibeIncluir = true;
        this.dialog.success('SGR', 'Tipo de Resíduo salvo com sucesso.');
      },
      error => {
        this.emProcessamento = false;
        this.dialog.error('SGR', 'Erro ao salvar o registro. msg: ' + error.error);
      },
    );
    }
  }

  btnIncluir_click() {
    this.residuo = new Residuo(null, null, '', null, '', '', '');
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
