import { DatepipeModule } from './../datepipe/datepipe.module';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MonitorDocumentoFormComponent } from './monitordocumento-form.component';
import { MonitorDocumentoService } from './monitordocumento.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonitorDocumentoRoutingModule } from './monitordocumento-routing.module';

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
    MonitorDocumentoRoutingModule
  ],
  declarations: [
    MonitorDocumentoFormComponent
  ],
  providers: [MonitorDocumentoService]
})
export class MonitorDocumentoModule { }
