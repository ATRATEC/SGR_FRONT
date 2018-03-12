import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { LocacaoListComponent } from './locacao-list.component';
import { LocacaoFormComponent } from './locacao-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'locacoes', component: LocacaoListComponent, canActivate: [AuthGuard] },
  { path: 'locacoes/locacao', component: LocacaoFormComponent, canActivate: [AuthGuard] },
  { path: 'locacoes/locacao/:id', component: LocacaoFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocacaoRoutingModule { }
