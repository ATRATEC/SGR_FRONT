import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AcondicionamentoListComponent } from './acondicionamento-list.component';
import { AcondicionamentoFormComponent } from './acondicionamento-form.component';
import { AcondicionamentoService } from './acondicionamento.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AcondicionamentoRoutingModule } from './acondicionamento-routing.module';

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
    AcondicionamentoRoutingModule
  ],
  declarations: [
    AcondicionamentoListComponent,
    AcondicionamentoFormComponent
  ],
  providers: [AcondicionamentoService]
})
export class AcondicionamentoModule { }
