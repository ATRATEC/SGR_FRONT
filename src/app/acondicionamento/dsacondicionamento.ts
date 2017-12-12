import { TokenManagerService } from './../token-manager.service';
import { AcondicionamentoService } from './acondicionamento.service';
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
import { Acondicionamento, AcondicionamentoFilter } from './acondicionamento';

export class DsAcondicionamento extends DataSource<Acondicionamento> {
  _filterChange = new BehaviorSubject( {id: '', codigo: '', descricao: ''} );

  get filter(): AcondicionamentoFilter {
    return this._filterChange.value;
  }

  set filter(filter: AcondicionamentoFilter) {
    this._filterChange.next(filter);
  }

  resultsLength = 0;
  isLoadingResults: boolean;

  paginaInicial: number;
  paginaAtual: number;
  paginaFinal: number;
  registroDe: number;
  registroAte: number;
  nrRegistros: number;

  constructor(private _tokenManager: TokenManagerService,
              private _acondicionamentoService: AcondicionamentoService,
              private _paginator: MatPaginator,
              private _sort: MatSort) {
    super();
    this.isLoadingResults = false;
  }
  connect(): Observable<Acondicionamento[]> {
    const displayDataChanges = [
      this._sort.sortChange,
      this._paginator.page,
      this._filterChange,
    ];
    this._sort.sortChange.subscribe(() => this._paginator.pageIndex = 0);

    return Observable.merge(...displayDataChanges)
    .startWith(null)
    .switchMap(() => {
      this.isLoadingResults = true;
      return this._acondicionamentoService.getAcondicionamentos(this._tokenManager.retrieve(),
        this._sort.active, this._sort.direction, this._paginator.pageIndex, this._paginator.pageSize, this.filter);
    })
    .map(data => {
      // Flip flag to show that loading has finished.
      this.isLoadingResults = false;
      this.paginaInicial = 1;
      this.paginaFinal = data.last_page;
      this.registroDe = data.from;
      this.registroAte = data.to;
      this.nrRegistros = data.total;
      return data.data;
    })
    .catch(() => {
      this.isLoadingResults = false;
      return Observable.of([]);
    });
  }
  disconnect(): void {

  }
}
