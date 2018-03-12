import { RelatorioClienteFormComponent } from './relatoriocliente-form.component';
import { DespesaFormComponent } from './despesa-form.component';
import { FiltroClienteFormComponent } from './filtrocliente-form.component';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { ReceitaFormComponent } from './receita-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'relatorios/receita', component: ReceitaFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/cliente', component: FiltroClienteFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/clientereport', component: RelatorioClienteFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/despesa', component: DespesaFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelatorioRoutingModule { }
