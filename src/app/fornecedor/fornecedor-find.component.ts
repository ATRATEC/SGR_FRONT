import { isNullOrUndefined } from 'util';
import { isEmpty } from 'rxjs/operators';
import { Data } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
import { DsFornecedor } from './dsfornecedor';
import { TokenManagerService } from './../token-manager.service';
import { FornecedorService } from './fornecedor.service';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
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
  selector: 'app-fornecedor-find',
  templateUrl: './fornecedor-find.component.html',
  styleUrls: ['./fornecedor-find.component.css']
})
export class FornecedorFindComponent implements OnInit, AfterViewInit {

  displayedColumns = ['codigo_omie',
                      'cnpj_cpf',
                      'razao_social'
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

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor(private _fornecedorService: FornecedorService,
              private _tokenManager: TokenManagerService,
              private dialog: DialogService,
              private _router: Router,
              public dialogLoginRef: MatDialogRef<FornecedorFindComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
            ) { }

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
    // this._router.navigate(['/fornecedores/fornecedor', {id: row.id}]);
    this.retornarPesquisa(row);
  }

  btnOkClick() {
    if (this.validaSelecao()) {
      this.retornarPesquisa(this.selectedRow);
    }
  }

  retornarPesquisa(row) {
    this.data.id = row.id;
    this.data.razao_social = row.razao_social;
    this.dialogLoginRef.close(this.data);
  }

  btnCancelarClick() {
    this.data.id = null;
    this.data.razao_social = null;
    this.dialogLoginRef.close(this.data);
  }

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
