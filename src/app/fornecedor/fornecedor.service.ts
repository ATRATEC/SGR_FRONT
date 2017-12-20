import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { Fornecedor, FornecedorFilter } from './fornecedor';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class FornecedorService {
  private fornecedorUrl = environment.urlbase + '/api/fornecedores';

  constructor(private _http: Http) {}

  addFornecedor(accessToken: string, _fornecedor: Fornecedor): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      codigo_omie: _fornecedor.codigo_omie,
      id_tipoatividade: _fornecedor.id_tipoatividade,
      codigo_integracao: _fornecedor.codigo_integracao,
      cnpj_cpf: _fornecedor.cnpj_cpf,
      razao_social: _fornecedor.razao_social,
      nome_fantasia: _fornecedor.nome_fantasia,
      logradouro: _fornecedor.logradouro,
      endereco: _fornecedor.endereco,
      endereco_numero: _fornecedor.endereco_numero,
      complemento: _fornecedor.complemento,
      bairro: _fornecedor.bairro,
      cidade: _fornecedor.cidade,
      estado: _fornecedor.estado,
      cep: _fornecedor.cep,
      codigo_pais: _fornecedor.codigo_pais,
      nascimento: _fornecedor.nascimento,
      contato: _fornecedor.contato,
      telefone1_ddd: _fornecedor.telefone1_ddd,
      telefone1_numero: _fornecedor.telefone1_numero,
      telefone2_ddd: _fornecedor.telefone2_ddd,
      telefone2_numero: _fornecedor.telefone2_numero,
      fax_ddd: _fornecedor.fax_ddd,
      fax_numero: _fornecedor.fax_numero,
      email: _fornecedor.email,
      homepage: _fornecedor.homepage,
      observacao: _fornecedor.observacao,
      inscricao_municipal: _fornecedor.inscricao_municipal,
      inscricao_estadual: _fornecedor.inscricao_estadual,
      inscricao_suframa: _fornecedor.inscricao_suframa,
      pessoa_fisica: _fornecedor.pessoa_fisica,
      optante_simples_nacional: _fornecedor.optante_simples_nacional,
      bloqueado: _fornecedor.bloqueado,
      importado_api: _fornecedor.importado_api,
      cnae: _fornecedor.cnae,
      obsEndereco: _fornecedor.obsEndereco,
      obsTelefonesEmail: _fornecedor.obsTelefonesEmail,
      nrlicencatransp: _fornecedor.nrlicencatransp,
      dtemissaotransp: _fornecedor.dtemissaotransp,
      nranostransp: _fornecedor.nranostransp,
      dtvalidadetransp: _fornecedor.dtvalidadetransp,
      nrlicencarecep: _fornecedor.nrlicencarecep,
      dtemissaorecep: _fornecedor.dtemissaorecep,
      nranosrecep: _fornecedor.nranosrecep,
      dtvalidaderecep: _fornecedor.dtvalidaderecep
    };
    // _params.set('codigo', '1');

    return this._http
      .post(this.fornecedorUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );

  }

  editFornecedor(accessToken: string, _id: number, _fornecedor: Fornecedor): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      codigo_omie: _fornecedor.codigo_omie,
      id_tipoatividade: _fornecedor.id_tipoatividade,
      codigo_integracao: _fornecedor.codigo_integracao,
      cnpj_cpf: _fornecedor.cnpj_cpf,
      razao_social: _fornecedor.razao_social,
      nome_fantasia: _fornecedor.nome_fantasia,
      logradouro: _fornecedor.logradouro,
      endereco: _fornecedor.endereco,
      endereco_numero: _fornecedor.endereco_numero,
      complemento: _fornecedor.complemento,
      bairro: _fornecedor.bairro,
      cidade: _fornecedor.cidade,
      estado: _fornecedor.estado,
      cep: _fornecedor.cep,
      codigo_pais: _fornecedor.codigo_pais,
      nascimento: _fornecedor.nascimento,
      contato: _fornecedor.contato,
      telefone1_ddd: _fornecedor.telefone1_ddd,
      telefone1_numero: _fornecedor.telefone1_numero,
      telefone2_ddd: _fornecedor.telefone2_ddd,
      telefone2_numero: _fornecedor.telefone2_numero,
      fax_ddd: _fornecedor.fax_ddd,
      fax_numero: _fornecedor.fax_numero,
      email: _fornecedor.email,
      homepage: _fornecedor.homepage,
      observacao: _fornecedor.observacao,
      inscricao_municipal: _fornecedor.inscricao_municipal,
      inscricao_estadual: _fornecedor.inscricao_estadual,
      inscricao_suframa: _fornecedor.inscricao_suframa,
      pessoa_fisica: _fornecedor.pessoa_fisica,
      optante_simples_nacional: _fornecedor.optante_simples_nacional,
      bloqueado: _fornecedor.bloqueado,
      importado_api: _fornecedor.importado_api,
      cnae: _fornecedor.cnae,
      obsEndereco: _fornecedor.obsEndereco,
      obsTelefonesEmail: _fornecedor.obsTelefonesEmail,
      nrlicencatransp: _fornecedor.nrlicencatransp,
      dtemissaotransp: _fornecedor.dtemissaotransp,
      nranostransp: _fornecedor.nranostransp,
      dtvalidadetransp: _fornecedor.dtvalidadetransp,
      nrlicencarecep: _fornecedor.nrlicencarecep,
      dtemissaorecep: _fornecedor.dtemissaorecep,
      nranosrecep: _fornecedor.nranosrecep,
      dtvalidaderecep: _fornecedor.dtvalidaderecep
    };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.fornecedorUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );

  }

  deleteFornecedor(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.fornecedorUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );
  }

  getFornecedor(accessToken: string, _id: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.fornecedorUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de fornecedors
   *  parametro: acessToken: string
  */
  getFornecedors(accessToken: string, sort: string, order: string, page: number, pagesize: number, filter: FornecedorFilter) {
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

    if ((!isNullOrUndefined(filter.codigo_omie)) && (filter.codigo_omie.toString().length > 0)) {
      search.set('codigo_omie', filter.codigo_omie.toString());
    }

    if ((!isNullOrUndefined(filter.cnpj_cpf)) && (filter.cnpj_cpf.length > 0)) {
      search.set('cnpj_cpf', filter.cnpj_cpf);
    }

    if ((!isNullOrUndefined(filter.razao_social)) && (filter.razao_social.length > 0)) {
      search.set('razao_social', filter.razao_social);
    }

    if ((!isNullOrUndefined(filter.contato)) && (filter.contato.length > 0)) {
      search.set('contato', filter.contato);
    }

    if ((!isNullOrUndefined(filter.telefone)) && (filter.telefone.length > 0)) {
      search.set('telefone1_numero', filter.telefone);
    }

    if ((!isNullOrUndefined(filter.email)) && (filter.email.length > 0)) {
      search.set('email', filter.email);
    }

    return this._http
      .get(this.fornecedorUrl, { headers: headers, search: search })
      .retry(5)
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }
}
