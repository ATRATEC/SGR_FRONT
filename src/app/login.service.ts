import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from './user';

@Injectable()
export class LoginService {
  private loginUrl = 'http://siatra.localhost/api/login';

  constructor(private _http: Http) { }

  public Login(_email: string, _password: string) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });

    const postData = {
      email: _email,
      password: _password
    };

    return this._http.post(this.loginUrl, JSON.stringify(postData), {
      headers: headers
      })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}
