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

  downloadPDF(): any {
    const url = environment.urlbase + '/api/relatorios/clientes';
    return this._httpClient.get(url, { responseType: 'blob'})
            .map(res => {
            return new Blob([res], { type: 'application/pdf', });
        });
  }

}
