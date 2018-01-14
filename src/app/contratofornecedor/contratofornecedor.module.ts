import { CustomCurrencyMaskConfig } from './../customcurrencymaskconfig';
import { CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { CurrencyMaskModule } from 'ng2-currency-mask';
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
    CurrencyMaskModule,
    ContratoFornecedorRoutingModule
  ],
  declarations: [
    ContratoFornecedorListComponent,
    ContratoFornecedorFormComponent
  ],
  providers: [
    ContratoFornecedorService,
    ContratoFornecedorServicoService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ]
})
export class ContratoFornecedorModule { }
