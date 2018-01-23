import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { Manifesto, ManifestoFilter } from './manifesto';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class ManifestoService {
  private manifestoUrl = environment.urlbase + '/api/manifestos';

  constructor(private _http: Http) {}

  addManifesto(accessToken: string, _manifesto: Manifesto): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id_cliente: _manifesto.id_cliente,
      id_contrato_cliente: _manifesto.id_contrato_cliente,
      id_transportador: _manifesto.id_transportador,
      id_destinador: _manifesto.id_destinador,
      data: _manifesto.data,
      numero: _manifesto.numero,
      observacao: _manifesto.observacao,
      caminho: _manifesto.caminho
    };
    // _params.set('codigo', '1');

    return this._http
      .post(this.manifestoUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  editManifesto(accessToken: string, _id: number, _manifesto: Manifesto): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id: _id,
      id_cliente: _manifesto.id_cliente,
      id_contrato_cliente: _manifesto.id_contrato_cliente,
      id_transportador: _manifesto.id_transportador,
      id_destinador: _manifesto.id_destinador,
      data: _manifesto.data,
      numero: _manifesto.numero,
      observacao: _manifesto.observacao,
      caminho: _manifesto.caminho
    };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.manifestoUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  deleteManifesto(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.manifestoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getManifesto(accessToken: string, _id: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.manifestoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de manifestos
   *  parametro: acessToken: string
  */
  getManifestos(accessToken: string, sort: string, order: string, page: number,
                         pagesize: number, filter: ManifestoFilter) {
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

    if ((!isNullOrUndefined(filter.numero)) && (filter.numero.length > 0)) {
      search.set('numero', filter.numero);
    }

    if ((!isNullOrUndefined(filter.cliente)) && (filter.cliente.length > 0)) {
      search.set('cliente', filter.cliente);
    }

    if ((!isNullOrUndefined(filter.transportador)) && (filter.transportador.length > 0)) {
      search.set('transportador', filter.transportador);
    }

    if ((!isNullOrUndefined(filter.destinador)) && (filter.destinador.length > 0)) {
      search.set('destinador', filter.destinador);
    }

    if ((!isNullOrUndefined(filter.data)) && (filter.data.length > 0)) {
      search.set('data', filter.data);
    }

    return this._http
      .get(this.manifestoUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getListManifestos(accessToken: string)  {
    const listUrl = environment.urlbase + '/api/listmanifestos';
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

  uploadManifesto(accessToken: string, _manifesto: Manifesto, _file: File): Observable<any> {
    const UrlUpload = environment.urlbase + '/api/manifestos/upload';
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
    formData.append('id_cliente', _manifesto.id_cliente.toString());
    formData.append('id_manifesto', _manifesto.id.toString());
    // _params.set('codigo', '1');

    return this._http
      .post(UrlUpload, formData, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }
}
