import { UpperCaseModule } from './../uppercase/uppercase.module';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TipoTratamentoListComponent } from './tipotratamento-list.component';
import { TipoTratamentoFormComponent } from './tipotratamento-form.component';
import { TipoTratamentoService } from './tipotratamento.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoTratamentoRoutingModule } from './tipotratamento-routing.module';

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
    TipoTratamentoRoutingModule
  ],
  declarations: [
    TipoTratamentoListComponent,
    TipoTratamentoFormComponent
  ],
  providers: [TipoTratamentoService]
})
export class TipoTratamentoModule { }
