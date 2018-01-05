import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { FornecedorDocumento, FornecedorDocumentoFilter } from './fornecedordocumento';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class FornecedorDocumentoService {
  private fornecedordocumentoUrl = environment.urlbase + '/api/documentos/fornecedores';

  constructor(private _http: Http) {}

  addFornecedorDocumento(accessToken: string, _fornecedorDocumento: FornecedorDocumento): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id_tipo_documento: _fornecedorDocumento.id_tipo_documento,
      numero: _fornecedorDocumento.numero,
      emissao: _fornecedorDocumento.emissao,
      vencimento: _fornecedorDocumento.vencimento,
      id_fornecedor: _fornecedorDocumento.id_fornecedor
    };

    // console.log(_fornecedorDocumento.vencimento);
    // _params.set('codigo', '1');

    return this._http
      .post(this.fornecedordocumentoUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );

  }

  uploadDocumento(accessToken: string, _fornecedorDocumento: FornecedorDocumento, _file: File): Observable<any> {
    const UrlUpload = environment.urlbase + '/api/documentos/uploadfor';
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
    formData.append('id_fornecedor', _fornecedorDocumento.id_fornecedor.toString());
    formData.append('id_documento', _fornecedorDocumento.id.toString());
    // _params.set('codigo', '1');

    return this._http
      .post(UrlUpload, formData, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );

  }

  editFornecedorDocumento(accessToken: string, _id: number, _fornecedorDocumento: FornecedorDocumento): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id_tipo_documento: _fornecedorDocumento.id_tipo_documento,
      numero: _fornecedorDocumento.numero,
      emissao: _fornecedorDocumento.emissao,
      vencimento: _fornecedorDocumento.vencimento,
      id_fornecedor: _fornecedorDocumento.id_fornecedor
    };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.fornecedordocumentoUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );

  }

  deleteFornecedorDocumento(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.fornecedordocumentoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );
  }

  getFornecedorDocumento(accessToken: string, _id: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.fornecedordocumentoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de fornecedordocumentos
   *  parametro: acessToken: string
  */
  getFornecedorDocumentos(accessToken: string, sort: string, order: string, page: number,
                          pagesize: number, filter: FornecedorDocumentoFilter) {
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
      .get(this.fornecedordocumentoUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );
  }
}
