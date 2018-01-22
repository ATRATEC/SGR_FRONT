import { ManifestoModule } from './manifesto/manifesto.module';
import { ContratoClienteModule } from './contratocliente/contratocliente.module';
import { CustomCurrencyMaskConfig } from './customcurrencymaskconfig';
import { CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ContratoFornecedorModule } from './contratofornecedor/contratofornecedor.module';
import { ServicoModule } from './servico/servico.module';
import { UnidadeModule } from './unidade/unidade.module';
import { FornecedorDocumentoModule } from './fornecedordocumento/fornecedordocumento.module';
import { ClienteDocumentoModule } from './clientedocumento/clientedocumento.module';
import { TipoDocumentoModule } from './tipodocumento/tipodocumento.module';
import { FornecedorModule } from './fornecedor/fornecedor.module';
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
import { NgModule, LOCALE_ID } from '@angular/core';
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
import { HomeComponent } from './home/home.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MovimentoComponent,
    OnlyNumberDirective,
    AlertComponent,
    AlertsComponent,
    DialogComponent,
    HomeComponent
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
    TipoDocumentoModule,
    ClienteDocumentoModule,
    ClienteModule,
    FornecedorDocumentoModule,
    FornecedorModule,
    UnidadeModule,
    ResiduoModule,
    ServicoModule,
    ContratoFornecedorModule,
    ContratoClienteModule,
    ManifestoModule,
    AppRoutingModule
  ],
  providers: [
    LoginService,
    UserService,
    TokenManagerService,
    AuthGuard,
    AlertsService,
    DialogService,
    EnderecoService,
    CurrencyMaskModule,
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  entryComponents: [LoginComponent, DialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
