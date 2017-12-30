import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TipoDocumentoListComponent } from './tipodocumento-list.component';
import { TipoDocumentoFormComponent } from './tipodocumento-form.component';
import { TipoDocumentoService } from './tipodocumento.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoDocumentoRoutingModule } from './tipodocumento-routing.module';

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
    TipoDocumentoRoutingModule
  ],
  declarations: [
    TipoDocumentoListComponent,
    TipoDocumentoFormComponent
  ],
  providers: [TipoDocumentoService]
})
export class TipoDocumentoModule { }
