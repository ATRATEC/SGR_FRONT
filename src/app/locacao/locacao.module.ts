import { UpperCaseModule } from './../uppercase/uppercase.module';
import { LocacaoFindComponent } from './locacao-find.component';
import { CustomCurrencyMaskConfig } from './../customcurrencymaskconfig';
import { CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { LocacaoEquipamentoService } from './locacaoequipamento.service';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LocacaoListComponent } from './locacao-list.component';
import { LocacaoFormComponent } from './locacao-form.component';
import { LocacaoService } from './locacao.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocacaoRoutingModule } from './locacao-routing.module';
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
    LocacaoRoutingModule
  ],
  declarations: [
    LocacaoListComponent,
    LocacaoFormComponent,
    LocacaoFindComponent
  ],
  providers: [
    LocacaoService,
    LocacaoEquipamentoService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  entryComponents: [LocacaoFindComponent]
})
export class LocacaoModule { }
