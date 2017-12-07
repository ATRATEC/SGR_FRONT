import { AlertSettings } from './alert-settings';
import { AlertType } from './alert-type';
import { AlertEmit } from './alert-emit';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AlertsService {

  alert$: Subject<AlertEmit> = new Subject();

  constructor() { }

  create(type: AlertType = 'success', message: any = '', title: any = '', override: AlertSettings = {}) {
    this.alert$.next({type, title, message, override});
  }

}
