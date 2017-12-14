import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { TipoAtividadeListComponent } from './tipoatividade-list.component';
import { TipoAtividadeFormComponent } from './tipoatividade-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'tipoatividades', component: TipoAtividadeListComponent, canActivate: [AuthGuard] },
  { path: 'tipoatividades/tipoatividade', component: TipoAtividadeFormComponent, canActivate: [AuthGuard] },
  { path: 'tipoatividades/tipoatividade/:id', component: TipoAtividadeFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoAtividadeRoutingModule { }
