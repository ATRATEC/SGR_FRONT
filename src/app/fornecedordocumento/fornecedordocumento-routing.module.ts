import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { FornecedorDocumentoListComponent } from './fornecedordocumento-list.component';
import { FornecedorDocumentoFormComponent } from './fornecedordocumento-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'fornecedordocumentos', component: FornecedorDocumentoListComponent, canActivate: [AuthGuard] },
  { path: 'fornecedordocumentos/fornecedordocumento', component: FornecedorDocumentoFormComponent, canActivate: [AuthGuard] },
  { path: 'fornecedordocumentos/fornecedordocumento/:id', component: FornecedorDocumentoFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FornecedorDocumentoRoutingModule { }
