import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { UnidadeListComponent } from './unidade-list.component';
import { UnidadeFormComponent } from './unidade-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'unidades', component: UnidadeListComponent, canActivate: [AuthGuard] },
  { path: 'unidades/unidade', component: UnidadeFormComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'unidades/unidade/:id', component: UnidadeFormComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnidadeRoutingModule { }
