import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { ContratoFornecedorListComponent } from './contratofornecedor-list.component';
import { ContratoFornecedorFormComponent } from './contratofornecedor-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'contratofornecedores',
    component: ContratoFornecedorListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contratofornecedores/contratofornecedor',
    component: ContratoFornecedorFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'contratofornecedores/contratofornecedor/:id',
    component: ContratoFornecedorFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratoFornecedorRoutingModule {}
