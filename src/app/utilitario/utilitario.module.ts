import { StrToBooleanPipe } from './strToBooleanPipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StrToBooleanPipe
  ],
  exports: [
    StrToBooleanPipe
  ]
})
export class UtilitarioModule { }
