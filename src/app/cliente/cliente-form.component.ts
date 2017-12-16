import { EnderecoService } from './../endereco.service';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { ClienteService } from './cliente.service';
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
import { Cliente } from './cliente';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { Estado, Cidade } from './../endereco';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  cliente: Cliente;
  emProcessamento = false;
  exibeIncluir = false;
  estados: Estado[];
  cidades: Cidade[];
  ptn = '[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}';

  valCodigo = new FormControl('', [Validators.required]);
  valRazaoSocial = new FormControl('', [Validators.required]);
  valCnpjCpf = new FormControl('', [Validators.required, Validators.pattern(  this.ptn)]);
  valDDD = new FormControl('', [Validators.pattern('[0-9]{2}')]);
  valTelefone = new FormControl('', [Validators.pattern('[0-9]{4}\-[0-9]{4}|[0-9]{5}\-[0-9]{4}')]);

  @ViewChildren('input') vc;

  constructor(private _clienteService: ClienteService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private _enderecoService: EnderecoService,
    private dialog: DialogService) {}

  ngOnInit() {
    this.emProcessamento = true;
    this.cliente = new Cliente();

    this._enderecoService.getListEstados(this._tokenManager.retrieve()).subscribe(data => {
      this.estados = JSON.parse(data._body);
    });

    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._clienteService.getCliente(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          this.cliente = JSON.parse(data._body);
          if (!isNullOrUndefined(this.cliente.estado)) {
            this.loadCidades(this.cliente.estado);
          }
          this.emProcessamento = false;
        });
      } else {
        this.emProcessamento = false;
      }
    });
  }

  formataCnpjCpf(event: any) {
    // const namere = new RegExp('[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}');

    const cnpjcpf = event.target.value;

    let cnpjcpf_umask: string;
    cnpjcpf_umask = cnpjcpf;

    cnpjcpf_umask = cnpjcpf_umask.replace('.', '').replace('.', '').replace('/', '').replace('-', '').trim();

    let mcpf: string;

    if (cnpjcpf_umask.length === 11) {
      mcpf = cnpjcpf_umask.substr(0, 3) + '.' + cnpjcpf_umask.substr(3, 3) + '.' +
      cnpjcpf_umask.substr(6, 3) + '-' + cnpjcpf_umask.substr(9, 2);
      this.cliente.cnpj_cpf = mcpf;
    }

    if (cnpjcpf_umask.length === 14) {
      mcpf = cnpjcpf_umask.substr(0, 2) + '.' + cnpjcpf_umask.substr(3, 3) + '.' +
      cnpjcpf_umask.substr(6, 3) + '/' + cnpjcpf_umask.substr(9, 4) + '-' + cnpjcpf_umask.substr(12, 2);
      this.cliente.cnpj_cpf = mcpf;
    }

    // console.log(this.cliente.cnpj_cpf);
    // const retorno = namere.test(this.cliente.cnpj_cpf);
    // console.log(this.cliente.cnpj_cpf);
    // console.log(retorno);
  }

  formataTelefone(event: any) {
    // const namere = new RegExp('[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}');

    const telefone = event.target.value;
    let telefone_umask: string = telefone;
    telefone_umask = telefone_umask.replace('-', '').trim();
    let tel: string;
    if (telefone_umask.length === 8) {
       tel = telefone_umask.substr(0, 4) + '-' + telefone_umask.substr(4, 4);
       this.cliente.telefone1_numero = tel;
    }


    if (telefone_umask.length === 9) {
      tel = telefone_umask.substr(0, 5) + '-' + telefone_umask.substr(5, 4);
      this.cliente.telefone1_numero = tel;
    }
  }

  estadoChange(event: any) {
    this.loadCidades(event.value);
    // console.log('mudou estado ' + event.value);
  }

  loadCidades(cUF: string) {
    this._enderecoService.getListCidades(this._tokenManager.retrieve(), cUF).subscribe(data => {
      this.cidades = JSON.parse(data._body);
    });
  }

  // kpcpnjcpf(event: any) {
  //   const pattern = new RegExp('[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}');
  //   const inputChar = String.fromCharCode(event.charCode);
  //     if (!pattern.test(inputChar)) {
  //       event.preventDefault();
  //     }
  // }

  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {
    // this.vc.first.nativeElement.focus();
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
    if (isNullOrUndefined(this.cliente.id)) {
      this._clienteService.addCliente(this._tokenManager.retrieve(), this.cliente).subscribe(
          data => {
            this.emProcessamento = false;
            this.exibeIncluir = true;
            this.dialog.success('SGR', 'Cliente salvo com sucesso.');
          },
          error => {
            this.emProcessamento = false;
            this.dialog.error('SGR', 'Erro ao salvar o registro. msg: ' + error.error);
          },
        );
    } else {
      this._clienteService.editCliente(this._tokenManager.retrieve(), this.cliente.id, this.cliente).subscribe(
        data => {
        this.emProcessamento = false;
        this.exibeIncluir = true;
        this.dialog.success('SGR', 'Cliente salvo com sucesso.');
      },
      error => {
        this.emProcessamento = false;
        this.dialog.error('SGR', 'Erro ao salvar o registro. msg: ' + error.error);
      },
    );
    }
  }

  btnIncluir_click() {
    this.cliente = new Cliente();
  }

  getCodigoErrorMessage() {
    let mensagem = '';
    if (this.valCodigo.hasError('required')) {
      mensagem = 'Campo obrigatório.';
    }

    return mensagem;
  }

  getRazaoSocialErrorMessage() {
    let mensagem = '';

    if (this.valRazaoSocial.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  getCnpjCpfErrorMessage() {
    let mensagem = '';

    if (this.valCnpjCpf.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }

    if (this.valCnpjCpf.hasError('pattern')) {
      mensagem = mensagem + 'Formato inválido para o campo';
    }
    return mensagem;
  }

  getDDDErrorMessage() {
    let mensagem = '';

    if (this.valDDD.hasError('pattern')) {
      mensagem = mensagem + 'Formato inválido para o campo';
    }
    return mensagem;
  }

  getTelefoneErrorMessage() {
    let mensagem = '';

    if (this.valTelefone.hasError('pattern')) {
      mensagem = mensagem + 'Formato inválido para o campo';
    }
    return mensagem;
  }

}
