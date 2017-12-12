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

  valCodigo = new FormControl('', [Validators.required]);
  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;

  constructor(private _acondicionamentoService: AcondicionamentoService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService) {}

  ngOnInit() {
    this.emProcessamento = true;
    this.acondicionamento = new Acondicionamento(0, null, '', '', '');
    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._acondicionamentoService.getAcondicionamento(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          this.acondicionamento = JSON.parse(data._body);
          this.emProcessamento = false;
          // const jsondata = JSON.parse(data._body);

          // this.acondicionamento = new Acondicionamento(jsondata.id,
          //                                              jsondata.codigo,
          //                                              jsondata.descricao,
          //                                              jsondata.created_at,
          //                                              jsondata.updated_at);
          // console.log(data._body);
          // console.log(this.acondicionamento);
          // alert(this.acondicionamento.descricao);
        });
        // .then((cliente: Cliente)=> {
        //    console.log(cliente);
        //    this.cliente = cliente;
        // });
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
    // console.log(inputChar, e.charCode);
       if (!pattern.test(inputChar)) {
       // invalid character, prevent input
           event.preventDefault();
      }
  }

  btnSalvar_click() {
    this._acondicionamentoService.addAcondicionamento(this._tokenManager.retrieve(),
                                                      '1',
                                                      'teste de inclusão').subscribe(
                                                        data => {
                                                          this.dialog.success('SGR', 'Acondicionamento incluído com sucesso.');
                                                          this.ngOnInit();
                                                        },
                                                        error => {
                                                          this.dialog.error('SGR', 'Erro ao incluir o registro. msg: ' + error.error);
                                                        },
                                                      );
  }

  btnIncluir_click() {

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
