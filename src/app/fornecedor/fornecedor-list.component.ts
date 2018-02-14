import { Router } from '@angular/router';
import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
import { FormControl } from '@angular/forms';
import { DsFornecedor } from './dsfornecedor';
import { TokenManagerService } from './../token-manager.service';
import { FornecedorService } from './fornecedor.service';
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
import { Fornecedor } from './fornecedor';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor-list.component.html',
  styleUrls: ['./fornecedor-list.component.css']
})
export class FornecedorListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id',
                      'cnpj_cpf',
                      'razao_social',
                      'contato',
                      'telefone1_numero',
                      'email'
                    ];
  // displayedColumns = ['id', 'codigo', 'descricao'];
  dataSource: DsFornecedor | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  fornecedors: Fornecedor[];
  isLoadingResults: boolean;


  idFilter = new FormControl();
  codigoFilter = new FormControl();
  cnpjCpfFilter = new FormControl();
  razaoSocialFilter = new FormControl();
  contatoFilter = new FormControl();
  telefoneFilter = new FormControl();
  emailFilter = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor(private _fornecedorService: FornecedorService,
              private _tokenManager: TokenManagerService,
              private dialog: DialogService,
              private _router: Router) { }

  obterFornecedors() {
    // const token = this._tokenManager.retrieve();
    // this._fornecedorService.getFornecedors(token).subscribe(data => {
    //   this.fornecedors = data.data;
    //   console.log(data);
    //   console.log(this.fornecedors.length);
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
    this._router.navigate(['/fornecedores/fornecedor', {id: row.id}]);
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
    this._router.navigate(['/fornecedores/fornecedor']);
  }


  editarRegistro() {
    if (this.validaSelecao()) {
      this._router.navigate(['/fornecedores/fornecedor', {id: this.selectedRow.id}]);
      this.ngOnInit();
      this.selectedRowIndex = -1;
      this.selectedRow = null;
    }
  }

  excluirRegistro() {
    if (this.validaSelecao()) {
      this.dialog.question('SGR', 'Deseja realmente excluir o fornecedor: ' + this.selectedRow.id + '?').subscribe(
        result => {
          if (result.retorno) {
            this._fornecedorService.deleteFornecedor(this._tokenManager.retrieve(), this.selectedRow.id).subscribe(
              data => {
                this.dialog.success('SGR', 'Fornecedor excluído com sucesso.');
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

    this.dataSource = new DsFornecedor(this._tokenManager, this._fornecedorService, this.paginator, this.sort);

    const idFilter$ = this.idFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const codigoFilter$ = this.codigoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const cnpjCpfFilter$ = this.cnpjCpfFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const razaoSocialFilter$ = this.razaoSocialFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const contatoFilter$ = this.contatoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const telefoneFilter$ = this.telefoneFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const emailFilter$ = this.emailFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');

    Observable.combineLatest(idFilter$,
                             codigoFilter$,
                             cnpjCpfFilter$,
                             razaoSocialFilter$,
                             contatoFilter$,
                             telefoneFilter$,
                             emailFilter$
                            ).debounceTime(500).distinctUntilChanged().map(
      ([id, codigo_omie, cnpj_cpf, razao_social, contato, telefone, email ]) =>
      ({id, codigo_omie, cnpj_cpf, razao_social, contato, telefone, email})).subscribe(filter => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = filter;
      });
  }
}


