import { isNullOrUndefined } from 'util';
import {Injectable} from '@angular/core';
import {FormControl, ValidatorFn, AbstractControl} from '@angular/forms';


@Injectable()
export class DateValidator {

  constructor() {
  }

  static afterDate(BeforeDate: FormControl): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      if (!isNullOrUndefined(BeforeDate.value)) {
        if (control.value < BeforeDate.value) {
          return {'date': {value: BeforeDate.value}};
        } else {
          return null;
        }
      } else {
        return {'date.null': {value: 'Data inicial inválida'}};
      }
    };
  }
}
