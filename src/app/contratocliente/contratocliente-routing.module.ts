import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { ContratoClienteListComponent } from './contratocliente-list.component';
import { ContratoClienteFormComponent } from './contratocliente-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'contratoclientes',
    component: ContratoClienteListComponent,
    canActivate: [AuthGuard] },
  {
    path: 'contratoclientes/contratocliente',
    component: ContratoClienteFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'contratoclientes/contratocliente/:id',
    component: ContratoClienteFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratoClienteRoutingModule { }
