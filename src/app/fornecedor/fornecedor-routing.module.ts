import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { FornecedorListComponent } from './fornecedor-list.component';
import { FornecedorFormComponent } from './fornecedor-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'fornecedores', component: FornecedorListComponent, canActivate: [AuthGuard] },
  { path: 'fornecedores/fornecedor', component: FornecedorFormComponent, canActivate: [AuthGuard] },
  { path: 'fornecedores/fornecedor/:id', component: FornecedorFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FornecedorRoutingModule { }
