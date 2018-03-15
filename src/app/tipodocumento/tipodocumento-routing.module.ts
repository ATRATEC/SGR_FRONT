import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { TipoDocumentoListComponent } from './tipodocumento-list.component';
import { TipoDocumentoFormComponent } from './tipodocumento-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'tipodocumentos',
    component: TipoDocumentoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tipodocumentos/tipodocumento',
    component: TipoDocumentoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'tipodocumentos/tipodocumento/:id',
    component: TipoDocumentoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoDocumentoRoutingModule {}
