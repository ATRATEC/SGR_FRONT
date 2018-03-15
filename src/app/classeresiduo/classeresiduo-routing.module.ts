import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { ClasseResiduoListComponent } from './classeresiduo-list.component';
import { ClasseResiduoFormComponent } from './classeresiduo-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'classeresiduos', component: ClasseResiduoListComponent, canActivate: [AuthGuard] },
  {
    path: 'classeresiduos/classeresiduo',
    component: ClasseResiduoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'classeresiduos/classeresiduo/:id',
    component: ClasseResiduoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClasseResiduoRoutingModule { }
