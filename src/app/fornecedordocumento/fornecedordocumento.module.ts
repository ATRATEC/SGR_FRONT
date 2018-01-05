import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FornecedorDocumentoListComponent } from './fornecedordocumento-list.component';
import { FornecedorDocumentoFormComponent } from './fornecedordocumento-form.component';
import { FornecedorDocumentoService } from './fornecedordocumento.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FornecedorDocumentoRoutingModule } from './fornecedordocumento-routing.module';

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
    FornecedorDocumentoRoutingModule
  ],
  declarations: [
    FornecedorDocumentoListComponent,
    FornecedorDocumentoFormComponent
  ],
  providers: [FornecedorDocumentoService]
})
export class FornecedorDocumentoModule { }
