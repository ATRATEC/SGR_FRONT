import { Router } from '@angular/router';
import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
import { FormControl } from '@angular/forms';
import { DsPesagem } from './dspesagem';
import { TokenManagerService } from './../token-manager.service';
import { PesagemService } from './pesagem.service';
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
import { Pesagem } from './pesagem';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';

@Component({
  selector: 'app-pesagem',
  templateUrl: './pesagem-list.component.html',
  styleUrls: ['./pesagem-list.component.css']
})
export class PesagemListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'data', 'cliente', 'descricao'];
  // displayedColumns = ['id', 'codigo', 'descricao'];
  dataSource: DsPesagem | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  pesagems: Pesagem[];
  isLoadingResults: boolean;


  idFilter = new FormControl();
  numeroFilter = new FormControl();
  clienteFilter = new FormControl();
  dataFilter = new FormControl();
  contratoFilter = new FormControl();
  transportadorFilter = new FormControl();
  destinadorFilter = new FormControl();


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
              private _router: Router) {}

  obterPesagems() {
    // const token = this._tokenManager.retrieve();
    // this._pesagemService.getPesagems(token).subscribe(data => {
    //   this.pesagems = data.data;
    //   console.log(data);
    //   console.log(this.pesagems.length);
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
    this._router.navigate(['/pesagens/pesagem', {id: row.id}]);
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
    this._router.navigate(['/pesagens/pesagem']);
  }


  editarRegistro() {
    if (this.validaSelecao()) {
      this._router.navigate(['/pesagens/pesagem', {id: this.selectedRow.id}]);
      this.ngOnInit();
      this.selectedRowIndex = -1;
      this.selectedRow = null;
    }
  }

  excluirRegistro() {
    if (this.validaSelecao()) {
      this.dialog.question('SGR', 'Deseja realmente excluir o Pesagem: ' + this.selectedRow.id + '?').subscribe(
        result => {
          if (result.retorno) {
            this._pesagemService.deletePesagem(this._tokenManager.retrieve(), this.selectedRow.id).subscribe(
              data => {
                this.dialog.success('SGR', 'Pesagem excluído com sucesso.');
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

    this.dataSource = new DsPesagem(this._tokenManager, this._pesagemService, this.paginator, this.sort);

    const idFilter$ = this.idFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const clienteFilter$ = this.clienteFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const dataFilter$ = this.dataFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const contratoFilter$ = this.contratoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');

    Observable.combineLatest(idFilter$, clienteFilter$, dataFilter$, contratoFilter$).debounceTime(500).distinctUntilChanged().
    map(
      ([id, cliente, data, descricao]) =>
      ({id, cliente, data, descricao})).subscribe(filter => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = filter;
      });
  }
}

