import { TipoAtividadeEnum } from './../tipoatividade/tipoatividade.enum';
import { TipoAtividadeService } from './../tipoatividade/tipoatividade.service';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { ServicoService } from './servico.service';
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
import { Servico } from './servico';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { TipoAtividade } from '../tipoatividade/tipoatividade';

@Component({
  selector: 'app-servico-form',
  templateUrl: './servico-form.component.html',
  styleUrls: ['./servico-form.component.css']
})
export class ServicoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  servico: Servico;
  servico_ant: Servico;
  emProcessamento = false;
  exibeIncluir = false;
  tipoatividades: TipoAtividade[];
  TipoAtividadeEnum: typeof TipoAtividadeEnum = TipoAtividadeEnum;

  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;

  constructor(private _servicoService: ServicoService,
    private _tipoatividadeService: TipoAtividadeService,
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
    this.servico = new Servico();
    this.servico_ant = new Servico();
    const ta = this._tipoatividadeService.getListTipoAtividades(this._tokenManager.retrieve())
      .retry(3)
      .subscribe(
        data => {
          this.tipoatividades = JSON.parse(data._body);
          // console.log(2);
          this._route.params.forEach((params: Params) => {
            const id: number = +params['id'];
            if (id) {
              this._servicoService.getServico(this._tokenManager.retrieve(), id)
              .retry(3)
              .subscribe( dt => {
                this.servico = JSON.parse(dt._body);
                this.servico_ant = JSON.parse(dt._body);
                // console.log(1);
                this.emProcessamento = false;
              });
            } else {
              this.emProcessamento = false;
            }
          });
        },
        error => {
          this.emProcessamento = false;
          this.dialog.error('SGR', 'Erro ao carregar o registro.', error.error + ' - Detalhe: ' + error.message);
        }
      );


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
      if (isNullOrUndefined(this.servico.id)) {
        this._servicoService.addServico(
          this._tokenManager.retrieve(),
          this.servico).subscribe(
            data => {
              this.emProcessamento = false;
              this.servico = data;
              this.servico_ant = data;
              this.exibeIncluir = true;
              this.dialog.success('SGR', 'Servico salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            },
          );
      } else {
        this._servicoService.editServico(
          this._tokenManager.retrieve(),
          this.servico.id,
          this.servico).subscribe(
          data => {
          this.emProcessamento = false;
          this.servico = data;
          this.servico_ant = data;
          this.exibeIncluir = true;
          this.dialog.success('SGR', 'Servico salvo com sucesso.');
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
    this.servico = new Servico();
    this.servico_ant = new Servico();
  }

  getDescricaoErrorMessage() {
    let mensagem = '';

    if (this.valDescricao.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  canDeactivate(): Observable<boolean> | boolean {

    if (JSON.stringify(this.servico) === JSON.stringify(this.servico_ant)) {
      return true;
    }
    return this.dialog.confirm('Existem dados não salvos. Deseja descarta-los?');
  }

}
