import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { Acondicionamento, AcondicionamentoFilter } from './acondicionamento';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class AcondicionamentoService {
  private acondicionamentoUrl = 'http://sgr.localhost/api/acondicionamentos';

  constructor(private _http: Http) {}

  addAcondicionamento(accessToken: string, _codigo: string, _descricao: string): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = { codigo: _codigo, descricao: _descricao };

    // _params.set('codigo', '1');
    // _params.set('descricao', 'teste de inclusão');
    // const search: URLSearchParams =  new URLSearchParams();
    // search.set('nrcount', pagesize.toString());
    // page++;
    // search.set('page', page.toString());

    // if ((!isNullOrUndefined(order)) && (order.length > 0)) {
    //   search.set('order', order);
    // } else {
    //   order = 'asc';
    //   search.set('order', order);
    // }

    // if ((!isNullOrUndefined(sort))) {
    //   search.set('orderkey', sort);
    // } else {
    //   sort = 'id';
    //   search.set('orderkey', sort);
    // }

    // if ((!isNullOrUndefined(filter.id)) && (filter.id.toString().length > 0)) {
    //   search.set('id', filter.id.toString());
    // }

    // if ((!isNullOrUndefined(filter.codigo)) && (filter.codigo.length > 0)) {
    //   search.set('codigo', filter.codigo);
    // }

    // if ((!isNullOrUndefined(filter.descricao)) && (filter.descricao.length > 0)) {
    //   search.set('descricao', filter.descricao);
    // }

    return this._http
      .post(this.acondicionamentoUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );

  }

  editAcondicionamento(accessToken: string, _id: number, _codigo: string, _descricao: string): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {id: _id,  codigo: _codigo, descricao: _descricao };

    // _params.set('id', _id.toString());
    // _params.set('descricao', 'teste de inclusão');
    // const search: URLSearchParams =  new URLSearchParams();
    // search.set('nrcount', pagesize.toString());
    // page++;
    // search.set('page', page.toString());

    // if ((!isNullOrUndefined(order)) && (order.length > 0)) {
    //   search.set('order', order);
    // } else {
    //   order = 'asc';
    //   search.set('order', order);
    // }

    // if ((!isNullOrUndefined(sort))) {
    //   search.set('orderkey', sort);
    // } else {
    //   sort = 'id';
    //   search.set('orderkey', sort);
    // }

    // if ((!isNullOrUndefined(filter.id)) && (filter.id.toString().length > 0)) {
    //   search.set('id', filter.id.toString());
    // }

    // if ((!isNullOrUndefined(filter.codigo)) && (filter.codigo.length > 0)) {
    //   search.set('codigo', filter.codigo);
    // }

    // if ((!isNullOrUndefined(filter.descricao)) && (filter.descricao.length > 0)) {
    //   search.set('descricao', filter.descricao);
    // }

    return this._http
      .put(this.acondicionamentoUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );

  }

  deleteAcondicionamento(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.acondicionamentoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );
  }

  getAcondicionamento(accessToken: string, _id: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.acondicionamentoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de acondicionamentos
   *  parametro: acessToken: string
  */
  getAcondicionamentos(accessToken: string, sort: string, order: string, page: number, pagesize: number, filter: AcondicionamentoFilter) {
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

    if ((!isNullOrUndefined(filter.codigo)) && (filter.codigo.length > 0)) {
      search.set('codigo', filter.codigo);
    }

    if ((!isNullOrUndefined(filter.descricao)) && (filter.descricao.length > 0)) {
      search.set('descricao', filter.descricao);
    }

    return this._http
      .get(this.acondicionamentoUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );
  }
}
