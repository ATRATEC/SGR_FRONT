import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { Produto } from './produto';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ProdutoService {
  private produtoUrl = 'http://siatra.localhost/api/produtos';

  constructor(private _http: Http) {}

  /** Metodo que retorna um observable com dados da listagem de produtos
   *  parametro: acessToken: string
  */
  getProdutos(accessToken: string, sort: string, order: string, page: number, pagesize: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken
    });

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

    return this._http
      .get(this.produtoUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );
  }
}
