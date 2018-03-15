import { StrToBooleanPipe } from './../utilitario/strToBooleanPipe';
import { ClienteDocumentoService } from './clientedocumento.service';
import { TipoDocumentoService } from './../tipodocumento/tipodocumento.service';
import { TipoDocumento } from './../tipodocumento/tipodocumento';
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
import { ChangeDetectorRef, ViewChildren, ElementRef, ViewChild, Input } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { Cliente, ClienteFilter, ClienteFiltro } from './cliente';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Estado, Cidade } from './../endereco';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { ClienteDocumento } from './clientedocumento';
import { environment } from '../../environments/environment';
import { strToBoolean } from '../utilitario/utilitarios';
import { booleanToStrSN } from '../utilitario/utilitarios';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  cliente: Cliente;
  cliente_ant: Cliente;
  clientedocumento: ClienteDocumento;
  clientedocumentos: ClienteDocumento[];
  clientedocumentos_ant: ClienteDocumento[];
  clientedocumentosList: ClienteDocumento[];
  clientedocumentoAnexos: ClienteDocumento[];
  tipodocumentos: TipoDocumento[];
  linkDownload = environment.urlbase + '/api/documentos/cliente/downloadanexo?arquivo=';
  emProcessamento = false;
  exibeIncluir = false;
  private _inativo = false;
  id_documento: number;
  estados: Estado[];
  cidades: Cidade[];
  ptn = '[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}|[0-9]{2}.[0-9]{3}.[0-9]{3}/[0-9]{4}-[0-9]{2}';

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

  valTipoDocumento = new FormControl('', [Validators.required]);
  valNroLicenca = new FormControl('', [Validators.required]);
  valDtEmissao = new FormControl('', [Validators.required]);
  valDtVencimento = new FormControl('', [Validators.required]);

  filteredOptions: Observable<Cidade[]>;

  @Input('inativo')
  set inativo(inativo: boolean){
    this.cliente.inativo = booleanToStrSN(inativo);
  }
  get inativo(): boolean {
    return strToBoolean(this.cliente.inativo);
  }

  @Input('extensao')
  set extensao(extensao: boolean){
    this.clientedocumento.extensao = booleanToStrSN(extensao);
  }
  get extensao(): boolean {
    return strToBoolean(this.clientedocumento.extensao);
  }

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('fileInput') fileInput;

  constructor(
    private _clienteService: ClienteService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private _enderecoService: EnderecoService,
    private _clientedocumentoService: ClienteDocumentoService,
    private _tipodocumentoService: TipoDocumentoService,
    private dialog: DialogService
  ) {}

  validaCampos() {
    return (
      this.valRazaoSocial.valid && this.valCnpjCpf.valid
    );
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.cliente = new Cliente();
    this.cliente_ant = new Cliente();
    this.clientedocumento = new ClienteDocumento();
    this.clientedocumentos = new Array<ClienteDocumento>();
    this.clientedocumentos_ant = new Array<ClienteDocumento>();
    this.clientedocumentosList = new Array<ClienteDocumento>();
    this.clientedocumentoAnexos = new Array<ClienteDocumento>();
    this.tipodocumentos = new Array<TipoDocumento>();

    this._tipodocumentoService.getListTipoDocumentos(this._tokenManager.retrieve()).subscribe( data => {
      this.tipodocumentos = JSON.parse(data._body);
    });

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
            this.cliente_ant = JSON.parse(data._body);
            this.inativo = strToBoolean(this.cliente.inativo);
            // console.log(JSON.parse(data._body).inativo);
            if (!isNullOrUndefined(this.cliente.estado)) {
              this.loadCidades(this.cliente.estado);
            }
            this._clientedocumentoService.getClienteDocumento(this._tokenManager.retrieve(), this.cliente.id).subscribe(
              clidoc => {
                this.clientedocumentos.length = 0;
                this.clientedocumentosList.length = 0;
                this.clientedocumentos = JSON.parse(clidoc._body);
                this.clientedocumentos_ant = JSON.parse(clidoc._body);
                this.clientedocumentosList = JSON.parse(clidoc._body);
              });
              this._clientedocumentoService.getClienteDocumentoAnexo(this._tokenManager.retrieve(), this.cliente.id).subscribe(
                clidocAnexo => {
                  this.clientedocumentoAnexos.length = 0;
                  this.clientedocumentoAnexos = JSON.parse(clidocAnexo._body);
                });
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

    if (this.cliente.cnpj_cpf) {
      let listcliente: Cliente[];
      let filtro: ClienteFiltro;

      filtro = new ClienteFiltro('', this.cliente.cnpj_cpf, '', '', '', '');

      this._clienteService.getClientes(this._tokenManager.retrieve(), 'id', 'id', 0, 15, filtro).subscribe(data => {
        listcliente = data.data;
        if (listcliente.length > 0) {
          if (listcliente[0].id !== this.cliente.id) {
            this.dialog.warning('SGR', 'CNPJ / CPF informado já se encontra cadastrado no sistema.');
            this.cliente.cnpj_cpf = '';
          }
        }
      });
    }

    // console.log(this.cliente.cnpj_cpf);
    // const retorno = namere.test(this.cliente.cnpj_cpf);
    // console.log(this.cliente.cnpj_cpf);
    // console.log(retorno);
  }

  // validaCnpjCpf() {
  //   if (this.cliente.cnpj_cpf) {
  //     let listcliente: Cliente[];
  //     let filtro: ClienteFiltro;

  //     filtro = new ClienteFiltro('', cliente.cnpj_cpf, '', '', '', '');

  //     this._clienteService.getClientes(this._tokenManager.retrieve(), 'id', 'id', 1, 15, filtro).subscribe(data => {
  //       listcliente = JSON.parse(data._body);
  //       if (listcliente.length > 0) {
  //         if (listcliente[0].id !== cliente.id) {
  //           this.dialog.warning('SGR', 'CNPJ / CPF informado já se encontra cadastrado no sistema.');
  //           this.cliente.cnpj_cpf = '';
  //         }
  //       }
  //     });
  //   }
  // }

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
    if (!this.emProcessamento) {
      this.loadCidades(event.value);
      this.cliente.cidade = '';
      this.cidadeFilter.reset();
    }

    // console.log('mudou estado ' + event.value);
  }

  loadCidades(cUF: string) {
    this._enderecoService
      .getListCidades(this._tokenManager.retrieve(), cUF)
      .subscribe(data => {
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

  ngAfterViewChecked(): void {}

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
      if (isNullOrUndefined(this.cliente.id)) {
        this._clienteService
          .addCliente(this._tokenManager.retrieve(), this.cliente)
          .subscribe(
            data => {
              this.cliente = data;
              this.cliente_ant = data;
              // this.emProcessamento = false;
              // this.exibeIncluir = true;
              // this.dialog.success('SGR', 'Cliente salvo com sucesso.');
              for (let index = 0; index < this.clientedocumentos.length; index++) {
                this.clientedocumentos[index].id_cliente = this.cliente.id;
              }

              this._clientedocumentoService.addClienteDocumento(this._tokenManager.retrieve(),
                this.cliente.id, this.clientedocumentos)
                .subscribe( clidoc => {
                  this.clientedocumentos.length = 0;
                  this.clientedocumentosList.length = 0;
                  this.clientedocumentos = clidoc;
                  this.clientedocumentos_ant = clidoc;
                  this.clientedocumentosList = clidoc;
                  this.limpaValidadores();
                  this.emProcessamento = false;
                  this.exibeIncluir = true;
                  this.dialog.success('SGR', 'Cliente salvo com sucesso.');
                },
                error => {
                  this.emProcessamento = false;
                  this.dialog.error('SGR', 'Erro ao salvar lista de documentos.', error.error + ' - Detalhe: ' + error.message);
                }
              );
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
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
              this.cliente_ant = data;
              // this.emProcessamento = false;
              // this.exibeIncluir = true;
              // this.dialog.success('SGR', 'Cliente salvo com sucesso.');
              for (let index = 0; index < this.clientedocumentos.length; index++) {
                this.clientedocumentos[index].id_cliente = this.cliente.id;
              }

              this._clientedocumentoService.addClienteDocumento(this._tokenManager.retrieve(),
                this.cliente.id, this.clientedocumentos)
                .subscribe( clidoc => {
                  this.clientedocumentos.length = 0;
                  this.clientedocumentosList.length = 0;
                  this.clientedocumentos = clidoc;
                  this.clientedocumentos_ant = clidoc;
                  this.clientedocumentosList = clidoc;
                  this.limpaValidadores();
                  this.emProcessamento = false;
                  this.exibeIncluir = true;
                  this.dialog.success('SGR', 'Cliente salvo com sucesso.');
                },
                error => {
                  this.emProcessamento = false;
                  this.dialog.error('SGR', 'Erro ao salvar lista de documentos.', error.error + ' - Detalhe: ' + error.message);
                }
              );
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
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
    this.clientedocumento = new ClienteDocumento();
    this.clientedocumentos.length = 0;
    this.clientedocumentos_ant.length = 0;
    this.clientedocumentoAnexos.length = 0;
    this.clientedocumentosList.length = 0;
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

  addlinha() {
    // validar se ja foi inserido na lista
    let mensagem = '';

    if ((this.valTipoDocumento.invalid) && (mensagem === '')) {
      mensagem = 'Tipo de documento não informado.';
    }

    if ((this.valNroLicenca.invalid) && (mensagem === '')) {
      mensagem = 'Número da liçenca não informado.';
    }

    if ((this.valDtEmissao.invalid) && (mensagem === '')) {
      mensagem = 'Data de emissão não informada.';
    }

    if ((this.valDtVencimento.invalid) && (mensagem === '')) {
      mensagem = 'Data de Vencimento não informada.';
    }

    if (mensagem === '') {
      const index = this.clientedocumentos.findIndex(
        p => p.id_cliente === this.clientedocumento.id_cliente &&
             p.id_tipo_documento === this.clientedocumento.id_tipo_documento);

      if ((!isNullOrUndefined(index)) && (index > -1)) {
        mensagem = 'Documento já foi relacionado';
      }
    }

    if (mensagem === '') {
      this.clientedocumento.descricao = this.tipodocumentos.find(p => p.id === this.clientedocumento.id_tipo_documento).descricao;
      this.clientedocumentos.push(this.clientedocumento);
      this.limpaValidadores();
      this.clientedocumento = new ClienteDocumento();
      document.getElementById('id_tipodocumento').focus();
    } else {
      this.dialog.warning('SGR', 'Documento não adicionado', 'Detalhe: ' + mensagem);
    }
  }

  limpaValidadores() {
    this.valTipoDocumento.clearValidators();
    this.valNroLicenca.clearValidators();
    this.valDtEmissao.clearValidators();
    this.valDtVencimento.clearValidators();
  }

  remlinha(doc: ClienteDocumento) {
    if (!isNullOrUndefined(doc.id)) {
      this.dialog.question('SGR', 'Deseja realmente excluir o documento: ' + doc.descricao  + ' ?').subscribe(
      result => {
        if (result.retorno) {
          this._clientedocumentoService.deleteClienteDocumento(this._tokenManager.retrieve(), doc.id).subscribe(
            data => {
              this.dialog.success('SGR', 'Documento excluído do contrato com sucesso.');
              const index = this.clientedocumentos.indexOf(doc);
              this.clientedocumentos.splice(index, 1);
              const index2 = this.clientedocumentoAnexos.indexOf(doc);
              this.clientedocumentoAnexos.splice(index2, 1);
            },
            error => {
              this.dialog.error('SGR', 'Erro ao excluir o documento.', error.error + ' - Detalhe: ' + error.message);
            },
          );
        }
      });
    } else {
      this.dialog.question('SGR', 'Deseja realmente excluir o documento: ' + doc.descricao  + ' ?').subscribe(
      result => {
        if (result.retorno) {
          const index = this.clientedocumentos.indexOf(doc);
          this.clientedocumentos.splice(index, 1);
        }
      });
    }
  }

  editlinha(doc: ClienteDocumento) {
    this.clientedocumento = doc;
    const index = this.clientedocumentos.indexOf(doc);
    this.clientedocumentos.splice(index, 1);
    this.limpaValidadores();
  }

  uploadAnexo() {
    const fileBrowser = this.fileInput.nativeElement;
    if ((fileBrowser.files.length > 0) && (!isNullOrUndefined(this.id_documento))) {
      const clidoc = this.clientedocumentosList.find(p => p.id === this.id_documento);
      this.uploadDocumento(clidoc, fileBrowser.files[0]);
    }
  }

  uploadDocumento(_clienteDocumento: ClienteDocumento, _file: File) {
    this._clientedocumentoService.uploadDocumento(this._tokenManager.retrieve(), _clienteDocumento, _file).subscribe(
      data => {
        this._clientedocumentoService.getClienteDocumentoAnexo(this._tokenManager.retrieve(), this.cliente.id)
        .subscribe( clidoc => {
          this.clientedocumentoAnexos.length = 0;
          this.clientedocumentoAnexos = JSON.parse(clidoc._body);
        });
        // console.log('upload ok ' + data.anexo);
      },
      error => {
        console.log('falha no upload ' + error);
      },
    );
  }

  deleteAnexo(doc: ClienteDocumento) {
    this._clientedocumentoService.deleteAnexoDocumento(this._tokenManager.retrieve(), doc.id).subscribe(
      data => {
        this._clientedocumentoService.getClienteDocumentoAnexo(this._tokenManager.retrieve(), this.cliente.id)
        .subscribe( clidoc => {
          this.clientedocumentoAnexos.length = 0;
          this.clientedocumentoAnexos = JSON.parse(clidoc._body);
        });
      }
    );
  }

  canDeactivate(): Observable<boolean> | boolean {

    if (((JSON.stringify(this.cliente) === JSON.stringify(this.cliente_ant))) &&
       ((JSON.stringify(this.clientedocumentos) === JSON.stringify(this.clientedocumentos_ant)))) {
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


