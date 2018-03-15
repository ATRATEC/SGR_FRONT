import { TipoDocumentoService } from './../tipodocumento/tipodocumento.service';
import { FornecedorDocumentoService } from './fornecedordocumento.service';
import { TipoDocumento } from './../tipodocumento/tipodocumento';
import { FornecedorDocumento } from './fornecedordocumento';
import { TipoAtividadeService } from './../tipoatividade/tipoatividade.service';
import { TipoAtividade } from './../tipoatividade/tipoatividade';
import { EnderecoService } from './../endereco.service';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { FornecedorService } from './fornecedor.service';
import { Component, OnInit, AfterViewInit, AfterViewChecked, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { by } from 'protractor';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { ChangeDetectorRef, ViewChildren, ViewChild, ElementRef, Input } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { Fornecedor, FornecedorFiltro } from './fornecedor';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { Estado, Cidade } from './../endereco';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { environment } from '../../environments/environment';
import { booleanToStrSN, strToBoolean } from '../utilitario/utilitarios';

@Component({
  selector: 'app-fornecedor-form',
  templateUrl: './fornecedor-form.component.html',
  styleUrls: ['./fornecedor-form.component.css']
})
export class FornecedorFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  fornecedor: Fornecedor;
  fornecedor_ant: Fornecedor;
  fornecedordocumento: FornecedorDocumento;
  fornecedordocumentos: FornecedorDocumento[];
  fornecedordocumentos_ant: FornecedorDocumento[];
  fornecedordocumentosList: FornecedorDocumento[];
  fornecedordocumentoAnexos: FornecedorDocumento[];
  tipodocumentos: TipoDocumento[];
  linkDownload = environment.urlbase + '/api/documentos/fornecedor/downloadanexo?arquivo=';
  emProcessamento = false;
  exibeIncluir = false;
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
    this.fornecedor.inativo = booleanToStrSN(inativo);
  }
  get inativo(): boolean {
    return strToBoolean(this.fornecedor.inativo);
  }

  @Input('extensao')
  set extensao(extensao: boolean){
    this.fornecedordocumento.extensao = booleanToStrSN(extensao);
  }
  get extensao(): boolean {
    return strToBoolean(this.fornecedordocumento.extensao);
  }

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('fileInput') fileInput;

  constructor(
    private _fornecedorService: FornecedorService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private _enderecoService: EnderecoService,
    private _fornecedordocumentoService: FornecedorDocumentoService,
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
    this.fornecedor = new Fornecedor();
    this.fornecedor = new Fornecedor();
    this.fornecedordocumento = new FornecedorDocumento();
    this.fornecedordocumentos = new Array<FornecedorDocumento>();
    this.fornecedordocumentos_ant = new Array<FornecedorDocumento>();
    this.fornecedordocumentosList = new Array<FornecedorDocumento>();
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
        this._fornecedorService
          .getFornecedor(this._tokenManager.retrieve(), id)
          .subscribe(data => {
            this.fornecedor = JSON.parse(data._body);
            this.fornecedor_ant = JSON.parse(data._body);
            if (!isNullOrUndefined(this.fornecedor.estado)) {
              this.loadCidades(this.fornecedor.estado);
            }
            this._fornecedordocumentoService.getFornecedorDocumento(this._tokenManager.retrieve(), this.fornecedor.id).subscribe(
              clidoc => {
                this.fornecedordocumentos.length = 0;
                this.fornecedordocumentosList.length = 0;
                this.fornecedordocumentos = JSON.parse(clidoc._body);
                this.fornecedordocumentos_ant = JSON.parse(clidoc._body);
                this.fornecedordocumentosList = JSON.parse(clidoc._body);
              });
              this._fornecedordocumentoService.getFornecedorDocumentoAnexo(this._tokenManager.retrieve(), this.fornecedor.id).subscribe(
                clidocAnexo => {
                  this.fornecedordocumentoAnexos.length = 0;
                  this.fornecedordocumentoAnexos = JSON.parse(clidocAnexo._body);
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
      this.fornecedor.cnpj_cpf = mcpf;
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
      this.fornecedor.cnpj_cpf = mcpf;
    }

    if (this.fornecedor.cnpj_cpf) {
      let listfornecedor: Fornecedor[];
      let filtro: FornecedorFiltro;

      filtro = new FornecedorFiltro('', this.fornecedor.cnpj_cpf, '', '', '', '');

      this._fornecedorService.getFornecedors(this._tokenManager.retrieve(), 'id', 'id', 0, 15, filtro).subscribe(data => {
        listfornecedor = data.data;
        if (listfornecedor.length > 0) {
          if (listfornecedor[0].id !== this.fornecedor.id) {
            this.dialog.warning('SGR', 'CNPJ / CPF informado já se encontra cadastrado no sistema.');
            this.fornecedor.cnpj_cpf = '';
          }
        }
      });
    }

    // console.log(this.fornecedor.cnpj_cpf);
    // const retorno = namere.test(this.fornecedor.cnpj_cpf);
    // console.log(this.fornecedor.cnpj_cpf);
    // console.log(retorno);
  }

  // validaCnpjCpf() {
  //   if (this.fornecedor.cnpj_cpf) {
  //     let listfornecedor: Fornecedor[];
  //     let filtro: FornecedorFiltro;

  //     filtro = new FornecedorFiltro('', fornecedor.cnpj_cpf, '', '', '', '');

  //     this._fornecedorService.getFornecedors(this._tokenManager.retrieve(), 'id', 'id', 1, 15, filtro).subscribe(data => {
  //       listfornecedor = JSON.parse(data._body);
  //       if (listfornecedor.length > 0) {
  //         if (listfornecedor[0].id !== fornecedor.id) {
  //           this.dialog.warning('SGR', 'CNPJ / CPF informado já se encontra cadastrado no sistema.');
  //           this.fornecedor.cnpj_cpf = '';
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
      this.fornecedor.telefone1_numero = tel;
    }

    if (telefone_umask.length === 9) {
      tel = telefone_umask.substr(0, 5) + '-' + telefone_umask.substr(5, 4);
      this.fornecedor.telefone1_numero = tel;
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
      this.fornecedor.telefone2_numero = tel;
    }

    if (telefone_umask.length === 9) {
      tel = telefone_umask.substr(0, 5) + '-' + telefone_umask.substr(5, 4);
      this.fornecedor.telefone2_numero = tel;
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
      this.fornecedor.fax_numero = tel;
    }

    if (telefone_umask.length === 9) {
      tel = telefone_umask.substr(0, 5) + '-' + telefone_umask.substr(5, 4);
      this.fornecedor.fax_numero = tel;
    }
  }

  estadoChange(event: any) {
    if (!this.emProcessamento) {
      this.loadCidades(event.value);
      this.fornecedor.cidade = '';
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
      if (isNullOrUndefined(this.fornecedor.id)) {
        this._fornecedorService
          .addFornecedor(this._tokenManager.retrieve(), this.fornecedor)
          .subscribe(
            data => {
              this.fornecedor = data;
              this.fornecedor_ant = data;
              // this.emProcessamento = false;
              // this.exibeIncluir = true;
              // this.dialog.success('SGR', 'Fornecedor salvo com sucesso.');
              for (let index = 0; index < this.fornecedordocumentos.length; index++) {
                this.fornecedordocumentos[index].id_fornecedor = this.fornecedor.id;
              }

              this._fornecedordocumentoService.addFornecedorDocumento(this._tokenManager.retrieve(),
                this.fornecedor.id, this.fornecedordocumentos)
                .subscribe( clidoc => {
                  this.fornecedordocumentos.length = 0;
                  this.fornecedordocumentos_ant.length = 0;
                  this.fornecedordocumentosList.length = 0;
                  this.fornecedordocumentos = clidoc;
                  this.fornecedordocumentos_ant = clidoc;
                  this.fornecedordocumentosList = clidoc;
                  this.limpaValidadores();
                  this.emProcessamento = false;
                  this.exibeIncluir = true;
                  this.dialog.success('SGR', 'Fornecedor salvo com sucesso.');
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
        this._fornecedorService
          .editFornecedor(
            this._tokenManager.retrieve(),
            this.fornecedor.id,
            this.fornecedor
          )
          .subscribe(
            data => {
              this.fornecedor = data;
              this.fornecedor_ant = data;
              // this.emProcessamento = false;
              // this.exibeIncluir = true;
              // this.dialog.success('SGR', 'Fornecedor salvo com sucesso.');
              for (let index = 0; index < this.fornecedordocumentos.length; index++) {
                this.fornecedordocumentos[index].id_fornecedor = this.fornecedor.id;
              }

              this._fornecedordocumentoService.addFornecedorDocumento(this._tokenManager.retrieve(),
                this.fornecedor.id, this.fornecedordocumentos)
                .subscribe( clidoc => {
                  this.fornecedordocumentos.length = 0;
                  this.fornecedordocumentos_ant.length = 0;
                  this.fornecedordocumentosList.length = 0;
                  this.fornecedordocumentos = clidoc;
                  this.fornecedordocumentos_ant = clidoc;
                  this.fornecedordocumentosList = clidoc;
                  this.limpaValidadores();
                  this.emProcessamento = false;
                  this.exibeIncluir = true;
                  this.dialog.success('SGR', 'Fornecedor salvo com sucesso.');
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
    this.fornecedor = new Fornecedor();
    this.fornecedor_ant = new Fornecedor();
    this.fornecedordocumento = new FornecedorDocumento();
    this.fornecedordocumentos.length = 0;
    this.fornecedordocumentos_ant.length = 0;
    this.fornecedordocumentosList.length = 0;
    this.fornecedordocumentoAnexos.length = 0;
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
      const index = this.fornecedordocumentos.findIndex(
        p => p.id_fornecedor === this.fornecedordocumento.id_fornecedor &&
             p.id_tipo_documento === this.fornecedordocumento.id_tipo_documento);

      if ((!isNullOrUndefined(index)) && (index > -1)) {
        mensagem = 'Documento já foi relacionado';
      }
    }

    if (mensagem === '') {
      this.fornecedordocumento.descricao = this.tipodocumentos.find(p => p.id === this.fornecedordocumento.id_tipo_documento).descricao;
      this.fornecedordocumentos.push(this.fornecedordocumento);
      this.limpaValidadores();
      this.fornecedordocumento = new FornecedorDocumento();
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

  remlinha(doc: FornecedorDocumento) {
    if (!isNullOrUndefined(doc.id)) {
      this.dialog.question('SGR', 'Deseja realmente excluir o documento: ' + doc.descricao  + ' ?').subscribe(
      result => {
        if (result.retorno) {
          this._fornecedordocumentoService.deleteFornecedorDocumento(this._tokenManager.retrieve(), doc.id).subscribe(
            data => {
              this.dialog.success('SGR', 'Documento excluído do contrato com sucesso.');
              const index = this.fornecedordocumentos.indexOf(doc);
              this.fornecedordocumentos.splice(index, 1);
              const index2 = this.fornecedordocumentoAnexos.indexOf(doc);
              this.fornecedordocumentoAnexos.splice(index2, 1);
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
          const index = this.fornecedordocumentos.indexOf(doc);
          this.fornecedordocumentos.splice(index, 1);
        }
      });
    }
  }

  editlinha(doc: FornecedorDocumento) {
    this.fornecedordocumento = doc;
    const index = this.fornecedordocumentos.indexOf(doc);
    this.fornecedordocumentos.splice(index, 1);
    this.limpaValidadores();
  }

  uploadAnexo() {
    const fileBrowser = this.fileInput.nativeElement;
    if ((fileBrowser.files.length > 0) && (!isNullOrUndefined(this.id_documento))) {
      const clidoc = this.fornecedordocumentosList.find(p => p.id === this.id_documento);
      this.uploadDocumento(clidoc, fileBrowser.files[0]);
    }
  }

  uploadDocumento(_fornecedorDocumento: FornecedorDocumento, _file: File) {
    this._fornecedordocumentoService.uploadDocumento(this._tokenManager.retrieve(), _fornecedorDocumento, _file).subscribe(
      data => {
        this._fornecedordocumentoService.getFornecedorDocumentoAnexo(this._tokenManager.retrieve(), this.fornecedor.id)
        .subscribe( clidoc => {
          this.fornecedordocumentoAnexos.length = 0;
          this.fornecedordocumentoAnexos = JSON.parse(clidoc._body);
        });
        // console.log('upload ok ' + data.anexo);
      },
      error => {
        console.log('falha no upload ' + error);
      },
    );
  }

  deleteAnexo(doc: FornecedorDocumento) {
    this._fornecedordocumentoService.deleteAnexoDocumento(this._tokenManager.retrieve(), doc.id).subscribe(
      data => {
        this._fornecedordocumentoService.getFornecedorDocumentoAnexo(this._tokenManager.retrieve(), this.fornecedor.id)
        .subscribe( clidoc => {
          this.fornecedordocumentoAnexos.length = 0;
          this.fornecedordocumentoAnexos = JSON.parse(clidoc._body);
        });
      }
    );
  }

  canDeactivate(): Observable<boolean> | boolean {

    if (((JSON.stringify(this.fornecedor) === JSON.stringify(this.fornecedor_ant))) &&
        ((JSON.stringify(this.fornecedordocumentos) === JSON.stringify(this.fornecedordocumentos_ant)))) {
      return true;
    }

    return this.dialog.confirm('Existem dados não salvos. Deseja descarta-los?');
  }


}
