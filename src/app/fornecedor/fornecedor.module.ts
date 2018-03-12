import { DatepipeModule } from './../datepipe/datepipe.module';
import { FornecedorDocumentoService } from './fornecedordocumento.service';
import { UpperCaseModule } from './../uppercase/uppercase.module';
import { FornecedorFindComponent } from './fornecedor-find.component';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FornecedorListComponent } from './fornecedor-list.component';
import { FornecedorFormComponent } from './fornecedor-form.component';
import { FornecedorService } from './fornecedor.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FornecedorRoutingModule } from './fornecedor-routing.module';

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
    DatepipeModule,
    FornecedorRoutingModule
  ],
  declarations: [
    FornecedorListComponent,
    FornecedorFormComponent,
    FornecedorFindComponent
  ],
  providers: [
    FornecedorService,
    FornecedorDocumentoService
  ],
  entryComponents: [FornecedorFindComponent]
})
export class FornecedorModule { }
