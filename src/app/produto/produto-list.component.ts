import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
// import { Observable } from 'rxjs/Rx';
import { FormControl } from '@angular/forms';
import { DsProduto } from './dsproduto';
import { TokenManagerService } from './../token-manager.service';
import { ProdutoService } from './produto.service';
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
import { Produto } from './produto';
import { ChangeDetectorRef } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
// import { DialogComponent } from '../dialog/dialog.component';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-produto',
  templateUrl: './produto-list.component.html',
  styleUrls: ['./produto-list.component.css']
})
export class ProdutoListComponent implements OnInit {
  displayedColumns = ['id', 'codigo_produto', 'descricao', 'unidade', 'quantidade_estoque'];
  // selection = new SelectionModel<string>(true, []);
  dataSource: DsProduto | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  produtos: Produto[];


  idFilter = new FormControl();
  codigoFilter = new FormControl();
  descricaoFilter = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    // console.log(inputChar, e.charCode);
       if (!pattern.test(inputChar)) {
       // invalid character, prevent input
           event.preventDefault();
      }
 }
  // @ViewChild('filter') filter: ElementRef;

  // isAllSelected(): boolean {
  //   if (!this.dataSource) { return false; }
  //   if (this.selection.isEmpty()) { return false; }

  //   if (this.filter.nativeElement.value) {
  //     return this.selection.selected.length === this.dataSource.renderedData.length;
  //   } else {
  //     return this.selection.selected.length === this.exampleDatabase.data.length;
  //   }
  // }

  // masterToggle() {
  //   if (!this.dataSource) { return; }

  //   if (this.isAllSelected()) {
  //     this.selection.clear();
  //   } else if (this.filter.nativeElement.value) {
  //     this.dataSource.renderedData.forEach(data => this.selection.select(data.id));
  //   } else {
  //     this.exampleDatabase.data.forEach(data => this.selection.select(data.id));
  //   }
  // }

  constructor(private _produtoService: ProdutoService,
              private _tokenManager: TokenManagerService,
              private dialog: DialogService) {}

  obterProdutos() {
    // const token = this._tokenManager.retrieve();
    // this._produtoService.getProdutos(token).subscribe(data => {
    //   this.produtos = data.data;
    //   console.log(data);
    //   console.log(this.produtos.length);
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


  //#region botões de ação
  btnEditar_click() {
    this.editarRegistro();
  }

  btnIncluir_click() {
    this.incluirRegistro();
  }

  btnExcluir_click() {
    // alert('Excluir');
    // this.ngOnInit();
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
      // alert('Produto para selecionado para exclusão ' + this.selectedRow.codigo_produto);
      // this.ngOnInit();
      // this.selectedRowIndex = -1;
      // this.selectedRow = null;
    }
  }

  incluirRegistro() {

  }


  editarRegistro() {
    if (this.validaSelecao()) {
      // alert('Produto para selecionado para edição ' + this.selectedRow.codigo_produto);
      this.ngOnInit();
      this.selectedRowIndex = -1;
      this.selectedRow = null;
    }
  }

  excluirRegistro() {
    if (this.validaSelecao()) {
      this.dialog.question('SGR', 'Deseja realmente excluir o produto:' + this.selectedRow.id).subscribe(
        result => {
          if (result.retorno) {
            this._produtoService.deleteProduto(this._tokenManager.retrieve(), this.selectedRow.id).subscribe(
              data => {
                this.dialog.success('SGR', 'Produto excluído com sucesso.');
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
      // alert('Produto para selecionado para exclusão ' + this.selectedRow.codigo_produto);
    }
  }

  ngOnInit() {
    // this.dataSource = new ExampleDataSource(this.exampleDatabase, this.sort);
    this.paginator._intl.itemsPerPageLabel = 'Itens por pagina';
    this.paginator._intl.nextPageLabel = 'Próxima Página';
    this.paginator._intl.previousPageLabel = 'Voltar Página';

    this.dataSource = new DsProduto(this._tokenManager, this._produtoService, this.paginator, this.sort);

    const idFilter$ = this.idFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const codigoFilter$ = this.codigoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const descricaoFilter$ = this.descricaoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');

    Observable.combineLatest(idFilter$, codigoFilter$, descricaoFilter$).debounceTime(500).distinctUntilChanged().
    map(
      ([id, codigo, descricao ]) => ({id, codigo, descricao})).subscribe(filter => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = filter;
      });
    // this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    // Observable.fromEvent(this.filter.nativeElement, 'keyup')
    //     .debounceTime(150)
    //     .distinctUntilChanged()
    //     .subscribe(() => {
    //       if (!this.dataSource) { return; }
    //       this.dataSource.filter = this.filter.nativeElement.value;
    //     });

  }
}

/** Constants used to fill up our data base. */
// const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
// 'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
// const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
// 'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
// 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

// export interface UserData {
// id: string;
// name: string;
// progress: string;
// color: string;
// }

/** An example database that the data source uses to retrieve data for the table. */
// export class ExampleDatabase {
//   /** Stream that emits whenever the data has been modified. */
//   dataChange: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);
//   get data(): UserData[] { return this.dataChange.value; }

//   constructor() {
//     // Fill up the database with 100 users.
//     for (let i = 0; i < 100; i++) { this.addUser(); }
//   }

//   /** Adds a new user to the database. */
//   addUser() {
//     const copiedData = this.data.slice();
//     copiedData.push(this.createNewUser());
//     this.dataChange.next(copiedData);
//   }

//   /** Builds and returns a new User. */
//   private createNewUser() {
//     const name =
//         NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
//         NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

//     return {
//       id: (this.data.length + 1).toString(),
//       name: name,
//       progress: Math.round(Math.random() * 100).toString(),
//       color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
//     };
//   }
// }

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
// export class ExampleDataSource extends DataSource<any> {
//   _filterChange = new BehaviorSubject('');
//   get filter(): string { return this._filterChange.value; }
//   set filter(filter: string) { this._filterChange.next(filter); }

//   filteredData: UserData[] = [];
//   renderedData: UserData[] = [];

//   constructor(private _exampleDatabase: ExampleDatabase,
//               private _paginator: MatPaginator,
//               private _sort: MatSort) {
//     super();

//     // Reset to the first page when the user changes the filter.
//     this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
//   }

//   /** Connect function called by the table to retrieve one stream containing the data to render. */
//   connect(): Observable<UserData[]> {
//     // Listen for any changes in the base data, sorting, filtering, or pagination
//     const displayDataChanges = [
//       this._exampleDatabase.dataChange,
//       this._sort.sortChange,
//       this._filterChange,
//       this._paginator.page,
//     ];

//     return Observable.merge(...displayDataChanges).map(() => {
//       // Filter data
//       this.filteredData = this._exampleDatabase.data.slice().filter((item: UserData) => {
//         let searchStr = (item.name + item.color).toLowerCase();
//         return searchStr.indexOf(this.filter.toLowerCase()) != -1;
//       });

//       // Sort filtered data
//       const sortedData = this.sortData(this.filteredData.slice());

//       // Grab the page's slice of the filtered sorted data.
//       const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
//       this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
//       return this.renderedData;
//     });
//   }

//   disconnect() {}

//   /** Returns a sorted copy of the database data. */
//   sortData(data: UserData[]): UserData[] {
//     if (!this._sort.active || this._sort.direction === '') { return data; }

//     return data.sort((a, b) => {
//       let propertyA: number|string = '';
//       let propertyB: number|string = '';

//       switch (this._sort.active) {
//         case 'userId': [propertyA, propertyB] = [a.id, b.id]; break;
//         case 'userName': [propertyA, propertyB] = [a.name, b.name]; break;
//         case 'progress': [propertyA, propertyB] = [a.progress, b.progress]; break;
//         case 'color': [propertyA, propertyB] = [a.color, b.color]; break;
//       }

//       let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
//       let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

//       return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
//     });
//   }
// }

