import { DespesaFormComponent } from './despesa-form.component';
import { ReceitaClienteFormComponent } from './receitacliente-form.component';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { ReceitaFormComponent } from './receita-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'relatorios/receita', component: ReceitaFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/receitacliente', component: ReceitaClienteFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/despesa', component: DespesaFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelatorioRoutingModule { }
