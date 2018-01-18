import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { ContratoFornecedor, ContratoFornecedorFilter } from './contratofornecedor';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class ContratoFornecedorService {
  private contratofornecedorUrl = environment.urlbase + '/api/contratofornecedores';

  constructor(private _http: Http) {}

  addContratoFornecedor(accessToken: string, _contratofornecedor: ContratoFornecedor): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id_cliente: _contratofornecedor.id_cliente,
      id_fornecedor: _contratofornecedor.id_fornecedor,
      descricao: _contratofornecedor.descricao,
      vigencia_inicio: _contratofornecedor.vigencia_inicio,
      vigencia_final: _contratofornecedor.vigencia_final,
      exclusivo: _contratofornecedor.exclusico,
      observacao: _contratofornecedor.observacao,
      caminho: _contratofornecedor.caminho
    };
    // _params.set('codigo', '1');

    return this._http
      .post(this.contratofornecedorUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  editContratoFornecedor(accessToken: string, _id: number, _contratofornecedor: ContratoFornecedor): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id: _id,
      id_cliente: _contratofornecedor.id_cliente,
      id_fornecedor: _contratofornecedor.id_fornecedor,
      descricao: _contratofornecedor.descricao,
      vigencia_inicio: _contratofornecedor.vigencia_inicio,
      vigencia_final: _contratofornecedor.vigencia_final,
      exclusivo: _contratofornecedor.exclusico,
      observacao: _contratofornecedor.observacao,
      caminho: _contratofornecedor.caminho
    };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.contratofornecedorUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  deleteContratoFornecedor(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.contratofornecedorUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getContratoFornecedor(accessToken: string, _id: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.contratofornecedorUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de contratofornecedors
   *  parametro: acessToken: string
  */
  getContratoFornecedors(accessToken: string, sort: string, order: string, page: number,
                         pagesize: number, filter: ContratoFornecedorFilter) {
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

    if ((!isNullOrUndefined(filter.fornecedor)) && (filter.fornecedor.length > 0)) {
      search.set('fornecedor', filter.fornecedor);
    }

    if ((!isNullOrUndefined(filter.vigencia_inicio)) && (filter.vigencia_inicio.length > 0)) {
      search.set('vigencia_inicio', filter.vigencia_inicio);
    }

    if ((!isNullOrUndefined(filter.vigencia_final)) && (filter.vigencia_final.length > 0)) {
      search.set('vigencia_final', filter.vigencia_final);
    }

    return this._http
      .get(this.contratofornecedorUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getListContratoFornecedors(accessToken: string)  {
    const listUrl = environment.urlbase + '/api/listcontratofornecedors';
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

  uploadContrato(accessToken: string, _contratofornecedor: ContratoFornecedor, _file: File): Observable<any> {
    const UrlUpload = environment.urlbase + '/api/contratofornecedores/upload';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    // const _body = {
    //   id_documento: _fornecedorDocumento.id,
    //   id_fornecedor: _fornecedorDocumento.id_fornecedor,
    //   arquivo: _file
    // };

    const formData = new FormData();
    formData.append('arquivo', _file, _file.name);
    formData.append('id_fornecedor', _contratofornecedor.id_fornecedor.toString());
    formData.append('id_contrato', _contratofornecedor.id.toString());
    // _params.set('codigo', '1');

    return this._http
      .post(UrlUpload, formData, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }
}
