import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { FornecedorListComponent } from './fornecedor-list.component';
import { FornecedorFormComponent } from './fornecedor-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'fornecedores',
    component: FornecedorListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'fornecedores/fornecedor',
    component: FornecedorFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'fornecedores/fornecedor/:id',
    component: FornecedorFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FornecedorRoutingModule {}
