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
import { ClienteComponent } from './cliente/cliente.component';
import { MovimentoComponent } from './movimento/movimento.component';
import { ProdutoModule } from './produto/produto.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClienteComponent,
    MovimentoComponent
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
    AppRoutingModule
  ],
  providers: [LoginService, UserService, TokenManagerService, AuthGuard],
  entryComponents: [LoginComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
