import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { AcondicionamentoListComponent } from './acondicionamento-list.component';
import { AcondicionamentoFormComponent } from './acondicionamento-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'acondicionamentos', component: AcondicionamentoListComponent, canActivate: [AuthGuard] },
  {
    path: 'acondicionamentos/acondicionamento',
    component: AcondicionamentoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'acondicionamentos/acondicionamento/:id',
    component: AcondicionamentoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcondicionamentoRoutingModule { }
