import { isNullOrUndefined } from 'util';
import { isEmpty } from 'rxjs/operators';
import { Data } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
import { DsLocacao } from './dslocacao';
import { TokenManagerService } from './../token-manager.service';
import { LocacaoService } from './locacao.service';
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
import { Locacao } from './locacao';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';

@Component({
  selector: 'app-locacao-find',
  templateUrl: './locacao-find.component.html',
  styleUrls: ['./locacao-find.component.css']
})
export class LocacaoFindComponent implements OnInit, AfterViewInit {

  displayedColumns = ['id', 'cliente', 'data'];
  // displayedColumns = ['id', 'codigo', 'descricao'];
  dataSource: DsLocacao | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  locacaos: Locacao[];
  isLoadingResults: boolean;


  idFilter = new FormControl();
  clienteFilter = new FormControl();
  dataFilter = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor(private _locacaoService: LocacaoService,
              private _tokenManager: TokenManagerService,
              private dialog: DialogService,
              private _router: Router,
              public dialogLoginRef: MatDialogRef<LocacaoFindComponent>,
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
    // this._router.navigate(['/locacaoes/locacao', {id: row.id}]);
    this.retornarPesquisa(row);
  }

  btnOkClick() {
    if (this.validaSelecao()) {
      this.retornarPesquisa(this.selectedRow);
    }
  }

  retornarPesquisa(row) {
    this.data.id = row.id;
    this.data.descricao = row.descricao;
    this.dialogLoginRef.close(this.data);
  }

  btnCancelarClick() {
    this.data.id = null;
    this.data.descricao = null;
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

    this.dataSource = new DsLocacao(this._tokenManager, this._locacaoService, this.paginator, this.sort);

    const idFilter$ = this.idFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const clienteFilter$ = this.clienteFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const dataFilter$ = this.dataFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');

    Observable.combineLatest(idFilter$, clienteFilter$,
                            dataFilter$).debounceTime(500).distinctUntilChanged().
    map(
      ([id, cliente, data]) =>
      ({id, cliente, data})).subscribe(filter => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = filter;
      });
  }

}
