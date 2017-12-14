import { Router } from '@angular/router';
import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
import { FormControl } from '@angular/forms';
import { DsAcondicionamento } from './dsacondicionamento';
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
import { Acondicionamento } from './acondicionamento';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';

@Component({
  selector: 'app-acondicionamento',
  templateUrl: './acondicionamento-list.component.html',
  styleUrls: ['./acondicionamento-list.component.css']
})
export class AcondicionamentoListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['codigo', 'descricao'];
  // displayedColumns = ['id', 'codigo', 'descricao'];
  dataSource: DsAcondicionamento | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  acondicionamentos: Acondicionamento[];
  isLoadingResults: boolean;


  idFilter = new FormControl();
  codigoFilter = new FormControl();
  descricaoFilter = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor(private _acondicionamentoService: AcondicionamentoService,
              private _tokenManager: TokenManagerService,
              private dialog: DialogService,
              private _router: Router) {}

  obterAcondicionamentos() {
    // const token = this._tokenManager.retrieve();
    // this._acondicionamentoService.getAcondicionamentos(token).subscribe(data => {
    //   this.acondicionamentos = data.data;
    //   console.log(data);
    //   console.log(this.acondicionamentos.length);
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
    this._router.navigate(['/acondicionamentos/acondicionamento', {id: row.id}]);
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
    this._router.navigate(['/acondicionamentos/acondicionamento']);
  }


  editarRegistro() {
    if (this.validaSelecao()) {
      this._router.navigate(['/acondicionamentos/acondicionamento', {id: this.selectedRow.id}]);
      this.ngOnInit();
      this.selectedRowIndex = -1;
      this.selectedRow = null;
    }
  }

  excluirRegistro() {
    if (this.validaSelecao()) {
      this.dialog.question('SGR', 'Deseja realmente excluir o acondicionamento: ' + this.selectedRow.id + '?').subscribe(
        result => {
          if (result.retorno) {
            this._acondicionamentoService.deleteAcondicionamento(this._tokenManager.retrieve(), this.selectedRow.id).subscribe(
              data => {
                this.dialog.success('SGR', 'Acondicionamento excluído com sucesso.');
                this.ngOnInit();
              },
              error => {
                this.dialog.error('SGR', 'Erro ao excluir o registro. msg: ' + error.error);
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

    this.dataSource = new DsAcondicionamento(this._tokenManager, this._acondicionamentoService, this.paginator, this.sort);

    const idFilter$ = this.idFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const codigoFilter$ = this.codigoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const descricaoFilter$ = this.descricaoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');

    Observable.combineLatest(idFilter$, codigoFilter$, descricaoFilter$).debounceTime(500).distinctUntilChanged().
    map(
      ([id, codigo, descricao ]) => ({id, codigo, descricao})).subscribe(filter => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = filter;
      });
  }
}

