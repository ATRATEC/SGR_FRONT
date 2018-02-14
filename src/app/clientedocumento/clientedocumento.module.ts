import { DatepipeModule } from '../datepipe/datepipe.module';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ClienteDocumentoListComponent } from './clientedocumento-list.component';
import { ClienteDocumentoFormComponent } from './clientedocumento-form.component';
import { ClienteDocumentoService } from './clientedocumento.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteDocumentoRoutingModule } from './clientedocumento-routing.module';
import { UpperCaseModule } from '../uppercase/uppercase.module';

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
    UpperCaseModule,
    ClienteDocumentoRoutingModule
  ],
  declarations: [
    ClienteDocumentoListComponent,
    ClienteDocumentoFormComponent
  ],
  providers: [ClienteDocumentoService]
})
export class ClienteDocumentoModule { }
