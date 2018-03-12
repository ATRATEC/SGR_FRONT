import { UpperCaseModule } from './../uppercase/uppercase.module';
import { PesagemFindComponent } from './pesagem-find.component';
import { CustomCurrencyMaskConfig } from './../customcurrencymaskconfig';
import { CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ItemPesagemService } from './itempesagem.service';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PesagemListComponent } from './pesagem-list.component';
import { PesagemFormComponent } from './pesagem-form.component';
import { PesagemService } from './pesagem.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PesagemRoutingModule } from './pesagem-routing.module';
import { DatepipeModule } from '../datepipe/datepipe.module';


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
    PesagemRoutingModule
  ],
  declarations: [
    PesagemListComponent,
    PesagemFormComponent,
    PesagemFindComponent
  ],
  providers: [
    PesagemService,
    ItemPesagemService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  entryComponents: [PesagemFindComponent]
})
export class PesagemModule { }
