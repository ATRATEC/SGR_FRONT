import { RelatorioFormComponent } from './relatorio-form.component';
import { FiltroRelatorioFormComponent } from './filtrorelatorio-form.component';
import { RelatorioPesagemFormComponent } from './relatoriopesagem-form.component';
import { FiltroPesagemFormComponent } from './filtropesagem-form.component';
import { RelatorioClienteFormComponent } from './relatoriocliente-form.component';
import { DespesaFormComponent } from './despesa-form.component';
import { FiltroClienteFormComponent } from './filtrocliente-form.component';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { ReceitaFormComponent } from './receita-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'relatorios/gerencial', component: FiltroRelatorioFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/gerencialreport', component: RelatorioFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/cliente', component: FiltroClienteFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/clientereport', component: RelatorioClienteFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/despesa', component: DespesaFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/pesagem', component: FiltroPesagemFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/pesagemreport', component: RelatorioPesagemFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelatorioRoutingModule { }
