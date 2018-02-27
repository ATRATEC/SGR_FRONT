import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { ClienteDocumento, ClienteDocumentoFilter } from './clientedocumento';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class ClienteDocumentoService {
  private clientedocumentoUrl = environment.urlbase + '/api/clientedocumentos';

  constructor(private _http: Http) {}

  addClienteDocumento(accessToken: string, _clienteDocumento: ClienteDocumento): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id_tipo_documento: _clienteDocumento.id_tipo_documento,
      numero: _clienteDocumento.numero,
      emissao: _clienteDocumento.emissao,
      vencimento: _clienteDocumento.vencimento,
      id_cliente: _clienteDocumento.id_cliente
    };

    console.log(_clienteDocumento.vencimento);
    // _params.set('codigo', '1');

    return this._http
      .post(this.clientedocumentoUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  uploadDocumento(accessToken: string, _clienteDocumento: ClienteDocumento, _file: File): Observable<any> {
    const UrlUpload = environment.urlbase + '/api/clientedocumentos/upload';
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
    formData.append('id_cliente', _clienteDocumento.id_cliente.toString());
    formData.append('id_documento', _clienteDocumento.id.toString());
    // _params.set('codigo', '1');

    return this._http
      .post(UrlUpload, formData, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  editClienteDocumento(accessToken: string, _id: number, _clienteDocumento: ClienteDocumento): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id_tipo_documento: _clienteDocumento.id_tipo_documento,
      numero: _clienteDocumento.numero,
      emissao: _clienteDocumento.emissao,
      vencimento: _clienteDocumento.vencimento,
      id_cliente: _clienteDocumento.id_cliente
    };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.clientedocumentoUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  deleteClienteDocumento(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.clientedocumentoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getClienteDocumento(accessToken: string, _id: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.clientedocumentoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de clientedocumentos
   *  parametro: acessToken: string
  */
  getClienteDocumentos(accessToken: string, sort: string, order: string, page: number, pagesize: number, filter: ClienteDocumentoFilter) {
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

    if ((!isNullOrUndefined(filter.razao_social)) && (filter.razao_social.length > 0)) {
      search.set('razao_social', filter.razao_social);
    }

    if ((!isNullOrUndefined(filter.numero)) && (filter.numero.length > 0)) {
      search.set('numero', filter.numero);
    }

    return this._http
      .get(this.clientedocumentoUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }
}
