import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { FiltroRelatorio, FiltroRelatorioFilter } from './filtrorelatorio';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams, HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';

@Injectable()
export class RelatorioService {
  private relatorioUrl = environment.urlbase + '/api/relatorios';

  constructor(private _http: Http, private _httpClient: HttpClient) {}

  addRelatorio(accessToken: string, _relatorio: FiltroRelatorio): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      descricao: _relatorio.descricao
    };
    // _params.set('codigo', '1');

    return this._http
      .post(this.relatorioUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  editRelatorio(accessToken: string, _id: number, _relatorio: FiltroRelatorio): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id: _id,
      descricao: _relatorio.descricao
    };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.relatorioUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  deleteRelatorio(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.relatorioUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getRelatorio(accessToken: string, _id: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.relatorioUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de relatorios
   *  parametro: acessToken: string
  */
  getRelatorios(accessToken: string, sort: string, order: string, page: number, pagesize: number, filter: FiltroRelatorioFilter) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    const params: HttpParams = new HttpParams();
    const search: URLSearchParams =  new URLSearchParams();
    search.set('nrcount', pagesize.toString());
    page++;
    search.set('page', page.toString());

    if ((!isNullOrUndefined(order)) && (order.length > 0)) {
      search.set('order', order);
    } else {
      order = 'asc';
      search.set('order', order);
    }

    if ((!isNullOrUndefined(sort))) {
      search.set('orderkey', sort);
    } else {
      sort = 'id';
      search.set('orderkey', sort);
    }

    if ((!isNullOrUndefined(filter.id)) && (filter.id.toString().length > 0)) {
      search.set('id', filter.id.toString());
    }

    if ((!isNullOrUndefined(filter.descricao)) && (filter.descricao.length > 0)) {
      search.set('descricao', filter.descricao);
    }

    if ((!isNullOrUndefined(filter.tipo_atividade)) && (filter.tipo_atividade.toString().length > 0)) {
      search.set('tipo_atividade', filter.tipo_atividade.toString());
    }

    return this._http
      .get(this.relatorioUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getListRelatorios(accessToken: string)  {
    const listUrl = environment.urlbase + '/api/listrelatorios';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(listUrl, { headers: headers })
      .map((res: Response) => res)
      .retry(3)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getRelatorioReceita(accessToken: string, _relatorio: FiltroRelatorio): any {
    const url = environment.urlbase + '/api/relatorios/receitas';
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    let params: HttpParams = new HttpParams();
    const search: URLSearchParams =  new URLSearchParams();


    if ((!isNullOrUndefined(_relatorio.id_cliente)) && (_relatorio.id_cliente.toString().length > 0)) {
      params = params.append('id_cliente', _relatorio.id_cliente.toString());
    }

    if ((!isNullOrUndefined(_relatorio.datade)) && (_relatorio.datade.toString().length > 0)) {
      params = params.append('datade', _relatorio.datade.toString());
    }

    if ((!isNullOrUndefined(_relatorio.dataate)) && (_relatorio.dataate.toString().length > 0)) {
      params = params.append('dataate', _relatorio.dataate.toString());
    }


    return this._httpClient.get(url, {headers: headers, params: params, responseType: 'blob'})
            .map(res => {
              return new Blob([res], { type: 'application/pdf', });
            })
            .catch((error: any) =>
            Observable.throw(error || 'Server error')
          );
  }

  getRelatorioReceitaCliente(accessToken: string, _relatorio: FiltroRelatorio) {
    const url = environment.urlbase + '/api/relatorios/receitaclientes';

    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const params: HttpParams = new HttpParams();
    const search: URLSearchParams =  new URLSearchParams();

    if ((!isNullOrUndefined(_relatorio.id)) && (_relatorio.id.toString().length > 0)) {
      search.set('id', _relatorio.id.toString());
    }

    if ((!isNullOrUndefined(_relatorio.id_cliente)) && (_relatorio.id_cliente.toString().length > 0) &&
       (!isNaN(_relatorio.id_cliente))) {
      search.set('id_cliente', _relatorio.id_cliente.toString());
    }

    if ((!isNullOrUndefined(_relatorio.id_manifesto)) && (_relatorio.id_manifesto.toString().length > 0) &&
       (!isNaN(_relatorio.id_manifesto))) {
      search.set('id_manifesto', _relatorio.id_manifesto.toString());
    }

    if ((!isNullOrUndefined(_relatorio.id_residuo)) && (_relatorio.id_residuo.toString().length > 0) &&
       (!isNaN(_relatorio.id_residuo))) {
      search.set('id_residuo', _relatorio.id_residuo.toString());
    }

    if ((!isNullOrUndefined(_relatorio.datade)) && (_relatorio.datade.toString().length > 0)) {
      const dt = new Date(_relatorio.datade);
      dt.setDate(dt.getDate() + 1);
      search.set('datade', '\'' + moment(dt).format('YYYY-MM-DD').toString() + '\'');
    }

    if ((!isNullOrUndefined(_relatorio.dataate)) && (_relatorio.dataate.toString().length > 0)) {
      const dt = new Date(_relatorio.dataate);
      dt.setDate(dt.getDate() + 1);
      search.set('dataate', '\'' + moment(dt).format('YYYY-MM-DD').toString() + '\'');
    }

    return this._http
      .get(url, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
    // const headers = new HttpHeaders({
    //   Accept: 'application/json',
    //   Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    // });

    // let params: HttpParams = new HttpParams();
    // const search: URLSearchParams =  new URLSearchParams();


    // if ((!isNullOrUndefined(_relatorio.id_cliente)) && (_relatorio.id_cliente.toString().length > 0)) {
    //   params = params.append('id_cliente', _relatorio.id_cliente.toString());
    // }

    // if ((!isNullOrUndefined(_relatorio.datade)) && (_relatorio.datade.toString().length > 0)) {
    //   params = params.append('datade', _relatorio.datade.toString());
    // }

    // if ((!isNullOrUndefined(_relatorio.dataate)) && (_relatorio.dataate.toString().length > 0)) {
    //   params = params.append('dataate', _relatorio.dataate.toString());
    // }


    // return this._httpClient.get(url, {headers: headers, params: params, responseType: 'blob'})
    //         .map(res => {
    //           return new Blob([res], { type: 'application/pdf', });
    //         })
    //         .catch((error: any) =>
    //         Observable.throw(error || 'Server error')
    //       );
  }

  getRelatorioDespesaCliente(accessToken: string, _relatorio: FiltroRelatorio) {
    const url = environment.urlbase + '/api/relatorios/despesaclientes';

    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const params: HttpParams = new HttpParams();
    const search: URLSearchParams =  new URLSearchParams();

    if ((!isNullOrUndefined(_relatorio.id)) && (_relatorio.id.toString().length > 0)) {
      search.set('id', _relatorio.id.toString());
    }

    if ((!isNullOrUndefined(_relatorio.id_cliente)) && (_relatorio.id_cliente.toString().length > 0) &&
       (!isNaN(_relatorio.id_cliente))) {
      search.set('id_cliente', _relatorio.id_cliente.toString());
    }

    if ((!isNullOrUndefined(_relatorio.id_manifesto)) && (_relatorio.id_manifesto.toString().length > 0) &&
       (!isNaN(_relatorio.id_manifesto))) {
      search.set('id_manifesto', _relatorio.id_manifesto.toString());
    }

    if ((!isNullOrUndefined(_relatorio.id_residuo)) && (_relatorio.id_residuo.toString().length > 0) &&
       (!isNaN(_relatorio.id_residuo))) {
      search.set('id_residuo', _relatorio.id_residuo.toString());
    }

    if ((!isNullOrUndefined(_relatorio.datade)) && (_relatorio.datade.toString().length > 0)) {
      const dt = new Date(_relatorio.datade);
      dt.setDate(dt.getDate() + 1);
      search.set('datade', '\'' + moment(dt).format('YYYY-MM-DD').toString() + '\'');
    }

    if ((!isNullOrUndefined(_relatorio.dataate)) && (_relatorio.dataate.toString().length > 0)) {
      const dt = new Date(_relatorio.dataate);
      dt.setDate(dt.getDate() + 1);
      search.set('dataate', '\'' + moment(dt).format('YYYY-MM-DD').toString() + '\'');
    }

    return this._http
      .get(url, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
    // const headers = new HttpHeaders({
    //   Accept: 'application/json',
    //   Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    // });

    // let params: HttpParams = new HttpParams();
    // const search: URLSearchParams =  new URLSearchParams();


    // if ((!isNullOrUndefined(_relatorio.id_cliente)) && (_relatorio.id_cliente.toString().length > 0)) {
    //   params = params.append('id_cliente', _relatorio.id_cliente.toString());
    // }

    // if ((!isNullOrUndefined(_relatorio.datade)) && (_relatorio.datade.toString().length > 0)) {
    //   params = params.append('datade', _relatorio.datade.toString());
    // }

    // if ((!isNullOrUndefined(_relatorio.dataate)) && (_relatorio.dataate.toString().length > 0)) {
    //   params = params.append('dataate', _relatorio.dataate.toString());
    // }


    // return this._httpClient.get(url, {headers: headers, params: params, responseType: 'blob'})
    //         .map(res => {
    //           return new Blob([res], { type: 'application/pdf', });
    //         })
    //         .catch((error: any) =>
    //         Observable.throw(error || 'Server error')
    //       );
  }

  getRelatorioLocacaoCliente(accessToken: string, _relatorio: FiltroRelatorio) {
    const url = environment.urlbase + '/api/relatorios/locacaoclientes';

    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const params: HttpParams = new HttpParams();
    const search: URLSearchParams =  new URLSearchParams();

    if ((!isNullOrUndefined(_relatorio.id)) && (_relatorio.id.toString().length > 0)) {
      search.set('id', _relatorio.id.toString());
    }

    if ((!isNullOrUndefined(_relatorio.id_cliente)) && (_relatorio.id_cliente.toString().length > 0) &&
       (!isNaN(_relatorio.id_cliente))) {
      search.set('id_cliente', _relatorio.id_cliente.toString());
    }

    if ((!isNullOrUndefined(_relatorio.datade)) && (_relatorio.datade.toString().length > 0)) {
      const dt = new Date(_relatorio.datade);
      dt.setDate(dt.getDate() + 1);
      search.set('datade', '\'' + moment(dt).format('YYYY-MM-DD').toString() + '\'');
    }

    if ((!isNullOrUndefined(_relatorio.dataate)) && (_relatorio.dataate.toString().length > 0)) {
      const dt = new Date(_relatorio.dataate);
      dt.setDate(dt.getDate() + 1);
      search.set('dataate', '\'' + moment(dt).format('YYYY-MM-DD').toString() + '\'');
    }

    return this._http
      .get(url, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  getRelatorioDespesa(accessToken: string, _relatorio: FiltroRelatorio): any {
    const url = environment.urlbase + '/api/relatorios/despesas';
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    let params: HttpParams = new HttpParams();
    const search: URLSearchParams =  new URLSearchParams();


    if ((!isNullOrUndefined(_relatorio.id_cliente)) && (_relatorio.id_cliente.toString().length > 0)) {
      params = params.append('id_cliente', _relatorio.id_cliente.toString());
    }

    if ((!isNullOrUndefined(_relatorio.datade)) && (_relatorio.datade.toString().length > 0)) {
      params = params.append('datade', moment(_relatorio.datade).format('DD/MM/YYYY'));
      console.log(moment(_relatorio.datade).format('DD/MM/YYYY'));
    }

    if ((!isNullOrUndefined(_relatorio.dataate)) && (_relatorio.dataate.toString().length > 0)) {
      params = params.append('dataate', moment(_relatorio.dataate).format('DD/MM/YYYY'));
    }


    return this._httpClient.get(url, {headers: headers, params: params, responseType: 'blob'})
            .map(res => {
              return new Blob([res], { type: 'application/pdf', });
            })
            .catch((error: any) =>
            Observable.throw(error || 'Server error')
          );
  }

  getPrintPdf(accessToken: string, _elemento: any): any {
    const url = environment.urlbase + '/api/relatorios/printpdf';
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    const params: HttpParams = new HttpParams();
    const search: URLSearchParams =  new URLSearchParams();

    // params = params.append('conteudo', _elemento);

    const _body = {
      conteudo: _elemento
    };

    return this._httpClient.post(url, _body, {headers: headers, params: params, responseType: 'blob'})
            .map(res => {
              return new Blob([res], { type: 'application/pdf', });
            })
            .catch((error: any) =>
            Observable.throw(error || 'Server error')
          );
  }

  getPrintPdf2(accessToken: string, _relatorio: FiltroRelatorio): any {
    const url = environment.urlbase + '/api/relatorios/printpdf2';
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    let params: HttpParams = new HttpParams();
    const search: URLSearchParams =  new URLSearchParams();


    // if ((!isNullOrUndefined(_relatorio.id_cliente)) && (_relatorio.id_cliente.toString().length > 0)) {
    //   params = params.append('id_cliente', _relatorio.id_cliente.toString());
    // }

    // if ((!isNullOrUndefined(_relatorio.datade)) && (_relatorio.datade.toString().length > 0)) {
    //   params = params.append('datade', moment(_relatorio.datade).format('DD/MM/YYYY'));
    //   console.log(moment(_relatorio.datade).format('DD/MM/YYYY'));
    // }

    // if ((!isNullOrUndefined(_relatorio.dataate)) && (_relatorio.dataate.toString().length > 0)) {
    //   params = params.append('dataate', moment(_relatorio.dataate).format('DD/MM/YYYY'));
    // }

    if ((!isNullOrUndefined(_relatorio.id)) && (_relatorio.id.toString().length > 0)) {
      params = params.append('id', _relatorio.id.toString());
    }

    if ((!isNullOrUndefined(_relatorio.id_cliente)) && (_relatorio.id_cliente.toString().length > 0) &&
       (!isNaN(_relatorio.id_cliente))) {
        params = params.append('id_cliente', _relatorio.id_cliente.toString());
    }

    if ((!isNullOrUndefined(_relatorio.id_manifesto)) && (_relatorio.id_manifesto.toString().length > 0) &&
       (!isNaN(_relatorio.id_manifesto))) {
        params = params.append('id_manifesto', _relatorio.id_manifesto.toString());
    }

    if ((!isNullOrUndefined(_relatorio.id_residuo)) && (_relatorio.id_residuo.toString().length > 0) &&
       (!isNaN(_relatorio.id_residuo))) {
        params = params.append('id_residuo', _relatorio.id_residuo.toString());
    }

    if ((!isNullOrUndefined(_relatorio.datade)) && (_relatorio.datade.toString().length > 0)) {
      const dt = new Date(_relatorio.datade);
      dt.setDate(dt.getDate() + 1);
      params = params.append('datade', '\'' + moment(dt).format('YYYY-MM-DD').toString() + '\'');
    }

    if ((!isNullOrUndefined(_relatorio.dataate)) && (_relatorio.dataate.toString().length > 0)) {
      const dt = new Date(_relatorio.dataate);
      dt.setDate(dt.getDate() + 1);
      params = params.append('dataate', '\'' + moment(dt).format('YYYY-MM-DD').toString() + '\'');
    }

    return this._httpClient.get(url, {headers: headers, params: params, responseType: 'blob'})
            .map(res => {
              return new Blob([res], { type: 'application/pdf', });
            })
            .catch((error: any) =>
            Observable.throw(error || 'Server error')
          );
  }
}
