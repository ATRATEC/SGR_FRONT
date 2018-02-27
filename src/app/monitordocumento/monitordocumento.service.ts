import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams, HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class MonitorDocumentoService {
  private relatorioUrl = environment.urlbase + '/api/monitordocumentos';

  constructor(private _http: Http, private _httpClient: HttpClient) {}

  getDocumentoClientes(accessToken: string, _NrDias: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.relatorioUrl + '/clientes/' + _NrDias.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getDocumentoFornecedores(accessToken: string, _NrDias: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.relatorioUrl + '/fornecedores/' + _NrDias.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  //#region codigo comentado
  // getRelatorio(accessToken: string, _id: number)  {
  //   const headers = new Headers({
  //     Accept: 'application/json',
  //     Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
  //   });

  //   return this._http
  //     .get(this.relatorioUrl + '/' + _id.toString(), { headers: headers })
  //     .map((res: Response) => res)
  //     .catch((error: any) =>
  //       Observable.throw(error.json() || 'Server error')
  //     );
  // }

  /** Metodo que retorna um observable com dados da listagem de relatorios
   *  parametro: acessToken: string
  */
  // getRelatorios(accessToken: string, sort: string, order: string, page: number, pagesize: number, filter: RelatorioFilter) {
  //   const headers = new Headers({
  //     Accept: 'application/json',
  //     Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
  //   });

  //   const params: HttpParams = new HttpParams();
  //   const search: URLSearchParams =  new URLSearchParams();
  //   search.set('nrcount', pagesize.toString());
  //   page++;
  //   search.set('page', page.toString());

  //   if ((!isNullOrUndefined(order)) && (order.length > 0)) {
  //     search.set('order', order);
  //   } else {
  //     order = 'asc';
  //     search.set('order', order);
  //   }

  //   if ((!isNullOrUndefined(sort))) {
  //     search.set('orderkey', sort);
  //   } else {
  //     sort = 'id';
  //     search.set('orderkey', sort);
  //   }

  //   if ((!isNullOrUndefined(filter.id)) && (filter.id.toString().length > 0)) {
  //     search.set('id', filter.id.toString());
  //   }

  //   if ((!isNullOrUndefined(filter.descricao)) && (filter.descricao.length > 0)) {
  //     search.set('descricao', filter.descricao);
  //   }

  //   if ((!isNullOrUndefined(filter.tipo_atividade)) && (filter.tipo_atividade.toString().length > 0)) {
  //     search.set('tipo_atividade', filter.tipo_atividade.toString());
  //   }

  //   return this._http
  //     .get(this.relatorioUrl, { headers: headers, search: search })
  //     .map((res: Response) => res.json())
  //     .catch((error: any) =>
  //       Observable.throw(error.json() || 'Server error')
  //     );
  // }

  // getListRelatorios(accessToken: string)  {
  //   const listUrl = environment.urlbase + '/api/listrelatorios';
  //   const headers = new Headers({
  //     Accept: 'application/json',
  //     Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
  //   });

  //   return this._http
  //     .get(listUrl, { headers: headers })
  //     .map((res: Response) => res)
  //     .retry(3)
  //     .catch((error: any) =>
  //       Observable.throw(error.json() || 'Server error')
  //     );
  // }

  // getRelatorioReceita(accessToken: string, _relatorio: Relatorio): any {
  //   const url = environment.urlbase + '/api/relatorios/receitas';
  //   const headers = new HttpHeaders({
  //     Accept: 'application/json',
  //     Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
  //   });

  //   let params: HttpParams = new HttpParams();
  //   const search: URLSearchParams =  new URLSearchParams();


  //   if ((!isNullOrUndefined(_relatorio.id_cliente)) && (_relatorio.id_cliente.toString().length > 0)) {
  //     params = params.append('id_cliente', _relatorio.id_cliente.toString());
  //   }

  //   if ((!isNullOrUndefined(_relatorio.datade)) && (_relatorio.datade.toString().length > 0)) {
  //     params = params.append('datade', _relatorio.datade.toString());
  //   }

  //   if ((!isNullOrUndefined(_relatorio.dataate)) && (_relatorio.dataate.toString().length > 0)) {
  //     params = params.append('dataate', _relatorio.dataate.toString());
  //   }


  //   return this._httpClient.get(url, {headers: headers, params: params, responseType: 'blob'})
  //           .map(res => {
  //             return new Blob([res], { type: 'application/pdf', });
  //           })
  //           .catch((error: any) =>
  //           Observable.throw(error || 'Server error')
  //         );
  // }

  // getRelatorioReceitaCliente(accessToken: string, _relatorio: Relatorio): any {
  //   const url = environment.urlbase + '/api/relatorios/receitaclientes';
  //   const headers = new HttpHeaders({
  //     Accept: 'application/json',
  //     Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
  //   });

  //   let params: HttpParams = new HttpParams();
  //   const search: URLSearchParams =  new URLSearchParams();


  //   if ((!isNullOrUndefined(_relatorio.id_cliente)) && (_relatorio.id_cliente.toString().length > 0)) {
  //     params = params.append('id_cliente', _relatorio.id_cliente.toString());
  //   }

  //   if ((!isNullOrUndefined(_relatorio.datade)) && (_relatorio.datade.toString().length > 0)) {
  //     params = params.append('datade', _relatorio.datade.toString());
  //   }

  //   if ((!isNullOrUndefined(_relatorio.dataate)) && (_relatorio.dataate.toString().length > 0)) {
  //     params = params.append('dataate', _relatorio.dataate.toString());
  //   }


  //   return this._httpClient.get(url, {headers: headers, params: params, responseType: 'blob'})
  //           .map(res => {
  //             return new Blob([res], { type: 'application/pdf', });
  //           })
  //           .catch((error: any) =>
  //           Observable.throw(error || 'Server error')
  //         );
  // }

  // getRelatorioDespesa(accessToken: string, _relatorio: Relatorio): any {
  //   const url = environment.urlbase + '/api/relatorios/despesas';
  //   const headers = new HttpHeaders({
  //     Accept: 'application/json',
  //     Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
  //   });

  //   let params: HttpParams = new HttpParams();
  //   const search: URLSearchParams =  new URLSearchParams();


  //   if ((!isNullOrUndefined(_relatorio.id_cliente)) && (_relatorio.id_cliente.toString().length > 0)) {
  //     params = params.append('id_cliente', _relatorio.id_cliente.toString());
  //   }

  //   if ((!isNullOrUndefined(_relatorio.datade)) && (_relatorio.datade.toString().length > 0)) {
  //     params = params.append('datade', _relatorio.datade.toString());
  //   }

  //   if ((!isNullOrUndefined(_relatorio.dataate)) && (_relatorio.dataate.toString().length > 0)) {
  //     params = params.append('dataate', _relatorio.dataate.toString());
  //   }


  //   return this._httpClient.get(url, {headers: headers, params: params, responseType: 'blob'})
  //           .map(res => {
  //             return new Blob([res], { type: 'application/pdf', });
  //           })
  //           .catch((error: any) =>
  //           Observable.throw(error || 'Server error')
  //         );
  // }
  //#endregion
}
