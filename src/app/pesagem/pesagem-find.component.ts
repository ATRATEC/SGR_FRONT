import { isNullOrUndefined } from 'util';
import { isEmpty } from 'rxjs/operators';
import { Data } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
import { DsPesagem } from './dspesagem';
import { TokenManagerService } from './../token-manager.service';
import { PesagemService } from './pesagem.service';
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
import { Pesagem } from './pesagem';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';

@Component({
  selector: 'app-pesagem-find',
  templateUrl: './pesagem-find.component.html',
  styleUrls: ['./pesagem-find.component.css']
})
export class PesagemFindComponent implements OnInit, AfterViewInit {

  displayedColumns = ['id', 'data', 'cliente', 'descricao'];
  // displayedColumns = ['id', 'codigo', 'descricao'];
  dataSource: DsPesagem | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  pesagems: Pesagem[];
  isLoadingResults: boolean;


  idFilter = new FormControl();
  clienteFilter = new FormControl();
  dataFilter = new FormControl();
  contratoFilter = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor(private _pesagemService: PesagemService,
              private _tokenManager: TokenManagerService,
              private dialog: DialogService,
              private _router: Router,
              public dialogLoginRef: MatDialogRef<PesagemFindComponent>,
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
    // this._router.navigate(['/pesagemes/pesagem', {id: row.id}]);
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

    this.dataSource = new DsPesagem(this._tokenManager, this._pesagemService, this.paginator, this.sort);

    const idFilter$ = this.idFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const clienteFilter$ = this.clienteFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const dataFilter$ = this.dataFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const contratoFilter$ = this.contratoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');



    Observable.combineLatest(idFilter$, dataFilter$, clienteFilter$, contratoFilter$).debounceTime(500).distinctUntilChanged().
    map(
      ([id, data, cliente, descricao]) =>
      ({id, data, cliente, descricao})).subscribe(filter => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = filter;
      });
  }

}
