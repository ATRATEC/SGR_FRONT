import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { ProdutoListComponent } from './produto-list.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'produtos', component: ProdutoListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdutoRoutingModule { }
