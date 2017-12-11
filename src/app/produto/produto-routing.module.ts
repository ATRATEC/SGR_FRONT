import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { ProdutoListComponent } from './produto-list.component';
import { ProdutoFormComponent } from './produto-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'produtos', component: ProdutoListComponent, canActivate: [AuthGuard] },
  { path: 'produtos/produto', component: ProdutoFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdutoRoutingModule { }
