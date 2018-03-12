import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { ItemPesagem, ItemPesagemFilter } from './itempesagem';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class ItemPesagemService {
  private itempesagemUrl = environment.urlbase + '/api/itempesagens';

  constructor(private _http: Http) {}

  addItemPesagem(accessToken: string, _id: number, _itempesagem: ItemPesagem[]): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id: _id,
      data: _itempesagem
    };
    // _params.set('codigo', '1');

    return this._http
      .post(this.itempesagemUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  editItemPesagem(accessToken: string, _id: number,
    _itempesagem: ItemPesagem[]): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {data: _itempesagem };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.itempesagemUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  deleteItemPesagem(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.itempesagemUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getItemPesagem(accessToken: string, _id: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.itempesagemUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de itempesagems
   *  parametro: acessToken: string
  */
  getItemPesagems(accessToken: string, sort: string, order: string, page: number,
                         pagesize: number, filter: ItemPesagemFilter) {
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

    // if ((!isNullOrUndefined(filter.descricao)) && (filter.descricao.length > 0)) {
    //   search.set('descricao', filter.descricao);
    // }

    // if ((!isNullOrUndefined(filter.cliente)) && (filter.cliente.length > 0)) {
    //   search.set('cliente', filter.cliente);
    // }

    // if ((!isNullOrUndefined(filter.cliente)) && (filter.cliente.length > 0)) {
    //   search.set('cliente', filter.cliente);
    // }

    // if ((!isNullOrUndefined(filter.vigencia_inicio)) && (filter.vigencia_inicio.length > 0)) {
    //   search.set('vigencia_inicio', filter.vigencia_inicio);
    // }

    // if ((!isNullOrUndefined(filter.vigencia_final)) && (filter.vigencia_final.length > 0)) {
    //   search.set('vigencia_final', filter.vigencia_final);
    // }

    return this._http
      .get(this.itempesagemUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getListItemPesagems(accessToken: string)  {
    const listUrl = environment.urlbase + '/api/listitempesagens';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(listUrl, { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getListResiduoItemPesagem(accessToken: string, id_contrato_cliente: number)  {
    const listUrl = environment.urlbase + '/api/listresiduoitempesagens';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    const params: HttpParams = new HttpParams();
    const search: URLSearchParams =  new URLSearchParams();

    if ((!isNullOrUndefined(id_contrato_cliente)) && (id_contrato_cliente.toString().length > 0)) {
      search.set('id_contrato_cliente', id_contrato_cliente.toString());
    }

    return this._http
      .get(listUrl, { headers: headers, search: search })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }
}
