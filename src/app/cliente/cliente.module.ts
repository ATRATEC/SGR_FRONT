import { ClienteFindComponent } from './cliente-find.component';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ClienteListComponent } from './cliente-list.component';
import { ClienteFormComponent } from './cliente-form.component';
import { ClienteService } from './cliente.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteRoutingModule } from './cliente-routing.module';
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
    UpperCaseModule,
    ClienteRoutingModule
  ],
  declarations: [
    ClienteListComponent,
    ClienteFormComponent,
    ClienteFindComponent
  ],
  providers: [ClienteService],
  entryComponents: [ClienteFindComponent]
})
export class ClienteModule { }
