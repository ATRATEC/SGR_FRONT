import { ClienteDocumentoLoteComponent } from './clientedocumento-lote.component';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { ClienteDocumentoListComponent } from './clientedocumento-list.component';
import { ClienteDocumentoFormComponent } from './clientedocumento-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'clientedocumentos', component: ClienteDocumentoListComponent, canActivate: [AuthGuard] },
  { path: 'clientedocumentos/clientedocumento', component: ClienteDocumentoFormComponent, canActivate: [AuthGuard] },
  { path: 'clientedocumentos/clientedocumento/:id', component: ClienteDocumentoFormComponent, canActivate: [AuthGuard] },
  { path: 'clientedocumentos/clientedocumentolote', component: ClienteDocumentoLoteComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteDocumentoRoutingModule { }
