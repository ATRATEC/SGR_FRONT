import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { ManifestoListComponent } from './manifesto-list.component';
import { ManifestoFormComponent } from './manifesto-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'manifestos', component: ManifestoListComponent, canActivate: [AuthGuard] },
  { path: 'manifestos/manifesto', component: ManifestoFormComponent, canActivate: [AuthGuard] },
  { path: 'manifestos/manifesto/:id', component: ManifestoFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManifestoRoutingModule { }
