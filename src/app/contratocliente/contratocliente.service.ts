import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { ContratoCliente, ContratoClienteFilter } from './contratocliente';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class ContratoClienteService {
  private contratoclienteUrl = environment.urlbase + '/api/contratoclientes';

  constructor(private _http: Http) {}

  addContratoCliente(accessToken: string, _contratocliente: ContratoCliente): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id_cliente: _contratocliente.id_cliente,
      descricao: _contratocliente.descricao,
      vigencia_inicio: _contratocliente.vigencia_inicio,
      vigencia_final: _contratocliente.vigencia_final,
      exclusivo: _contratocliente.exclusico,
      observacao: _contratocliente.observacao,
      caminho: _contratocliente.caminho
    };
    // _params.set('codigo', '1');

    return this._http
      .post(this.contratoclienteUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  editContratoCliente(accessToken: string, _id: number, _contratocliente: ContratoCliente): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id: _id,
      id_cliente: _contratocliente.id_cliente,
      descricao: _contratocliente.descricao,
      vigencia_inicio: _contratocliente.vigencia_inicio,
      vigencia_final: _contratocliente.vigencia_final,
      exclusivo: _contratocliente.exclusico,
      observacao: _contratocliente.observacao,
      caminho: _contratocliente.caminho
    };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.contratoclienteUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  deleteContratoCliente(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.contratoclienteUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getContratoCliente(accessToken: string, _id: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.contratoclienteUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de contratoclientes
   *  parametro: acessToken: string
  */
  getContratoClientes(accessToken: string, sort: string, order: string, page: number,
                         pagesize: number, filter: ContratoClienteFilter) {
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

    if ((!isNullOrUndefined(filter.cliente)) && (filter.cliente.length > 0)) {
      search.set('cliente', filter.cliente);
    }

    if ((!isNullOrUndefined(filter.vigencia_inicio)) && (filter.vigencia_inicio.length > 0)) {
      search.set('vigencia_inicio', filter.vigencia_inicio);
    }

    if ((!isNullOrUndefined(filter.vigencia_final)) && (filter.vigencia_final.length > 0)) {
      search.set('vigencia_final', filter.vigencia_final);
    }

    return this._http
      .get(this.contratoclienteUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getListContratoClientes(accessToken: string)  {
    const listUrl = environment.urlbase + '/api/listcontratoclientes';
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

  uploadContrato(accessToken: string, _contratocliente: ContratoCliente, _file: File): Observable<any> {
    const UrlUpload = environment.urlbase + '/api/contratoclientes/upload';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    // const _body = {
    //   id_documento: _clienteDocumento.id,
    //   id_cliente: _clienteDocumento.id_cliente,
    //   arquivo: _file
    // };

    const formData = new FormData();
    formData.append('arquivo', _file, _file.name);
    formData.append('id_cliente', _contratocliente.id_cliente.toString());
    formData.append('id_contrato', _contratocliente.id.toString());
    // _params.set('codigo', '1');

    return this._http
      .post(UrlUpload, formData, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }
}
