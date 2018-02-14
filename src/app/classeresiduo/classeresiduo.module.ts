import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ClasseResiduoListComponent } from './classeresiduo-list.component';
import { ClasseResiduoFormComponent } from './classeresiduo-form.component';
import { ClasseResiduoService } from './classeresiduo.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClasseResiduoRoutingModule } from './classeresiduo-routing.module';
import { UpperCaseModule } from '../uppercase/uppercase.module';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MyMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    UpperCaseModule,
    ClasseResiduoRoutingModule
  ],
  declarations: [
    ClasseResiduoListComponent,
    ClasseResiduoFormComponent
  ],
  providers: [ClasseResiduoService]
})
export class ClasseResiduoModule { }
