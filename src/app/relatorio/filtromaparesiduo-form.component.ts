import { ResiduoService } from './../residuo/residuo.service';
import { Residuo } from './../residuo/residuo';
import { ManifestoFindComponent } from './../manifesto/manifesto-find.component';
import { ManifestoService } from './../manifesto/manifesto.service';
import { Manifesto } from './../manifesto/manifesto';
import { ContratoClienteService } from './../contratocliente/contratocliente.service';
import { ClienteFindComponent } from './../cliente/cliente-find.component';
import { ClienteService } from './../cliente/cliente.service';
import { environment } from './../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { Component, OnInit, AfterViewInit, AfterViewChecked, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { by, element } from 'protractor';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { ChangeDetectorRef, ViewChildren, ViewChild, ElementRef } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Cliente } from '../cliente/cliente';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_LOCALE,
         MAT_DATE_FORMATS,  FloatPlaceholderType } from '@angular/material';
import { Servico } from '../servico/servico';
import { FormBuilder, FormGroup} from '@angular/forms';
import { ContratoFornecedor } from '../contratofornecedor/contratofornecedor';
import { RelatorioService } from './relatorio.service';
import { FiltroRelatorio } from './filtrorelatorio';
import { DateValidator } from '../datevalidator';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-filtromaparesiduo-form',
  templateUrl: './filtromaparesiduo-form.component.html',
  styleUrls: ['./filtromaparesiduo-form.component.css']
})
export class FiltroMapaResiduoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  filtrorelatorio: FiltroRelatorio;
  emProcessamento = false;
  exibeIncluir = false;
  residuos: Residuo[];

  valCodigo = new FormControl('', [Validators.required]);
  valDataDe = new FormControl('', [Validators.required]);
  valDataAte = new FormControl('', Validators.compose([Validators.required, DateValidator.afterDate(this.valDataDe)]));

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;

  constructor(private _relatorioService: RelatorioService,
    private _clienteService: ClienteService,
    private _manifestoService: ManifestoService,
    private _contratoclienteService: ContratoClienteService,
    private _residuoService: ResiduoService,
    private _tokenManager: TokenManagerService,
    private _router: Router,
    private _route: ActivatedRoute,
    private dialog: DialogService,
    private pesquisa: MatDialog) {}

    validaCampos() {
      return this.valCodigo.valid && this.valDataDe.valid && this.valDataAte.valid;
    }

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  ngOnInit() {
    // this.emProcessamento = true;
    this.filtrorelatorio = new FiltroRelatorio();

    // this._route.data.subscribe(data => {
    //   console.log(data.objeto);
    // });

    // console.log(this._route.snapshot.paramMap.get('mensagem'));

    this._residuoService.getListResiduos(this._tokenManager.retrieve()).subscribe(
      data => {
        this.residuos = JSON.parse(data._body);
      }
    );




    // const ta = this._tipoatividadeService.getListTipoAtividades(this._tokenManager.retrieve())
    //   .retry(3)
    //   .subscribe(
    //     data => {
    //       this.tipoatividades = JSON.parse(data._body);
    //       // console.log(2);
    //       this._route.params.forEach((params: Params) => {
    //         const id: number = +params['id'];
    //         if (id) {
    //           this._relatorioService.getRelatorio(this._tokenManager.retrieve(), id)
    //           .retry(3)
    //           .subscribe( dt => {
    //             this.relatorio = JSON.parse(dt._body);
    //             // console.log(1);
    //             this.emProcessamento = false;
    //           });
    //         } else {
    //           this.emProcessamento = false;
    //         }
    //       });
    //     },
    //     error => {
    //       this.emProcessamento = false;
    //       this.dialog.error('SGR', 'Erro ao carregar o registro.', error.error + ' - Detalhe: ' + error.message);
    //     }
    //   );
    const idFilter$ = this.valCodigo.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    Observable.combineLatest(idFilter$).debounceTime(500).distinctUntilChanged().map(([id]) => ({ id })).subscribe(filter => {
        this.buscaCliente(filter);
      });
  }

  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {
    // this.vc.first.nativeElement.focus();
    // Promise.resolve(null).then(() => this.focuscomp.nativeElement.focus());
  }

  getCodigoErrorMessage() {
    let mensagem = '';

    if (this.valCodigo.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  btnFiltrar_click() {
    if (this.validaCampos()) {
      this._router.navigate(['/relatorios/relmaparesiduos', {
        id: this.filtrorelatorio.id,
        id_cliente: this.filtrorelatorio.id_cliente,
        cliente: this.filtrorelatorio.cliente,
        receita: this.filtrorelatorio.receita,
        despesa: this.filtrorelatorio.despesa,
        agrupar_classe: this.filtrorelatorio.agrupar_classe,
        id_residuo: this.filtrorelatorio.id_residuo,
        datade: this.filtrorelatorio.datade,
        dataate: this.filtrorelatorio.dataate,
        descricao: this.filtrorelatorio.descricao,
        id_manifesto: this.filtrorelatorio.id_manifesto,
        manifesto: this.filtrorelatorio.manifesto
      }], { skipLocationChange: true });
    } else {
      let campos = '';
      if (this.valCodigo.invalid) {
        campos = 'Cliente';
      }
      if (this.valDataDe.invalid) {
        if (campos !== '') {
          campos = campos + ', Data Inicio Coleta';
        } else {
          campos = campos + 'Data Inicio Coleta';
        }
      }
      if (this.valDataAte.invalid) {
        if (campos !== '') {
          campos = campos + ', Data Final Coleta';
        } else {
          campos = campos + 'Data Final Coleta';
        }
      }
      this.dialog.warning('SGR', 'Campos obrigatórios não preenchidos', 'Campo(s): ' + campos);
    }

    // window.print();
    // this.emProcessamento = true;
    // this._relatorioService
    //   .getRelatorioRelatorioCliente(this._tokenManager.retrieve(), this.relatorio)
    //   .subscribe(data => {
    //     this.emProcessamento = false;
    //     const fileUrl = URL.createObjectURL(data);
    //     const tab = window.open();
    //     tab.location.href = fileUrl;
    //   },
    //   error => {
    //     this.emProcessamento = false;
    //     const err = new HttpErrorResponse(error);
    //     console.log(err);
    //     this.dialog.error('SGR', 'Erro ao gerar o relatório.', '');
    //   },
    // );
  }

  btnSalvar_click() {
    // this.emProcessamento = true;
    // if (this.validaCampos()) {
    //   if (isNullOrUndefined(this.relatorio.id)) {
    //     this._relatorioService.addRelatorio(
    //       this._tokenManager.retrieve(),
    //       this.relatorio).subscribe(
    //         data => {
    //           this.emProcessamento = false;
    //           this.relatorio = data;
    //           this.exibeIncluir = true;
    //           this.dialog.success('SGR', 'Relatorio salvo com sucesso.');
    //         },
    //         error => {
    //           this.emProcessamento = false;
    //           this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
    //         },
    //       );
    //   } else {
    //     this._relatorioService.editRelatorio(
    //       this._tokenManager.retrieve(),
    //       this.relatorio.id,
    //       this.relatorio).subscribe(
    //       data => {
    //       this.emProcessamento = false;
    //       this.relatorio = data;
    //       this.exibeIncluir = true;
    //       this.dialog.success('SGR', 'Relatorio salvo com sucesso.');
    //     },
    //     error => {
    //       this.emProcessamento = false;
    //       this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
    //     },
    //   );
    //   }
    // } else {
    //   this.emProcessamento = false;
    //   this.dialog.warning('SGR', 'Campos obrigatórios não preenchidos');
    // }
  }

  btnExportarExcel_click() {
    this.emProcessamento = true;
    this._relatorioService
      .getMapaResiduoExcel(this._tokenManager.retrieve(), this.filtrorelatorio)
      .subscribe(data => {
        FileSaver.saveAs(data, 'mapa_residuo.xlsx');
        this.emProcessamento = false;
        // const fileUrl = URL.createObjectURL(data);
        // const tab = window.open();
        // tab.location.href = fileUrl;
      },
      error => {
        this.emProcessamento = false;
        const err = new HttpErrorResponse(error);
        console.log(err);
        this.dialog.error('SGR', 'Erro ao gerar o Mapa de Resíduos.', '');
      },
    );
  }

  btnIncluir_click() {
    // this.relatorio = new Relatorio();
  }

  getErrorMessage(control: FormControl) {
    let mensagem = '';

    if (control.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }

    if (control.hasError('date')) {
      const data = new Date(control.getError('date').value);
      data.setDate(data.getDate() + 1);
      mensagem = mensagem + 'Data informada inferior a ' + data.toLocaleDateString();
    }

    if (control.hasError('date.null')) {
      mensagem = mensagem + control.getError('date.null').value;
    }
    return mensagem;
  }

  validaSaida(event: string) {
    if (event === '') {
      this.filtrorelatorio.id_cliente = null;
      this.filtrorelatorio.cliente = '';
    }
  }

  validaSaidaManifesto(event: string) {
    if (event === '') {
      this.filtrorelatorio.id_manifesto = null;
      this.filtrorelatorio.manifesto = '';
    }
  }

  buscaCliente(event: any) {
    let cliente: Cliente;
    if (event.id) {
      this._clienteService
        .getCliente(this._tokenManager.retrieve(), Number(event.id))
        .subscribe(
          data => {
            cliente = JSON.parse(data._body);
            this.filtrorelatorio.id_cliente = cliente.id;
            this.filtrorelatorio.cliente = cliente.razao_social;
          },
          (err: HttpErrorResponse) => {
            this.filtrorelatorio.id_cliente = null;
            this.filtrorelatorio.cliente = '';
          }
        );
    }
  }

  openPesquisa(): void {
    const dialogLoginRef = this.pesquisa.open(ClienteFindComponent, {
      width: '900px',
      height: '460px',
      disableClose: true,
      data: {
        id: null,
        razao_social: null
      }
    });

    dialogLoginRef.afterClosed().subscribe(result => {
      if (result.id != null && result.id !== undefined) {
        this.filtrorelatorio.id_cliente = result.id;
        this.filtrorelatorio.cliente = result.razao_social;
      }
    });
  }
}
