import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { EquipamentoListComponent } from './equipamento-list.component';
import { EquipamentoFormComponent } from './equipamento-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'equipamentos',
    component: EquipamentoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'equipamentos/equipamento',
    component: EquipamentoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'equipamentos/equipamento/:id',
    component: EquipamentoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipamentoRoutingModule {}
