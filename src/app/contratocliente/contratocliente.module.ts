import { ContratoClienteEquipamentoService } from './contratoclienteequipamento.service';
import { UpperCaseModule } from './../uppercase/uppercase.module';
import { ContratoClienteFindComponent } from './contratocliente-find.component';
import { CustomCurrencyMaskConfig } from './../customcurrencymaskconfig';
import { CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ContratoClienteResiduoService } from './contratoclienteresiduo.service';
import { DatepipeModule } from '../datepipe/datepipe.module';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContratoClienteListComponent } from './contratocliente-list.component';
import { ContratoClienteFormComponent } from './contratocliente-form.component';
import { ContratoClienteService } from './contratocliente.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContratoClienteRoutingModule } from './contratocliente-routing.module';


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
    UpperCaseModule,
    ContratoClienteRoutingModule
  ],
  declarations: [
    ContratoClienteListComponent,
    ContratoClienteFormComponent,
    ContratoClienteFindComponent
  ],
  providers: [
    ContratoClienteService,
    ContratoClienteResiduoService,
    ContratoClienteEquipamentoService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  entryComponents: [ContratoClienteFindComponent]
})
export class ContratoClienteModule { }
