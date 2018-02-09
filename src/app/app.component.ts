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
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response } from '@angular/http';

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
  users: User[];
  private loginUrl = environment.urlbase + '/api/login';
  private usersUrl = environment.urlbase + '/api/users';

  options = {
    direction: 'row',
    mainAxis: 'space-around',
    crossAxis: 'center'
  };

  direction = 'row';
  someValue = 20;
  mainAxis = 'space-around';
  crossAxis = 'center';

  constructor(private tokenManager: TokenManagerService,
              private loginService: LoginService,
              private userService: UserService,
              public dialog: MatDialog,
              private _alert: AlertsService,
              private _router: Router ) {
    if (!this.verificaLogin()) {
      // this.openLoginDialog();
      this.Logado = false;
    }
  }

  ngOnInit(): void {
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
      this.Logado = true;
      return true;
    }
    return false;
  }


  chamalogin() {
    this.loginService.Login('atxaloisio@hotmail.com', 'mestre').subscribe(data => {
      console.log(data);
      this.Usuario = data.usuario;
      console.log(this.Usuario.name);
      console.log(data.token);
      this.getUsuarios(data.token);
    },
      error => alert(error),
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
  //   let dialogRef = this.dialog.open(DialogOverviewComponent, {
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
    const dialogLoginRef = this.dialog.open(LoginComponent, {
      width: '500px',
      height: '320px',
      disableClose: true,
      data: { email: '', password: ''}
    });

    dialogLoginRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      if ((result.Usuario != null) || (result.Usuario !== undefined)) {
        this.Usuario = result.Usuario;
        this.Logado = result.logado;
        this._router.navigate(['/']);
        this.tokenManager.store(result.token);
        localStorage.setItem('currentUser', JSON.stringify(this.Usuario));
        localStorage.setItem('Logado', JSON.stringify({Logado: this.Logado}));
        sessionStorage.setItem('Logado', JSON.stringify({Logado: this.Logado}));
      }
    });
  }

  openDialog(): void {
    const dialogLoginRef = this.dialog.open(DialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
      data: { title: 'SGR',
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
    localStorage.removeItem('Logado');
    localStorage.removeItem('currentUser');
  }

  layoutAlign() {
    return `${this.options.mainAxis} ${this.options.crossAxis}`;
  }

  layoutAlign2() {
    return `${this.mainAxis} ${this.crossAxis}`;
  }

  toggleDirection() {
    const next = (DIRECTIONS.indexOf(this.direction) + 1) % DIRECTIONS.length;
    this.direction = DIRECTIONS[next];
  }

  lerToken() {
    alert(this.tokenManager.retrieve());
  }

  openPesquisa(): void {
    const dialogLoginRef = this.dialog.open(ClienteFindComponent, {
      width: '600px',
      height: '400px',
      disableClose: true,
      data: { id: null,
              razao_social: null
            }
    });

    dialogLoginRef.afterClosed().subscribe(result => {
      this.animal = '';
      if ((result.id != null) && (result.id !== undefined)) {
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
    this.userService
      .downloadPDF()
      .subscribe(data => {
        const fileUrl = URL.createObjectURL(data);
        const tab = window.open();
        tab.location.href = fileUrl;
      });
  }

  // emailFormControl = new FormControl('', [
  //   Validators.required,
  //   Validators.pattern(EMAIL_REGEX)]);
}
