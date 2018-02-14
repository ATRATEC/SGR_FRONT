import { FocusDirective } from './focus.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FocusDirective
  ],
  exports: [
    FocusDirective
  ]
})
export class FocusModule { }
