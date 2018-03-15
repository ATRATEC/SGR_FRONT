import { Router } from '@angular/router';
import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
import { FormControl } from '@angular/forms';
import { DsCliente } from './dscliente';
import { TokenManagerService } from './../token-manager.service';
import { ClienteService } from './cliente.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataSource} from '@angular/cdk/collections';
import { MatSort } from '@angular/material';
import { MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { Cliente } from './cliente';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id',
                      'cnpj_cpf',
                      'razao_social',
                      'contato',
                      'telefone1_numero',
                      'email',
                      'inativo'
                    ];
  // displayedColumns = ['id', 'codigo', 'descricao'];
  dataSource: DsCliente | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  clientes: Cliente[];
  isLoadingResults: boolean;


  idFilter = new FormControl();
  cnpjCpfFilter = new FormControl();
  razaoSocialFilter = new FormControl();
  contatoFilter = new FormControl();
  telefoneFilter = new FormControl();
  emailFilter = new FormControl();
  inativoFilter = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor(private _clienteService: ClienteService,
              private _tokenManager: TokenManagerService,
              private dialog: DialogService,
              private _router: Router) { }

  obterClientes() {
    // const token = this._tokenManager.retrieve();
    // this._clienteService.getClientes(token).subscribe(data => {
    //   this.clientes = data.data;
    //   console.log(data);
    //   console.log(this.clientes.length);
    //   console.log(token);
    // });
  }

  highlight(row) {
    if (this.selectedRowIndex === row.id) {
      this.selectedRowIndex = -1;
      this.selectedRow = null;
    } else {
      this.selectedRowIndex = row.id;
      this.selectedRow = row;
    }
  }

  dblck(row) {
    this._router.navigate(['/clientes/cliente', {id: row.id}]);
  }


  //#region botões de ação
  btnEditar_click() {
    this.editarRegistro();
  }

  btnIncluir_click() {
    this.incluirRegistro();
  }

  btnExcluir_click() {
    this.excluirRegistro();
  }
  //#endregion

 /**
  * Metodo que verifica se existe registro selecionado na grid.
 */
  validaSelecao(): boolean {
    if (this.selectedRowIndex === -1) {
      this.dialog.warning('SGR', 'Nenhum registro selecionado na grade.');
      return false;
    } else {
      return true;
    }
  }

  incluirRegistro() {
    this._router.navigate(['/clientes/cliente']);
  }


  editarRegistro() {
    if (this.validaSelecao()) {
      this._router.navigate(['/clientes/cliente', {id: this.selectedRow.id}]);
      this.ngOnInit();
      this.selectedRowIndex = -1;
      this.selectedRow = null;
    }
  }

  excluirRegistro() {
    if (this.validaSelecao()) {
      this.dialog.question('SGR', 'Deseja realmente excluir o cliente: ' + this.selectedRow.id + '?').subscribe(
        result => {
          if (result.retorno) {
            this._clienteService.deleteCliente(this._tokenManager.retrieve(), this.selectedRow.id).subscribe(
              data => {
                this.dialog.success('SGR', 'Cliente excluído com sucesso.');
                this.ngOnInit();
              },
              error => {
                this.dialog.error('SGR', 'Erro ao excluir o registro.', error.error + ' - Detalhe: ' + error.message);
              },
            );
            this.selectedRowIndex = -1;
            this.selectedRow = null;
          }
        }
      );
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.onChange.subscribe({next: (event: boolean) => {
      this.isLoadingResults = event;
      // console.log('estatus do datasource: ' + event);
    }});
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Itens por pagina';
    this.paginator._intl.nextPageLabel = 'Próxima Página';
    this.paginator._intl.previousPageLabel = 'Voltar Página';

    this.isLoadingResults = false;

    this.dataSource = new DsCliente(this._tokenManager, this._clienteService, this.paginator, this.sort);

    const idFilter$ = this.idFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const cnpjCpfFilter$ = this.cnpjCpfFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const razaoSocialFilter$ = this.razaoSocialFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const contatoFilter$ = this.contatoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const telefoneFilter$ = this.telefoneFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const emailFilter$ = this.emailFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const inativoFilter$ = this.inativoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');

    Observable.combineLatest(idFilter$,
                             cnpjCpfFilter$,
                             razaoSocialFilter$,
                             contatoFilter$,
                             telefoneFilter$,
                             emailFilter$,
                             inativoFilter$
                            ).debounceTime(500).distinctUntilChanged().map(
      ([id, cnpj_cpf, razao_social, contato, telefone, email, inativo ]) =>
      ({id, cnpj_cpf, razao_social, contato, telefone, email, inativo})).subscribe(filter => {
        if (!this.dataSource) { return; }
        this.dataSource.filtraAtivos = false;
        this.dataSource.filter = filter;
      });
  }
}


