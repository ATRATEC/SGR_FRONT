import { Pipe, PipeTransform } from '@angular/core';
import { strToBoolean } from './utilitarios';
import { booleanToStrSN } from './utilitarios';

@Pipe({
   name: 'strtoboolean'
})
export class StrToBooleanPipe implements PipeTransform {
   transform(str: any, args?: any): boolean {
    return strToBoolean(str);
   }
}

