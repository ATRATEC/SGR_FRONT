import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { TipoResiduoListComponent } from './tiporesiduo-list.component';
import { TipoResiduoFormComponent } from './tiporesiduo-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'tiporesiduos',
    component: TipoResiduoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tiporesiduos/tiporesiduo',
    component: TipoResiduoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'tiporesiduos/tiporesiduo/:id',
    component: TipoResiduoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoResiduoRoutingModule {}
