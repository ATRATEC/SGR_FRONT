import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { MonitorDocumentoFormComponent } from './monitordocumento-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'monitordocumento', component: MonitorDocumentoFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitorDocumentoRoutingModule { }
