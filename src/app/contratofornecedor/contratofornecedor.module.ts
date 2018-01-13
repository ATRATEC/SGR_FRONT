import { ContratoFornecedorServicoService } from './contratofornecedorservico.service';
import { DatepipeModule } from './../datepipe.module';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContratoFornecedorListComponent } from './contratofornecedor-list.component';
import { ContratoFornecedorFormComponent } from './contratofornecedor-form.component';
import { ContratoFornecedorService } from './contratofornecedor.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContratoFornecedorRoutingModule } from './contratofornecedor-routing.module';


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
    DatepipeModule,
    ContratoFornecedorRoutingModule
  ],
  declarations: [
    ContratoFornecedorListComponent,
    ContratoFornecedorFormComponent
  ],
  providers: [ContratoFornecedorService, ContratoFornecedorServicoService]
})
export class ContratoFornecedorModule { }
