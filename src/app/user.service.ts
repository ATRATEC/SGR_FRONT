import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from './user';

@Injectable()
export class UserService {
  private usersUrl = 'http://siatra.localhost/api/users';

  constructor(private _http: Http) { }

  public getUsers(accessToken: string): Observable<User[]> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken
    });

    return this._http.get(this.usersUrl, {headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );
  }

}
