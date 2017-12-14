import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { ResiduoListComponent } from './residuo-list.component';
import { ResiduoFormComponent } from './residuo-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'residuos', component: ResiduoListComponent, canActivate: [AuthGuard] },
  { path: 'residuos/residuo', component: ResiduoFormComponent, canActivate: [AuthGuard] },
  { path: 'residuos/residuo/:id', component: ResiduoFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResiduoRoutingModule { }
