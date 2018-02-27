import { environment } from './../../environments/environment';
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
  private residuoUrl = environment.urlbase + '/api/residuos';

  constructor(private _http: Http) {}

  addResiduo(accessToken: string, _residuo: Residuo): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      descricao: _residuo.descricao,
      id_classe: _residuo.id_classe,
      id_tipo_residuo: _residuo.id_tipo_residuo,
      id_acondicionamento: _residuo.id_acondicionamento,
      id_tratamento: _residuo.id_tratamento,
      tipo_receita: _residuo.tipo_receita
    };
    // _params.set('codigo', '1');

    return this._http
      .post(this.residuoUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  editResiduo(accessToken: string, _id: number, _residuo: Residuo): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id: _id,
      descricao: _residuo.descricao,
      id_classe: _residuo.id_classe,
      id_tipo_residuo: _residuo.id_tipo_residuo,
      id_acondicionamento: _residuo.id_acondicionamento,
      id_tratamento: _residuo.id_tratamento,
      tipo_receita: _residuo.tipo_receita
    };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.residuoUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
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
        Observable.throw(error.json() || 'Server error')
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
        Observable.throw(error.json() || 'Server error')
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

    if ((!isNullOrUndefined(filter.descricao)) && (filter.descricao.length > 0)) {
      search.set('descricao', filter.descricao);
    }

    if ((!isNullOrUndefined(filter.classe_residuo)) && (filter.classe_residuo.length > 0)) {
      search.set('classe_residuo', filter.classe_residuo);
    }

    if ((!isNullOrUndefined(filter.tipo_residuo)) && (filter.tipo_residuo.length > 0)) {
      search.set('tipo_residuo', filter.tipo_residuo);
    }

    if ((!isNullOrUndefined(filter.acondicionamento)) && (filter.acondicionamento.length > 0)) {
      search.set('acondicionamento', filter.acondicionamento);
    }

    if ((!isNullOrUndefined(filter.tratamento)) && (filter.tratamento.length > 0)) {
      search.set('tratamento', filter.tratamento);
    }

    return this._http
      .get(this.residuoUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getListResiduos(accessToken: string)  {
    const listUrl = environment.urlbase + '/api/listresiduos';
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
}
