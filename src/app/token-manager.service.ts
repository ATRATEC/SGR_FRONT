import { Injectable } from '@angular/core';

@Injectable()
export class TokenManagerService {
  private tokenKey = 'app_token';

  constructor() { }

  public store(content: Object) {
    console.log(content);
    localStorage.setItem(this.tokenKey, JSON.stringify(content));
  }

  public retrieve() {
    const storedToken: string = localStorage.getItem(this.tokenKey);
    if (!storedToken) {
      throw new Error('Token não encontrado!');
    }

    return storedToken;
  }

  public delete() {
    localStorage.removeItem(this.tokenKey);
  }
}
