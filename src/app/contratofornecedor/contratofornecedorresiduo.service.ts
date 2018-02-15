import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { ContratoFornecedorResiduo, ContratoFornecedorResiduoFilter } from './contratofornecedorresiduo';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class ContratoFornecedorResiduoService {
  private contratofornecedorresiduoUrl = environment.urlbase + '/api/contratofornecedorresiduos';

  constructor(private _http: Http) {}

  addContratoFornecedorResiduo(accessToken: string, _id: number, _contratofornecedorresiduo: ContratoFornecedorResiduo[]): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id: _id,
      data: _contratofornecedorresiduo
    };
    // _params.set('codigo', '1');

    return this._http
      .post(this.contratofornecedorresiduoUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  editContratoFornecedorResiduo(accessToken: string, _id: number,
    _contratofornecedorresiduo: ContratoFornecedorResiduo[]): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {data: _contratofornecedorresiduo };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.contratofornecedorresiduoUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  deleteContratoFornecedorResiduo(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.contratofornecedorresiduoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getContratoFornecedorResiduo(accessToken: string, _id: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.contratofornecedorresiduoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de contratofornecedorresiduos
   *  parametro: acessToken: string
  */
  getContratoFornecedorResiduos(accessToken: string, filter: ContratoFornecedorResiduoFilter) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    const params: HttpParams = new HttpParams();
    const search: URLSearchParams =  new URLSearchParams();

    if ((!isNullOrUndefined(filter.id)) && (filter.id.toString().length > 0)) {
      search.set('id', filter.id.toString());
    }

    if ((!isNullOrUndefined(filter.id_contrato)) && (filter.id_contrato.toString().length > 0)) {
      search.set('id_contrato', filter.id_contrato.toString());
    }

    if ((!isNullOrUndefined(filter.id_residuo)) && (filter.id_residuo.toString().length > 0)) {
      search.set('id_residuo', filter.id_residuo.toString());
    }

    if ((!isNullOrUndefined(filter.id_servico)) && (filter.id_servico.toString().length > 0)) {
      search.set('id_servico', filter.id_servico.toString());
    }

    if ((!isNullOrUndefined(filter.id_cliente)) && (filter.id_cliente.toString().length > 0)) {
      search.set('id_cliente', filter.id_cliente.toString());
    }

    if ((!isNullOrUndefined(filter.unidade)) && (filter.unidade.toString().length > 0)) {
      search.set('unidade', filter.unidade);
    }

    if ((!isNullOrUndefined(filter.vigencia_inicio)) && (filter.vigencia_inicio.toString().length > 0)) {
      search.set('vigencia_inicio', filter.vigencia_inicio.toLocaleDateString());
    }

    if ((!isNullOrUndefined(filter.vigencia_final)) && (filter.vigencia_final.toString().length > 0)) {
      search.set('vigencia_final', filter.vigencia_final.toLocaleDateString());
    }

    return this._http
      .get(this.contratofornecedorresiduoUrl, { headers: headers, search: search })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getListContratoFornecedorResiduos(accessToken: string)  {
    const listUrl = environment.urlbase + '/api/listcontratofornecedorresiduos';
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
