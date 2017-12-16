import { EnderecoService } from './endereco.service';
import { ClienteModule } from './cliente/cliente.module';
import { TipoTratamentoModule } from './tipotratamento/tipotratamento.module';
import { ResiduoModule } from './residuo/residuo.module';
import { TipoAtividadeModule } from './tipoatividade/tipoatividade.module';
import { ClasseResiduoModule } from './classeresiduo/classeresiduo.module';
import { AcondicionamentoModule } from './acondicionamento/acondicionamento.module';
import { DialogService } from './dialog/dialog.service';
import { AlertsService } from './alerts.service';
import { AuthGuard } from './auth-guard';
import { TokenManagerService } from './token-manager.service';
import { UserService } from './user.service';
import { LoginService } from './login.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MyMaterialModule} from './my-material/my-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatNativeDateModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './/app-routing.module';
import { MovimentoComponent } from './movimento/movimento.component';
import { ProdutoModule } from './produto/produto.module';
import { OnlyNumberDirective } from './only-number.directive';
import { AlertComponent } from './alert/alert.component';
import { AlertsComponent } from './alerts/alerts.component';
import { DialogComponent } from './dialog/dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MovimentoComponent,
    OnlyNumberDirective,
    AlertComponent,
    AlertsComponent,
    DialogComponent
  ],
  imports: [
    FlexLayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MyMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    CommonModule,
    ProdutoModule,
    AcondicionamentoModule,
    ClasseResiduoModule,
    TipoAtividadeModule,
    TipoTratamentoModule,
    ClienteModule,
    ResiduoModule,
    AppRoutingModule
  ],
  providers: [
    LoginService,
    UserService,
    TokenManagerService,
    AuthGuard,
    AlertsService,
    DialogService,
    EnderecoService
  ],
  entryComponents: [LoginComponent, DialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
