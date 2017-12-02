import { MovimentoComponent } from './movimento/movimento.component';
import { ClienteComponent } from './cliente/cliente.component';
import { AuthGuard } from './auth-guard';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',   redirectTo: '/', pathMatch: 'full' },
  { path: 'clientes', component: ClienteComponent, canActivate: [AuthGuard] },
  { path: 'movimentos', component: MovimentoComponent, canActivate: [AuthGuard] }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
