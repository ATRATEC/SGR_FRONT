import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { Cliente, ClienteFilter } from './cliente';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class ClienteService {
  private clienteUrl = environment.urlbase + '/api/clientes';

  constructor(private _http: Http) {}

  addCliente(accessToken: string, _cliente: Cliente): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      codigo_omie: _cliente.codigo_omie,
      codigo_integracao: _cliente.codigo_integracao,
      cnpj_cpf: _cliente.cnpj_cpf,
      razao_social: _cliente.razao_social,
      nome_fantasia: _cliente.nome_fantasia,
      logradouro: _cliente.logradouro,
      endereco: _cliente.endereco,
      endereco_numero: _cliente.endereco_numero,
      complemento: _cliente.complemento,
      bairro: _cliente.bairro,
      cidade: _cliente.cidade,
      estado: _cliente.estado,
      cep: _cliente.cep,
      codigo_pais: _cliente.codigo_pais,
      nascimento: _cliente.nascimento,
      contato: _cliente.contato,
      telefone1_ddd: _cliente.telefone1_ddd,
      telefone1_numero: _cliente.telefone1_numero,
      telefone2_ddd: _cliente.telefone2_ddd,
      telefone2_numero: _cliente.telefone2_numero,
      fax_ddd: _cliente.fax_ddd,
      fax_numero: _cliente.fax_numero,
      email: _cliente.email,
      homepage: _cliente.homepage,
      observacao: _cliente.observacao,
      inscricao_municipal: _cliente.inscricao_municipal,
      inscricao_estadual: _cliente.inscricao_estadual,
      inscricao_suframa: _cliente.inscricao_suframa,
      pessoa_fisica: _cliente.pessoa_fisica,
      optante_simples_nacional: _cliente.optante_simples_nacional,
      bloqueado: _cliente.bloqueado,
      importado_api: _cliente.importado_api,
      cnae: _cliente.cnae,
      obsEndereco: _cliente.obsEndereco,
      obsTelefonesEmail: _cliente.obsTelefonesEmail,
      nrolicenca: _cliente.nrolicenca,
      dtemissaolicenca: _cliente.dtemissaolicenca,
      nroanoslicenca: _cliente.nroanoslicenca,
      dtvalidadelicenca: _cliente.dtvalidadelicenca
    };
    // _params.set('codigo', '1');

    return this._http
      .post(this.clienteUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );

  }

  editCliente(accessToken: string, _id: number, _cliente: Cliente): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      codigo_omie: _cliente.codigo_omie,
      codigo_integracao: _cliente.codigo_integracao,
      cnpj_cpf: _cliente.cnpj_cpf,
      razao_social: _cliente.razao_social,
      nome_fantasia: _cliente.nome_fantasia,
      logradouro: _cliente.logradouro,
      endereco: _cliente.endereco,
      endereco_numero: _cliente.endereco_numero,
      complemento: _cliente.complemento,
      bairro: _cliente.bairro,
      cidade: _cliente.cidade,
      estado: _cliente.estado,
      cep: _cliente.cep,
      codigo_pais: _cliente.codigo_pais,
      nascimento: _cliente.nascimento,
      contato: _cliente.contato,
      telefone1_ddd: _cliente.telefone1_ddd,
      telefone1_numero: _cliente.telefone1_numero,
      telefone2_ddd: _cliente.telefone2_ddd,
      telefone2_numero: _cliente.telefone2_numero,
      fax_ddd: _cliente.fax_ddd,
      fax_numero: _cliente.fax_numero,
      email: _cliente.email,
      homepage: _cliente.homepage,
      observacao: _cliente.observacao,
      inscricao_municipal: _cliente.inscricao_municipal,
      inscricao_estadual: _cliente.inscricao_estadual,
      inscricao_suframa: _cliente.inscricao_suframa,
      pessoa_fisica: _cliente.pessoa_fisica,
      optante_simples_nacional: _cliente.optante_simples_nacional,
      bloqueado: _cliente.bloqueado,
      importado_api: _cliente.importado_api,
      cnae: _cliente.cnae,
      obsEndereco: _cliente.obsEndereco,
      obsTelefonesEmail: _cliente.obsTelefonesEmail,
      nrolicenca: _cliente.nrolicenca,
      dtemissaolicenca: _cliente.dtemissaolicenca,
      nroanoslicenca: _cliente.nroanoslicenca,
      dtvalidadelicenca: _cliente.dtvalidadelicenca
    };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.clienteUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );

  }

  deleteCliente(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.clienteUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );
  }

  getCliente(accessToken: string, _id: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.clienteUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de clientes
   *  parametro: acessToken: string
  */
  getClientes(accessToken: string, sort: string, order: string, page: number, pagesize: number, filter: ClienteFilter) {
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
      .get(this.clienteUrl, { headers: headers, search: search })
      .retry(5)
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }
}
