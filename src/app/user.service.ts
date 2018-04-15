import { isNullOrUndefined } from 'util';
import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from './user';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
  private usersUrl = environment.urlbase + '/api/users';

  constructor(private _http: Http, private _httpClient: HttpClient) { }

  public getUsers(accessToken: string): Observable<User[]> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken
    });

    return this._http.get(this.usersUrl, {headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  public resetPassword(accessToken: string, email: string): Observable<User[]> {
    const urlreset = environment.urlbase + '/aclcontrol/reset';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      email: email
    };
    // _params.set('id', _id.toString());

    return this._http
      .post(urlreset, _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  public addUsuario(accessToken: string, _name: string, _email: string, _password: string, _confPassword: string, _id_perfil: number
  ): Observable<User[]> {
    const url = environment.urlbase + '/api/aclcontrol/adduser';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      name: _name,
      email: _email,
      password: _password,
      password_confirmation: _confPassword,
      id_perfil: _id_perfil
    };
    // _params.set('id', _id.toString());

    return this._http
      .post(url, _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  public editUsuario(accessToken: string, _id: number, _name: string, _email: string,
    _password: string, _confPassword: string, _id_perfil: number): Observable<User[]> {
    const url = environment.urlbase + '/api/aclcontrol/edituser';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    let retorno: Observable<User[]>;
    // const _params: HttpParams = new HttpParams();

    if ((!isNullOrUndefined(_password)) && (!isNullOrUndefined(_confPassword))) {
      const _body = {
        name: _name,
        email: _email,
        password: _password,
        password_confirmation: _confPassword,
        id_perfil: _id_perfil
      };
      retorno = this._http
      .put(url + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
    } else {
      const _body = {
        name: _name,
        email: _email,
        id_perfil: _id_perfil
      };

      retorno = this._http
      .post(url + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
    }
    return retorno;
  }

  public changePasswordUsuario(accessToken: string, _id: number, _password: string
    , _confPassword: string): Observable<User[]> {
    const url = environment.urlbase + '/api/aclcontrol/changepassword';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    let retorno: Observable<User[]>;

    const _body = {
      password: _password,
      password_confirmation: _confPassword
    };

    retorno = this._http
    .put(url + '/' + _id.toString(), _body, { headers: headers })
    .map((res: Response) => res.json())
    .catch((error: any) =>
      Observable.throw(error.json() || 'Server error')
    );

    return retorno;
  }

  downloadPDF(): any {
    const url = environment.urlbase + '/api/relatorios/clientes';
    return this._httpClient.get(url, { responseType: 'blob'})
            .map(res => {
            return new Blob([res], { type: 'application/pdf', });
        });
  }

  getListPerfis(accessToken: string)  {
    const listUrl = environment.urlbase + '/api/aclcontrol/listperfil';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(listUrl, { headers: headers })
      .map((res: Response) => res)
      .retry(3)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getListUsers(accessToken: string)  {
    const listUrl = environment.urlbase + '/api/aclcontrol/listuser';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(listUrl, { headers: headers })
      .map((res: Response) => res)
      .retry(3)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

}
