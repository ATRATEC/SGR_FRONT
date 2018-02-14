import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
   name: 'formatDate'
})
export class DatePipe implements PipeTransform {
   transform(date: any, args?: any): any {
     const d = new Date(date);
     d.setDate(d.getDate() + 1);

     moment.locale('pt-br');
     return moment(d).format('DD/MM/YYYY');

   }
}

