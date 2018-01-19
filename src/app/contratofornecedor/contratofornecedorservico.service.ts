import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { ContratoFornecedorServico, ContratoFornecedorServicoFilter } from './contratofornecedorservico';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class ContratoFornecedorServicoService {
  private contratofornecedorservicoUrl = environment.urlbase + '/api/contratofornecedorservicos';

  constructor(private _http: Http) {}

  addContratoFornecedorServico(accessToken: string, _id: number, _contratofornecedorservico: ContratoFornecedorServico[]): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id: _id,
      data: _contratofornecedorservico
    };
    // _params.set('codigo', '1');

    return this._http
      .post(this.contratofornecedorservicoUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  editContratoFornecedorServico(accessToken: string, _id: number,
    _contratofornecedorservico: ContratoFornecedorServico[]): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {data: _contratofornecedorservico };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.contratofornecedorservicoUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  deleteContratoFornecedorServico(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.contratofornecedorservicoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getContratoFornecedorServico(accessToken: string, _id: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.contratofornecedorservicoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de contratofornecedorservicos
   *  parametro: acessToken: string
  */
  getContratoFornecedorServicos(accessToken: string, filter: ContratoFornecedorServicoFilter) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    const params: HttpParams = new HttpParams();
    const search: URLSearchParams =  new URLSearchParams();

    if ((!isNullOrUndefined(filter.id)) && (filter.id.toString().length > 0)) {
      search.set('id', filter.id.toString());
    }

    if ((!isNullOrUndefined(filter.id_cliente)) && (filter.id_cliente.toString().length > 0)) {
      search.set('id_cliente', filter.id_cliente.toString());
    }

    if ((!isNullOrUndefined(filter.id_contrato)) && (filter.id_contrato.toString().length > 0)) {
      search.set('id_contrato', filter.id_contrato.toString());
    }

    if ((!isNullOrUndefined(filter.id_servico)) && (filter.id_servico.toString().length > 0)) {
      search.set('id_servico', filter.id_servico.toString());
    }

    if ((!isNullOrUndefined(filter.unidade)) && (filter.unidade.toString().length > 0)) {
      search.set('unidade', filter.unidade);
    }

    return this._http
      .get(this.contratofornecedorservicoUrl, { headers: headers, search: search })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getListContratoFornecedorServicos(accessToken: string)  {
    const listUrl = environment.urlbase + '/api/listcontratofornecedorservicos';
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
}
