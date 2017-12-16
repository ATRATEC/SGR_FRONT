import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { ClienteListComponent } from './cliente-list.component';
import { ClienteFormComponent } from './cliente-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'clientes', component: ClienteListComponent, canActivate: [AuthGuard] },
  { path: 'clientes/cliente', component: ClienteFormComponent, canActivate: [AuthGuard] },
  { path: 'clientes/cliente/:id', component: ClienteFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
