import { ManifestoFindComponent } from './manifesto-find.component';
import { CustomCurrencyMaskConfig } from './../customcurrencymaskconfig';
import { CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ManifestoServicoService } from './manifestoservico.service';
import { DatepipeModule } from './../datepipe.module';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ManifestoListComponent } from './manifesto-list.component';
import { ManifestoFormComponent } from './manifesto-form.component';
import { ManifestoService } from './manifesto.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManifestoRoutingModule } from './manifesto-routing.module';


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
    ManifestoRoutingModule
  ],
  declarations: [
    ManifestoListComponent,
    ManifestoFormComponent,
    ManifestoFindComponent
  ],
  providers: [
    ManifestoService,
    ManifestoServicoService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  entryComponents: [ManifestoFindComponent]
})
export class ManifestoModule { }
