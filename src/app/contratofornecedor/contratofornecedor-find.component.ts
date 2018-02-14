import { DsContratoFornecedorFind } from './dscontratofornecedorfind';
import { isNullOrUndefined } from 'util';
import { isEmpty } from 'rxjs/operators';
import { Data } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
import { DsContratoFornecedor } from './dscontratofornecedor';
import { TokenManagerService } from './../token-manager.service';
import { ContratoFornecedorService } from './contratofornecedor.service';
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
import { ContratoFornecedor } from './contratofornecedor';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';

@Component({
  selector: 'app-contratofornecedor-find',
  templateUrl: './contratofornecedor-find.component.html',
  styleUrls: ['./contratofornecedor-find.component.css']
})
export class ContratoFornecedorFindComponent implements OnInit, AfterViewInit {

  displayedColumns = ['id', 'descricao', 'fornecedor', 'vigencia_inicio', 'vigencia_final'];
  // displayedColumns = ['id', 'codigo', 'descricao'];
  dataSource: DsContratoFornecedorFind | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  contratofornecedors: ContratoFornecedor[];
  isLoadingResults: boolean;


  idFilter = new FormControl();
  descricaoFilter = new FormControl();
  clienteFilter = new FormControl();
  idclienteFilter = new FormControl();
  fornecedorFilter = new FormControl();
  idtipoatividadeFilter = new FormControl();
  vigenciaInicioFilter = new FormControl();
  vigenciaFinalFilter = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor(private _contratofornecedorService: ContratoFornecedorService,
              private _tokenManager: TokenManagerService,
              private dialog: DialogService,
              private _router: Router,
              public dialogLoginRef: MatDialogRef<ContratoFornecedorFindComponent>,
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
    // this._router.navigate(['/contratofornecedores/contratofornecedor', {id: row.id}]);
    this.retornarPesquisa(row);
  }

  btnOkClick() {
    if (this.validaSelecao()) {
      this.retornarPesquisa(this.selectedRow);
    }
  }

  retornarPesquisa(row) {
    this.data.id = row.id;
    this.data.descricao = row.fornecedor;
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

    this.dataSource = new DsContratoFornecedorFind(this._tokenManager, this._contratofornecedorService, this.paginator, this.sort);

    const idFilter$ = this.idFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const descricaoFilter$ = this.descricaoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const clienteFilter$ = this.clienteFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const idclienteFilter$ = this.idclienteFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const idtipoatividadeFilter$ = this.idtipoatividadeFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const fornecedorFilter$ = this.fornecedorFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const vigenciaInicioFilter$ = this.vigenciaInicioFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const vigenciaFinalFilter$ = this.vigenciaFinalFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');


    Observable.combineLatest(idFilter$, descricaoFilter$, clienteFilter$, idclienteFilter$, fornecedorFilter$, idtipoatividadeFilter$,
                            vigenciaInicioFilter$, vigenciaFinalFilter$).debounceTime(500).distinctUntilChanged().
    map(
      ([id, descricao, cliente, id_cliente, fornecedor, id_tipo_atividade, vigencia_inicio, vigencia_final]) =>
      ({id, descricao, cliente, id_cliente, fornecedor, id_tipo_atividade, vigencia_inicio, vigencia_final})).subscribe(filter => {
        if (!this.dataSource) { return; }

        if (!isNullOrUndefined(this.data.id_cliente)) {
          filter.id_cliente = this.data.id_cliente;
        }

        if (!isNullOrUndefined(this.data.id_tipo_atividade)) {
          filter.id_tipo_atividade = this.data.id_tipo_atividade;
        }

        this.dataSource.filter = filter;
      });
  }

}
