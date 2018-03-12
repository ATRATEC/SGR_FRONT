import { Router } from '@angular/router';
import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
import { FormControl } from '@angular/forms';
import { DsLocacao } from './dslocacao';
import { TokenManagerService } from './../token-manager.service';
import { LocacaoService } from './locacao.service';
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
import { Locacao } from './locacao';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';

@Component({
  selector: 'app-locacao',
  templateUrl: './locacao-list.component.html',
  styleUrls: ['./locacao-list.component.css']
})
export class LocacaoListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'cliente', 'data'];
  // displayedColumns = ['id', 'codigo', 'descricao'];
  dataSource: DsLocacao | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  locacoes: Locacao[];
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
              private _router: Router) {}

  obterLocacaos() {
    // const token = this._tokenManager.retrieve();
    // this._locacaoService.getLocacaos(token).subscribe(data => {
    //   this.locacoes = data.data;
    //   console.log(data);
    //   console.log(this.locacoes.length);
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
    this._router.navigate(['/locacoes/locacao', {id: row.id}]);
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
    this._router.navigate(['/locacoes/locacao']);
  }


  editarRegistro() {
    if (this.validaSelecao()) {
      this._router.navigate(['/locacoes/locacao', {id: this.selectedRow.id}]);
      this.ngOnInit();
      this.selectedRowIndex = -1;
      this.selectedRow = null;
    }
  }

  excluirRegistro() {
    if (this.validaSelecao()) {
      this.dialog.question('SGR', 'Deseja realmente excluir a Locação: ' + this.selectedRow.id + '?').subscribe(
        result => {
          if (result.retorno) {
            this._locacaoService.deleteLocacao(this._tokenManager.retrieve(), this.selectedRow.id).subscribe(
              data => {
                this.dialog.success('SGR', 'Locação excluído com sucesso.');
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

    this.dataSource = new DsLocacao(this._tokenManager, this._locacaoService, this.paginator, this.sort);

    const idFilter$ = this.idFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const clienteFilter$ = this.clienteFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const dataFilter$ = this.dataFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');


    Observable.combineLatest(idFilter$, clienteFilter$, dataFilter$).debounceTime(500).distinctUntilChanged().
    map(
      ([id, cliente, data]) =>
      ({id, cliente, data})).subscribe(filter => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = filter;
      });
  }
}

