import { UppercaseDirective } from './uppercase.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [UppercaseDirective],
  exports: [UppercaseDirective],
})
export class UpperCaseModule { }
