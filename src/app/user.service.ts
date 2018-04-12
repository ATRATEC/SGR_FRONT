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

  public addUsuario(accessToken: string, _name: string, _email: string, _password: string, _confPassword: string): Observable<User[]> {
    const url = environment.urlbase + '/aclcontrol/adduser';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      name: _name,
      email: _email,
      password: _password,
      password_confirmation: _confPassword
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
    _password: string, _confPassword: string): Observable<User[]> {
    const url = environment.urlbase + '/aclcontrol/edituser';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      name: _name,
      email: _email,
      password: _password,
      password_confirmation: _confPassword
    };
    // _params.set('id', _id.toString());

    return this._http
      .post(url + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  downloadPDF(): any {
    const url = environment.urlbase + '/api/relatorios/clientes';
    return this._httpClient.get(url, { responseType: 'blob'})
            .map(res => {
            return new Blob([res], { type: 'application/pdf', });
        });
  }

}
