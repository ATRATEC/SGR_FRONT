import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TipoAtividadeListComponent } from './tipoatividade-list.component';
import { TipoAtividadeFormComponent } from './tipoatividade-form.component';
import { TipoAtividadeService } from './tipoatividade.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoAtividadeRoutingModule } from './tipoatividade-routing.module';

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
    TipoAtividadeRoutingModule
  ],
  declarations: [
    TipoAtividadeListComponent,
    TipoAtividadeFormComponent
  ],
  providers: [TipoAtividadeService]
})
export class TipoAtividadeModule { }
