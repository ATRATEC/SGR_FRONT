import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { PesagemListComponent } from './pesagem-list.component';
import { PesagemFormComponent } from './pesagem-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'pesagens', component: PesagemListComponent, canActivate: [AuthGuard] },
  { path: 'pesagens/pesagem', component: PesagemFormComponent, canActivate: [AuthGuard] },
  { path: 'pesagens/pesagem/:id', component: PesagemFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PesagemRoutingModule { }
