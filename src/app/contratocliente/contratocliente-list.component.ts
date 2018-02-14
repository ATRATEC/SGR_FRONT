import { Router } from '@angular/router';
import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
import { FormControl } from '@angular/forms';
import { DsContratoCliente } from './dscontratocliente';
import { TokenManagerService } from './../token-manager.service';
import { ContratoClienteService } from './contratocliente.service';
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
import { ContratoCliente } from './contratocliente';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';

@Component({
  selector: 'app-contratocliente',
  templateUrl: './contratocliente-list.component.html',
  styleUrls: ['./contratocliente-list.component.css']
})
export class ContratoClienteListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'descricao', 'cliente', 'vigencia_inicio', 'vigencia_final'];
  // displayedColumns = ['id', 'codigo', 'descricao'];
  dataSource: DsContratoCliente | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  contratoclientes: ContratoCliente[];
  isLoadingResults: boolean;


  idFilter = new FormControl();
  idclienteFilter = new FormControl();
  descricaoFilter = new FormControl();
  clienteFilter = new FormControl();
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

  constructor(private _contratoclienteService: ContratoClienteService,
              private _tokenManager: TokenManagerService,
              private dialog: DialogService,
              private _router: Router) {}

  obterContratoClientes() {
    // const token = this._tokenManager.retrieve();
    // this._contratoclienteService.getContratoClientes(token).subscribe(data => {
    //   this.contratoclientes = data.data;
    //   console.log(data);
    //   console.log(this.contratoclientes.length);
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
    this._router.navigate(['/contratoclientes/contratocliente', {id: row.id}]);
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
    this._router.navigate(['/contratoclientes/contratocliente']);
  }


  editarRegistro() {
    if (this.validaSelecao()) {
      this._router.navigate(['/contratoclientes/contratocliente', {id: this.selectedRow.id}]);
      this.ngOnInit();
      this.selectedRowIndex = -1;
      this.selectedRow = null;
    }
  }

  excluirRegistro() {
    if (this.validaSelecao()) {
      this.dialog.question('SGR', 'Deseja realmente excluir o contratocliente: ' + this.selectedRow.id + '?').subscribe(
        result => {
          if (result.retorno) {
            this._contratoclienteService.deleteContratoCliente(this._tokenManager.retrieve(), this.selectedRow.id).subscribe(
              data => {
                this.dialog.success('SGR', 'Contrato de Cliente excluído com sucesso.');
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

    this.dataSource = new DsContratoCliente(this._tokenManager, this._contratoclienteService, this.paginator, this.sort);

    const idFilter$ = this.idFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const idclienteFilter$ = this.idclienteFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const descricaoFilter$ = this.descricaoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const clienteFilter$ = this.clienteFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const vigenciaInicioFilter$ = this.vigenciaInicioFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const vigenciaFinalFilter$ = this.vigenciaFinalFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');

    Observable.combineLatest(idFilter$, idclienteFilter$, descricaoFilter$, clienteFilter$,
                            vigenciaInicioFilter$, vigenciaFinalFilter$).debounceTime(500).distinctUntilChanged().
    map(
      ([id, id_cliente, descricao, cliente, vigencia_inicio, vigencia_final]) =>
      ({id, id_cliente, descricao, cliente, vigencia_inicio, vigencia_final})).subscribe(filter => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = filter;
      });
  }
}

