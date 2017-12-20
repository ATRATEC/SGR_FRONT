import { EnderecoService } from './../endereco.service';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { ClienteService } from './cliente.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked
} from '@angular/core';
import { Router } from '@angular/router';
import { by } from 'protractor';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { ChangeDetectorRef, ViewChildren, ElementRef, ViewChild } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { Cliente } from './cliente';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Estado, Cidade } from './../endereco';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  cliente: Cliente;
  emProcessamento = false;
  exibeIncluir = false;
  estados: Estado[];
  cidades: Cidade[];
  ptn = '[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}|[0-9]{2}.[0-9]{3}.[0-9]{3}/[0-9]{4}-[0-9]{2}';

  valCodigo = new FormControl('', [Validators.required]);
  valRazaoSocial = new FormControl('', [Validators.required]);
  valCnpjCpf = new FormControl('', [
    Validators.required,
    Validators.pattern(this.ptn)
  ]);
  valDDD = new FormControl('', [Validators.pattern('[0-9]{2}')]);
  valDDD2 = new FormControl('', [Validators.pattern('[0-9]{2}')]);
  valDDDFax = new FormControl('', [Validators.pattern('[0-9]{2}')]);
  valTelefone = new FormControl('', [
    Validators.pattern('[0-9]{4}-[0-9]{4}|[0-9]{5}-[0-9]{4}')
  ]);
  valTelefone2 = new FormControl('', [
    Validators.pattern('[0-9]{4}-[0-9]{4}|[0-9]{5}-[0-9]{4}')
  ]);
  valTelefoneFax = new FormControl('', [
    Validators.pattern('[0-9]{4}-[0-9]{4}|[0-9]{5}-[0-9]{4}')
  ]);
  cidadeFilter = new FormControl();

  filteredOptions: Observable<Cidade[]>;

  @ViewChildren('input') vc;

  constructor(
    private _clienteService: ClienteService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private _enderecoService: EnderecoService,
    private dialog: DialogService
  ) {}

  validaCampos() {
    return (
      this.valCodigo.valid && this.valRazaoSocial.valid && this.valCnpjCpf.valid
    );
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.cliente = new Cliente();

    this._enderecoService
      .getListEstados(this._tokenManager.retrieve())
      .subscribe(data => {
        this.estados = JSON.parse(data._body);
      });

    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._clienteService
          .getCliente(this._tokenManager.retrieve(), id)
          .subscribe(data => {
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

    this.filteredOptions = this.cidadeFilter.valueChanges.pipe(
      startWith({} as Cidade),
      map(
        (cidade: any) =>
          cidade && typeof cidade === 'object' ? cidade.cCod : cidade
      ),
      map((cCod: any) => (cCod ? this.filter(cCod) : this.cidades))
    );

    // const cidadeFilter$ = this.cidadeFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    // Observable.combineLatest(cidadeFilter$
    //     ).debounceTime(500).distinctUntilChanged().map(
    // ([cidade ]) =>
    // ({cidade})).subscribe(filter => {
    //   console.log(filter.cidade);
    // });
  }

  filter(name: string): Cidade[] {
    return this.cidades.filter(
      option => option.cCod.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  // displayFn(cidade: Cidade): string {
  //   return cidade ? cidade.cCod : '';
  // }

  formataCnpjCpf(event: any) {
    // const namere = new RegExp('[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}');

    const cnpjcpf = event.target.value;

    let cnpjcpf_umask: string;
    cnpjcpf_umask = cnpjcpf;

    cnpjcpf_umask = cnpjcpf_umask
      .replace('.', '')
      .replace('.', '')
      .replace('/', '')
      .replace('-', '')
      .trim();

    let mcpf: string;

    if (cnpjcpf_umask.length === 11) {
      mcpf =
        cnpjcpf_umask.substr(0, 3) +
        '.' +
        cnpjcpf_umask.substr(3, 3) +
        '.' +
        cnpjcpf_umask.substr(6, 3) +
        '-' +
        cnpjcpf_umask.substr(9, 2);
      this.cliente.cnpj_cpf = mcpf;
    }

    if (cnpjcpf_umask.length === 14) {
      mcpf =
        cnpjcpf_umask.substr(0, 2) +
        '.' +
        cnpjcpf_umask.substr(3, 3) +
        '.' +
        cnpjcpf_umask.substr(6, 3) +
        '/' +
        cnpjcpf_umask.substr(9, 4) +
        '-' +
        cnpjcpf_umask.substr(12, 2);
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

  formataTelefone2(event: any) {
    // const namere = new RegExp('[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}');

    const telefone = event.target.value;
    let telefone_umask: string = telefone;
    telefone_umask = telefone_umask.replace('-', '').trim();
    let tel: string;
    if (telefone_umask.length === 8) {
      tel = telefone_umask.substr(0, 4) + '-' + telefone_umask.substr(4, 4);
      this.cliente.telefone2_numero = tel;
    }

    if (telefone_umask.length === 9) {
      tel = telefone_umask.substr(0, 5) + '-' + telefone_umask.substr(5, 4);
      this.cliente.telefone2_numero = tel;
    }
  }

  formataTelefoneFax(event: any) {
    // const namere = new RegExp('[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}');

    const telefone = event.target.value;
    let telefone_umask: string = telefone;
    telefone_umask = telefone_umask.replace('-', '').trim();
    let tel: string;
    if (telefone_umask.length === 8) {
      tel = telefone_umask.substr(0, 4) + '-' + telefone_umask.substr(4, 4);
      this.cliente.fax_numero = tel;
    }

    if (telefone_umask.length === 9) {
      tel = telefone_umask.substr(0, 5) + '-' + telefone_umask.substr(5, 4);
      this.cliente.fax_numero = tel;
    }
  }

  estadoChange(event: any) {
    this.loadCidades(event.value);
    this.cliente.cidade = '';
    // console.log('mudou estado ' + event.value);
  }

  loadCidades(cUF: string) {
    this._enderecoService
      .getListCidades(this._tokenManager.retrieve(), cUF)
      .subscribe(data => {
        this.cidades = JSON.parse(data._body);
        this.cidadeFilter.reset();
      });
  }

  // kpcpnjcpf(event: any) {
  //   const pattern = new RegExp('[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}');
  //   const inputChar = String.fromCharCode(event.charCode);
  //     if (!pattern.test(inputChar)) {
  //       event.preventDefault();
  //     }
  // }

  ngAfterViewChecked(): void {}

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
    if (this.validaCampos()) {
      if (isNullOrUndefined(this.cliente.id)) {
        this._clienteService
          .addCliente(this._tokenManager.retrieve(), this.cliente)
          .subscribe(
            data => {
              this.cliente = data;
              this.emProcessamento = false;
              this.exibeIncluir = true;
              this.dialog.success('SGR', 'Cliente salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error(
                'SGR',
                'Erro ao salvar o registro. msg: ' + error.error
              );
            }
          );
      } else {
        this._clienteService
          .editCliente(
            this._tokenManager.retrieve(),
            this.cliente.id,
            this.cliente
          )
          .subscribe(
            data => {
              this.cliente = data;
              this.emProcessamento = false;
              this.exibeIncluir = true;
              this.dialog.success('SGR', 'Cliente salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error(
                'SGR',
                'Erro ao salvar o registro. msg: ' + error.error
              );
            }
          );
      }
    } else {
      this.emProcessamento = false;
      this.dialog.warning('SGR', 'Campos obrigatórios não preenchidos');
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

  getDDD2ErrorMessage() {
    let mensagem = '';

    if (this.valDDD2.hasError('pattern')) {
      mensagem = mensagem + 'Formato inválido para o campo';
    }
    return mensagem;
  }

  getTelefone2ErrorMessage() {
    let mensagem = '';

    if (this.valTelefone2.hasError('pattern')) {
      mensagem = mensagem + 'Formato inválido para o campo';
    }
    return mensagem;
  }

  getDDDFaxErrorMessage() {
    let mensagem = '';

    if (this.valDDDFax.hasError('pattern')) {
      mensagem = mensagem + 'Formato inválido para o campo';
    }
    return mensagem;
  }

  getTelefoneFaxErrorMessage() {
    let mensagem = '';

    if (this.valTelefoneFax.hasError('pattern')) {
      mensagem = mensagem + 'Formato inválido para o campo';
    }
    return mensagem;
  }

  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    } else {
      return null;
    }
  }

  validadeanoChange(event: any) {
    const dtemiss = new Date(this.cliente.dtemissaolicenca);
    let ano = dtemiss.getFullYear();
    const mes = dtemiss.getMonth();
    const dia = dtemiss.getDate();
    ano = ano + parseInt(event.target.value, 10);
    const dt = new Date(ano, mes, dia);
    this.cliente.dtvalidadelicenca = dt;
    console.log('data ' + dt.toLocaleDateString());
  }
}


