import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { Residuo, ResiduoFilter } from './residuo';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class ResiduoService {
  private residuoUrl = 'http://sgr.localhost/api/residuos';

  constructor(private _http: Http) {}

  addResiduo(accessToken: string, _codigo: string, _descricao: string, _id_classe: number): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = { codigo: _codigo, descricao: _descricao, id_classe: _id_classe };
    // _params.set('codigo', '1');

    return this._http
      .post(this.residuoUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );

  }

  editResiduo(accessToken: string, _id: number, _codigo: string, _descricao: string, _id_classe: number): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {id: _id,  codigo: _codigo, descricao: _descricao, id_classe: _id_classe };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.residuoUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );

  }

  deleteResiduo(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.residuoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );
  }

  getResiduo(accessToken: string, _id: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.residuoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de residuos
   *  parametro: acessToken: string
  */
  getResiduos(accessToken: string, sort: string, order: string, page: number, pagesize: number, filter: ResiduoFilter) {
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
      .get(this.residuoUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );
  }
}
