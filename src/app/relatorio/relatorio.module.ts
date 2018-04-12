import { MapaResiduoFormComponent } from './maparesiduo-form.component';
import { FiltroMapaResiduoFormComponent } from './filtromaparesiduo-form.component';
import { RelatorioFormComponent } from './relatorio-form.component';
import { FiltroRelatorioFormComponent } from './filtrorelatorio-form.component';
import { RelatorioPesagemFormComponent } from './relatoriopesagem-form.component';
import { FiltroPesagemFormComponent } from './filtropesagem-form.component';
import { DatepipeModule } from './../datepipe/datepipe.module';
import { FiltroClienteFormComponent } from './filtrocliente-form.component';
import { DespesaFormComponent } from './despesa-form.component';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReceitaFormComponent } from './receita-form.component';
import { RelatorioClienteFormComponent } from './relatoriocliente-form.component';
import { RelatorioService } from './relatorio.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RelatorioRoutingModule } from './relatorio-routing.module';

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
    RelatorioRoutingModule
  ],
  declarations: [
    ReceitaFormComponent,
    FiltroClienteFormComponent,
    FiltroRelatorioFormComponent,
    RelatorioFormComponent,
    RelatorioClienteFormComponent,
    DespesaFormComponent,
    FiltroPesagemFormComponent,
    RelatorioPesagemFormComponent,
    FiltroMapaResiduoFormComponent,
    MapaResiduoFormComponent
  ],
  providers: [RelatorioService]
})
export class RelatorioModule { }
