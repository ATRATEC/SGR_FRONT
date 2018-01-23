import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TipoResiduoListComponent } from './tiporesiduo-list.component';
import { TipoResiduoFormComponent } from './tiporesiduo-form.component';
import { TipoResiduoService } from './tiporesiduo.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoResiduoRoutingModule } from './tiporesiduo-routing.module';

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
    TipoResiduoRoutingModule
  ],
  declarations: [
    TipoResiduoListComponent,
    TipoResiduoFormComponent
  ],
  providers: [TipoResiduoService]
})
export class TipoResiduoModule { }
