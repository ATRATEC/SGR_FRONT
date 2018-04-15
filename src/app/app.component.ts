import { ChangePasswordUserComponent } from './usuario/changepassworduser.component';
import { EditUserComponent } from './usuario/edituser.component';
import { DialogService } from './dialog/dialog.service';
import { AddUserComponent } from './usuario/adduser.component';
import { ClienteFindComponent } from './cliente/cliente-find.component';
import { isNullOrUndefined } from 'util';
import { FornecedorFindComponent } from './fornecedor/fornecedor-find.component';
import { environment } from './../environments/environment';
import { Router } from '@angular/router';
import { DialogComponent } from './dialog/dialog.component';
import { AlertSettings } from './alert-settings';
import { AlertType } from './alert-type';
import { AlertsService } from './alerts.service';
import { TokenManagerService } from './token-manager.service';
import { UserService } from './user.service';
import { LoginService } from './login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from './user';
import { LoginComponent } from './login/login.component';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Injectable, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response } from '@angular/http';
import { Perfil } from './perfil';
import { ResetComponent } from './usuario/reset.component';
import { booleanToStrSN, strToBoolean } from './utilitario/utilitarios';

// const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse'];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  animal: string;
  name: string;
  login: string;
  Logado: boolean;
  Usuario: User;
  perfil: Perfil;
  users: User[];
  private loginUrl = environment.urlbase + '/api/login';
  private usersUrl = environment.urlbase + '/api/users';

  constructor(
    private tokenManager: TokenManagerService,
    private loginService: LoginService,
    private userService: UserService,
    public modal: MatDialog,
    private dialog: DialogService,
    private _alert: AlertsService,
    private _router: Router
  ) {
    if (!this.verificaLogin()) {
      // this.openLoginDialog();
      this.Logado = false;
    }
  }

  ngOnInit(): void {
    if (!sessionStorage.getItem('Logado')) {
      this.perfil = new Perfil();
    }
    // this.logOut();
  }

  open(type: AlertType) {
    // const conf: AlertSettings = new AlertSettings();

    const settings: AlertSettings = {
      overlay: true,
      overlayClickToClose: false,
      showCloseButton: true,
      duration: 0
    };

    this._alert.create(type, 'This is a message', 'SGR', settings);
  }

  verificaLogin() {
    // if (localStorage.getItem('Logado')) {
    //   this.Usuario = JSON.parse(localStorage.getItem('currentUser'));
    //   this.Logado = true;
    //   return true;
    // }
    if (sessionStorage.getItem('Logado')) {
      this.Usuario = JSON.parse(localStorage.getItem('currentUser'));
      this.perfil = this.sessionStorageToPerfil();
      // this.perfil = JSON.parse(localStorage.getItem('Perfil'));
      this.Logado = true;
      return true;
    }
    return false;
  }

  chamalogin() {
    this.loginService.Login('atxaloisio@hotmail.com', 'mestre').subscribe(
      data => {
        console.log(data);
        this.Usuario = data.usuario;
        console.log(this.Usuario.name);
        console.log(data.token);
        this.getUsuarios(data.token);
      },
      error => alert(error)
    );
  }
  // chamalogin() {
  //   this.realizaLogin().subscribe(data => {
  //     console.log(data);
  //     this.Usuario = data.usuario;
  //     console.log(this.Usuario.name);
  //     console.log(data.token);
  //     // this.getUsuarios(data.token);
  //   },
  //     error => alert(error),
  //   );
  // }

  // realizaLogin() {
  //   const headers = new Headers({
  //     'Content-Type': 'application/json',
  //     Accept: 'application/json'
  //   });

  //   const postData = {
  //     email: 'atxaloisio@hotmail.com',
  //     password: 'mestre'
  //   };

  //   return this.http.post(this.loginUrl, JSON.stringify(postData), {
  //     headers: headers
  //   })
  //     .map((res: Response) => res.json())
  //     .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  // }

  getUsuarios(accessToken: string) {
    this.userService.getUsers(accessToken).subscribe(users => {
      this.users = users;
      for (let index = 0; index < this.users.length; index++) {
        const item: User = this.users[index];
        console.log(item.name);
      }
    });
  }

  // getUsuarios(accessToken: string) {
  //   this.getUsers(accessToken).subscribe(users => {
  //     this.users = users;
  //     console.log(users);
  //   });
  // }

  // getUsers(accessToken: string): Observable<User[]> {
  //   const headers = new Headers({
  //     Accept: 'application/json',
  //     Authorization: 'Bearer ' + accessToken
  //   });

  //   return this.http
  //     .get(this.usersUrl, {
  //       headers: headers
  //     })
  //     .map((res: Response) => res.json())
  //     .catch((error: any) =>
  //       Observable.throw(error.json().error || 'Server error')
  //     );
  // }

  // openDialog(): void {
  //   let dialogRef = this.modal.open(DialogOverviewComponent, {
  //     width: '250px',
  //     disableClose: true,
  //     data: { name: this.name, animal: this.animal }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     this.animal = result;
  //   });
  // }

  openLoginDialog(): void {
    const dialogLoginRef = this.modal.open(LoginComponent, {
      width: '500px',
      height: '330px',
      disableClose: true,
      data: { email: '', password: '' }
    });

    dialogLoginRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      if (result.Usuario != null && result.Usuario !== undefined) {
        this.Usuario = result.Usuario;
        this.Logado = result.logado;
        this.perfil = result.Perfil;
        this._router.navigate(['/']);
        this.tokenManager.store(result.token);
        localStorage.setItem('currentUser', JSON.stringify(this.Usuario));
        localStorage.setItem('Logado', JSON.stringify({ Logado: this.Logado }));
        localStorage.setItem('Perfil', JSON.stringify({ Perfil: this.perfil }));
        sessionStorage.setItem(
          'Logado',
          JSON.stringify({ Logado: this.Logado })
        );
        sessionStorage.setItem(
          'Perfil',
          JSON.stringify({ Perfil: this.perfil })
        );
        this.perfilToSessionStorage(this.perfil);
      } else {
        if (result.reset) {
          const dialogResetRef = this.modal.open(ResetComponent, {
            width: '500px',
            height: '320px',
            disableClose: true,
            data: { email: '', password: '' }
          });
        }
      }
    });
  }

  perfilToSessionStorage(p: Perfil) {
    sessionStorage.setItem(
      'cadastros',
      JSON.stringify({
        cadastros: strToBoolean(this.perfil.cadastros)
      })
    );
    sessionStorage.setItem(
      'cadastros_servico',
      JSON.stringify({
        cadastros_servico: strToBoolean(this.perfil.cadastros_servico)
      })
    );
    sessionStorage.setItem(
      'cadastros_cliente',
      JSON.stringify({
        cadastros_cliente: strToBoolean(this.perfil.cadastros_cliente)
      })
    );
    sessionStorage.setItem(
      'cadastros_contrato',
      JSON.stringify({
        cadastros_contrato: strToBoolean(this.perfil.cadastros_contrato)
      })
    );
    sessionStorage.setItem(
      'cadastros_contrato_cliente',
      JSON.stringify({
        cadastros_contrato_cliente: strToBoolean(
          this.perfil.cadastros_contrato_cliente
        )
      })
    );
    sessionStorage.setItem(
      'cadastros_contrato_fornecedor',
      JSON.stringify({
        cadastros_contrato_fornecedor: strToBoolean(
          this.perfil.cadastros_contrato_fornecedor
        )
      })
    );
    sessionStorage.setItem(
      'cadastros_documento_cliente',
      JSON.stringify({
        cadastros_documento_cliente: strToBoolean(
          this.perfil.cadastros_documento_cliente
        )
      })
    );
    sessionStorage.setItem(
      'cadastros_documento_fornecedor',
      JSON.stringify({
        cadastros_documento_fornecedor: strToBoolean(
          this.perfil.cadastros_documento_fornecedor
        )
      })
    );
    sessionStorage.setItem(
      'cadastros_equipamento',
      JSON.stringify({
        cadastros_equipamento: strToBoolean(this.perfil.cadastros_equipamento)
      })
    );
    sessionStorage.setItem(
      'cadastros_fornecedor',
      JSON.stringify({
        cadastros_fornecedor: strToBoolean(this.perfil.cadastros_fornecedor)
      })
    );
    sessionStorage.setItem(
      'cadastros_residuo',
      JSON.stringify({
        cadastros_residuo: strToBoolean(this.perfil.cadastros_residuo)
      })
    );
    sessionStorage.setItem(
      'cadastros_residuo_acondicionamento',
      JSON.stringify({
        cadastros_residuo_acondicionamento: strToBoolean(
          this.perfil.cadastros_residuo_acondicionamento
        )
      })
    );
    sessionStorage.setItem(
      'cadastros_residuo_classe_residuo',
      JSON.stringify({
        cadastros_residuo_classe_residuo: strToBoolean(
          this.perfil.cadastros_residuo_classe_residuo
        )
      })
    );
    sessionStorage.setItem(
      'cadastros_residuo_residuos',
      JSON.stringify({
        cadastros_residuo_residuos: strToBoolean(
          this.perfil.cadastros_residuo_residuos
        )
      })
    );
    sessionStorage.setItem(
      'cadastros_residuo_tipo_residuo',
      JSON.stringify({
        cadastros_residuo_tipo_residuo: strToBoolean(
          this.perfil.cadastros_residuo_tipo_residuo
        )
      })
    );
    sessionStorage.setItem(
      'cadastros_residuo_tipo_tratamento',
      JSON.stringify({
        cadastros_residuo_tipo_tratamento: strToBoolean(
          this.perfil.cadastros_residuo_tipo_tratamento
        )
      })
    );
    sessionStorage.setItem(
      'cadastros_residuo_unidade',
      JSON.stringify({
        cadastros_residuo_unidade: strToBoolean(
          this.perfil.cadastros_residuo_unidade
        )
      })
    );
    sessionStorage.setItem(
      'processos',
      JSON.stringify({
        processos: strToBoolean(this.perfil.processos)
      })
    );
    sessionStorage.setItem(
      'processos_apuracao_locacao',
      JSON.stringify({
        processos_apuracao_locacao: strToBoolean(
          this.perfil.processos_apuracao_locacao
        )
      })
    );
    sessionStorage.setItem(
      'processos_manifesto',
      JSON.stringify({
        processos_manifesto: strToBoolean(this.perfil.processos_manifesto)
      })
    );
    sessionStorage.setItem(
      'processos_monitor_documento',
      JSON.stringify({
        processos_monitor_documento: strToBoolean(
          this.perfil.processos_monitor_documento
        )
      })
    );
    sessionStorage.setItem(
      'processos_pesagem',
      JSON.stringify({
        processos_pesagem: strToBoolean(this.perfil.processos_pesagem)
      })
    );
    sessionStorage.setItem(
      'relatorios',
      JSON.stringify({
        relatorios: strToBoolean(this.perfil.relatorios)
      })
    );
    sessionStorage.setItem(
      'relatorios_consolidado_periodo',
      JSON.stringify({
        relatorios_consolidado_periodo: strToBoolean(
          this.perfil.relatorios_consolidado_periodo
        )
      })
    );
    sessionStorage.setItem(
      'relatorios_controle_pagamento',
      JSON.stringify({
        relatorios_controle_pagamento: strToBoolean(
          this.perfil.relatorios_controle_pagamento
        )
      })
    );
    sessionStorage.setItem(
      'relatorios_controle_pesagem',
      JSON.stringify({
        relatorios_controle_pesagem: strToBoolean(
          this.perfil.relatorios_controle_pesagem
        )
      })
    );
    sessionStorage.setItem(
      'relatorios_gerencia_ambiente_verde',
      JSON.stringify({
        relatorios_gerencia_ambiente_verde: strToBoolean(
          this.perfil.relatorios_gerencia_ambiente_verde
        )
      })
    );
    sessionStorage.setItem(
      'relatorios_gerencia_cliente',
      JSON.stringify({
        relatorios_gerencia_cliente: strToBoolean(
          this.perfil.relatorios_gerencia_cliente
        )
      })
    );
    sessionStorage.setItem(
      'relatorios_gerencial',
      JSON.stringify({
        relatorios_gerencial: strToBoolean(this.perfil.relatorios_gerencial)
      })
    );
    sessionStorage.setItem(
      'relatorios_mapa_residuos',
      JSON.stringify({
        relatorios_mapa_residuos: strToBoolean(
          this.perfil.relatorios_mapa_residuos
        )
      })
    );
    sessionStorage.setItem(
      'relatorios_protocolo_entrega',
      JSON.stringify({
        relatorios_protocolo_entrega: strToBoolean(
          this.perfil.relatorios_protocolo_entrega
        )
      })
    );
    sessionStorage.setItem(
      'aclcontrol_adicionar_usuario',
      JSON.stringify({
        aclcontrol_adicionar_usuario: strToBoolean(
          this.perfil.aclcontrol_adicionar_usuario
        )
      })
    );
  }

  sessionStorageToPerfil(): Perfil {
    const p = new Perfil();
    p.cadastros = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('cadastros')).cadastros
    );
    p.cadastros_servico = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('cadastros_servico')).cadastros_servico
    );
    p.cadastros_cliente = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('cadastros_cliente')).cadastros_cliente
    );
    p.cadastros_contrato = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('cadastros_contrato'))
        .cadastros_contrato
    );
    p.cadastros_contrato_cliente = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('cadastros_contrato_cliente'))
        .cadastros_contrato_cliente
    );
    p.cadastros_contrato_fornecedor = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('cadastros_contrato_fornecedor'))
        .cadastros_contrato_fornecedor
    );
    p.cadastros_documento_cliente = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('cadastros_documento_cliente'))
        .cadastros_documento_cliente
    );
    p.cadastros_documento_fornecedor = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('cadastros_documento_fornecedor'))
        .cadastros_documento_fornecedor
    );
    p.cadastros_equipamento = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('cadastros_equipamento'))
        .cadastros_equipamento
    );
    p.cadastros_fornecedor = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('cadastros_fornecedor'))
        .cadastros_fornecedor
    );
    p.cadastros_residuo = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('cadastros_residuo'))
        .cadastros_residuo
    );
    p.cadastros_residuo_acondicionamento = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('cadastros_residuo_acondicionamento'))
        .cadastros_residuo_acondicionamento
    );
    p.cadastros_residuo_classe_residuo = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('cadastros_residuo_classe_residuo'))
        .cadastros_residuo_classe_residuo
    );
    p.cadastros_residuo_residuos = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('cadastros_residuo_residuos'))
        .cadastros_residuo_residuos
    );
    p.cadastros_residuo_tipo_residuo = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('cadastros_residuo_tipo_residuo'))
        .cadastros_residuo_tipo_residuo
    );
    p.cadastros_residuo_tipo_tratamento = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('cadastros_residuo_tipo_tratamento'))
        .cadastros_residuo_tipo_tratamento
    );
    p.cadastros_residuo_unidade = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('cadastros_residuo_unidade'))
        .cadastros_residuo_unidade
    );
    p.processos = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('processos'))
        .processos
    );
    p.processos_apuracao_locacao = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('processos_apuracao_locacao'))
        .processos_apuracao_locacao
    );
    p.processos_manifesto = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('processos_manifesto'))
        .processos_manifesto
    );
    p.processos_monitor_documento = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('processos_monitor_documento'))
        .processos_monitor_documento
    );
    p.processos_pesagem = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('processos_pesagem'))
        .processos_pesagem
    );
    p.relatorios = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('relatorios'))
        .relatorios
    );
    p.relatorios_consolidado_periodo = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('relatorios_consolidado_periodo'))
        .relatorios_consolidado_periodo
    );
    p.relatorios_controle_pagamento = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('relatorios_controle_pagamento'))
        .relatorios_controle_pagamento
    );
    p.relatorios_controle_pesagem = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('relatorios_controle_pesagem'))
        .relatorios_controle_pesagem
    );
    p.relatorios_gerencia_ambiente_verde = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('relatorios_gerencia_ambiente_verde'))
        .relatorios_gerencia_ambiente_verde
    );
    p.relatorios_gerencia_cliente = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('relatorios_gerencia_cliente'))
        .relatorios_gerencia_cliente
    );
    p.relatorios_gerencial = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('relatorios_gerencial'))
        .relatorios_gerencial
    );
    p.relatorios_mapa_residuos = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('relatorios_mapa_residuos'))
        .relatorios_mapa_residuos
    );
    p.relatorios_protocolo_entrega = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('relatorios_protocolo_entrega'))
        .relatorios_protocolo_entrega
    );
    p.aclcontrol_adicionar_usuario = booleanToStrSN(
      JSON.parse(sessionStorage.getItem('aclcontrol_adicionar_usuario'))
        .aclcontrol_adicionar_usuario
    );



    return p;
  }

  openDialog(): void {
    const dialogLoginRef = this.modal.open(DialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
      data: {
        title: 'SGR',
        message: environment.urlbase,
        showOkButton: false,
        showYesNoButton: true,
        showCancelButton: false,
        type: 'question'
      }
    });

    dialogLoginRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // alert('sua mensagem de retorno foi' + result.retorno );
      // console.log(result.retorno);
      // if ((result.Usuario != null) || (result.Usuario !== undefined)) {
      //   this.Usuario = result.Usuario;
      //   this.Logado = result.logado;
      //   this.tokenManager.store(result.token);
      //   localStorage.setItem('currentUser', JSON.stringify(this.Usuario));
      //   localStorage.setItem('Logado', JSON.stringify({Logado: this.Logado}));
      // }
    });
  }

  logOut(): void {
    this.Logado = false;
    this.tokenManager.delete();
    sessionStorage.removeItem('Logado');
    sessionStorage.removeItem('Perfil');
    localStorage.removeItem('Logado');
    localStorage.removeItem('currentUser');
  }

  lerToken() {
    alert(this.tokenManager.retrieve());
  }

  openPesquisa(): void {
    const dialogLoginRef = this.modal.open(ClienteFindComponent, {
      width: '600px',
      height: '400px',
      disableClose: true,
      data: {
        id: null,
        razao_social: null
      }
    });

    dialogLoginRef.afterClosed().subscribe(result => {
      this.animal = '';
      if (result.id != null && result.id !== undefined) {
        this.animal = result.id + '' + result.razao_social;
      }
      // console.log('The dialog was closed');
      // alert('sua mensagem de retorno foi' + result.retorno );
      // console.log(result.retorno);
      // if ((result.Usuario != null) || (result.Usuario !== undefined)) {
      //   this.Usuario = result.Usuario;
      //   this.Logado = result.logado;
      //   this.tokenManager.store(result.token);
      //   localStorage.setItem('currentUser', JSON.stringify(this.Usuario));
      //   localStorage.setItem('Logado', JSON.stringify({Logado: this.Logado}));
      // }
    });
  }

  downloadPDF() {
    this.userService.downloadPDF().subscribe(data => {
      const fileUrl = URL.createObjectURL(data);
      const tab = window.open();
      tab.location.href = fileUrl;
    });
  }

  // converte() {
  //   console.log(strToBoolean('N'));
  //   console.log(booleanToStrSN(false));
  // }

  // emailFormControl = new FormControl('', [
  //   Validators.required,
  //   Validators.pattern(EMAIL_REGEX)]);

  openAddUsuario(): void {
    const dialogResetRef = this.modal.open(AddUserComponent, {
      width: '400px',
      height: '510px',
      disableClose: true,
      data: {name: '', email: '', password: '', confpassword: '' }
    });
  }

  openEditUsuario(): void {
    const dialogResetRef = this.modal.open(EditUserComponent, {
      width: '400px',
      height: '510px',
      disableClose: true,
      data: {name: '', email: '', password: '', confpassword: '' }
    });
  }

  openChangePasswordtUsuario(): void {
    const dialogResetRef = this.modal.open(ChangePasswordUserComponent, {
      width: '400px',
      height: '430px',
      disableClose: true,
      data: {
        usuario: this.Usuario
      }
    });
  }

}
