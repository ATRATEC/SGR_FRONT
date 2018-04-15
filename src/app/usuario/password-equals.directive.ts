import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export function passwordEqualsValidator(password: AbstractControl): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const equals = !(password.value === control.value);
    return equals ? {'pwsinvalid': {value: control.value}} : null;
  };
}

@Directive({
  selector: '[appPasswordEquals]',
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordEqualsDirective, multi: true}]
})
export class PasswordEqualsDirective  {

}
