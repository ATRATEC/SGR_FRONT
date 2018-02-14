import { DatePipe } from './datepipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DatePipe
  ],
  exports: [
    DatePipe
  ]
})
export class DatepipeModule { }
