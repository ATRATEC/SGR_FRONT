import { Router } from '@angular/router';
import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
import { FormControl } from '@angular/forms';
import { DsClienteDocumento } from './dsclientedocumento';
import { TokenManagerService } from './../token-manager.service';
import { ClienteDocumentoService } from './clientedocumento.service';
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
import { ClienteDocumento } from './clientedocumento';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';

@Component({
  selector: 'app-clientedocumento',
  templateUrl: './clientedocumento-list.component.html',
  styleUrls: ['./clientedocumento-list.component.css']
})
export class ClienteDocumentoListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'descricao', 'razao_social', 'numero', 'emissao', 'vencimento'];
  // displayedColumns = ['id', 'codigo', 'descricao'];
  dataSource: DsClienteDocumento | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  clientedocumentos: ClienteDocumento[];
  isLoadingResults: boolean;


  idFilter = new FormControl();
  descricaoFilter = new FormControl();
  razaosocialFilter = new FormControl();
  numeroFilter = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor(private _clientedocumentoService: ClienteDocumentoService,
              private _tokenManager: TokenManagerService,
              private dialog: DialogService,
              private _router: Router) {}

  obterClienteDocumentos() {
    // const token = this._tokenManager.retrieve();
    // this._clientedocumentoService.getClienteDocumentos(token).subscribe(data => {
    //   this.clientedocumentos = data.data;
    //   console.log(data);
    //   console.log(this.clientedocumentos.length);
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
    this._router.navigate(['/clientedocumentos/clientedocumento', {id: row.id}]);
  }


  //#region botões de ação
  btnEditar_click() {
    this.editarRegistro();
  }

  btnIncluir_click() {
    this.incluirRegistro();
  }

  btnIncluirLote_click() {
    this.incluirLoteRegistro();
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
    this._router.navigate(['/clientedocumentos/clientedocumento']);
  }

  incluirLoteRegistro() {
    this._router.navigate(['/clientedocumentos/clientedocumentolote']);
  }


  editarRegistro() {
    if (this.validaSelecao()) {
      this._router.navigate(['/clientedocumentos/clientedocumento', {id: this.selectedRow.id}]);
      this.ngOnInit();
      this.selectedRowIndex = -1;
      this.selectedRow = null;
    }
  }

  excluirRegistro() {
    if (this.validaSelecao()) {
      this.dialog.question('SGR', 'Deseja realmente excluir o clientedocumento: ' + this.selectedRow.id + '?').subscribe(
        result => {
          if (result.retorno) {
            this._clientedocumentoService.deleteClienteDocumento(this._tokenManager.retrieve(), this.selectedRow.id).subscribe(
              data => {
                this.dialog.success('SGR', 'ClienteDocumento excluído com sucesso.');
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

    this.dataSource = new DsClienteDocumento(this._tokenManager, this._clientedocumentoService, this.paginator, this.sort);

    const idFilter$ = this.idFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const descricaoFilter$ = this.descricaoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const razaosocialFilter$ = this.razaosocialFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const numeroFilter$ = this.numeroFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');

    Observable.combineLatest(idFilter$, descricaoFilter$, razaosocialFilter$, numeroFilter$).debounceTime(500).distinctUntilChanged().
    map(
      ([id, descricao, razao_social, numero ]) => ({id, descricao, razao_social, numero})).subscribe(filter => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = filter;
      });
  }
}

