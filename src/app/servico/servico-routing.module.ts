import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { ServicoListComponent } from './servico-list.component';
import { ServicoFormComponent } from './servico-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'servicos', component: ServicoListComponent, canActivate: [AuthGuard] },
  { path: 'servicos/servico', component: ServicoFormComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'servicos/servico/:id', component: ServicoFormComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicoRoutingModule { }
