import { TipoTratamentoService } from './../tipotratamento/tipotratamento.service';
import { AcondicionamentoService } from './../acondicionamento/acondicionamento.service';
import { TipoResiduoService } from './../tiporesiduo/tiporesiduo.service';
import { ClasseResiduoService } from './../classeresiduo/classeresiduo.service';
import { Router } from '@angular/router';
import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
import { FormControl } from '@angular/forms';
import { DsResiduo } from './dsresiduo';
import { TokenManagerService } from './../token-manager.service';
import { ResiduoService } from './residuo.service';
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
import { Residuo } from './residuo';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';

@Component({
  selector: 'app-residuo',
  templateUrl: './residuo-list.component.html',
  styleUrls: ['./residuo-list.component.css']
})
export class ResiduoListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'descricao', 'classe_residuo', 'tipo_residuo', 'acondicionamento', 'tratamento'];
  // displayedColumns = ['id', 'codigo', 'descricao', ];
  dataSource: DsResiduo | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  residuos: Residuo[];
  isLoadingResults: boolean;


  idFilter = new FormControl();
  codigoFilter = new FormControl();
  descricaoFilter = new FormControl();
  classeresiduoFilter = new FormControl();
  tiporesiduoFilter = new FormControl();
  acondicionamentoFilter = new FormControl();
  tratamentoFilter = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor(private _residuoService: ResiduoService,
              private _tokenManager: TokenManagerService,
              private dialog: DialogService,
              private _router: Router) {}

  obterClasseResiduos(_id: number) {

    // const token = this._tokenManager.retrieve();
    // this._residuoService.getResiduos(token).subscribe(data => {
    //   this.residuos = data.data;
    //   console.log(data);
    //   console.log(this.residuos.length);
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
    this._router.navigate(['/residuos/residuo', {id: row.id}]);
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
    this._router.navigate(['/residuos/residuo']);
  }


  editarRegistro() {
    if (this.validaSelecao()) {
      this._router.navigate(['/residuos/residuo', {id: this.selectedRow.id}]);
      this.ngOnInit();
      this.selectedRowIndex = -1;
      this.selectedRow = null;
    }
  }

  excluirRegistro() {
    if (this.validaSelecao()) {
      this.dialog.question('SGR', 'Deseja realmente excluir o residuo: ' + this.selectedRow.id + '?').subscribe(
        result => {
          if (result.retorno) {
            this._residuoService.deleteResiduo(this._tokenManager.retrieve(), this.selectedRow.id).subscribe(
              data => {
                this.dialog.success('SGR', 'Residuo excluído com sucesso.');
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

    this.dataSource = new DsResiduo(this._tokenManager, this._residuoService, this.paginator, this.sort);

    const idFilter$ = this.idFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const descricaoFilter$ = this.descricaoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const classeresiduoFilter$ = this.classeresiduoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const tiporesiduoFilter$ = this.tiporesiduoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const acondicionamentoFilter$ = this.acondicionamentoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const tratamentoFilter$ = this.tratamentoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');

    Observable.combineLatest(
      idFilter$,
      descricaoFilter$,
      classeresiduoFilter$,
      tiporesiduoFilter$,
      acondicionamentoFilter$,
      tratamentoFilter$).debounceTime(500).distinctUntilChanged().
    map(
      ([id, descricao, classe_residuo, tipo_residuo, acondicionamento, tratamento ]) =>
      ({id, descricao, classe_residuo, tipo_residuo, acondicionamento, tratamento})).subscribe(filter => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = filter;
      });
  }
}

