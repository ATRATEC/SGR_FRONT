import { UserService } from './../user.service';
import { Perfil } from './../perfil';
import { User } from './../user';
import { LoginService } from './../login.service';
import { isNullOrUndefined } from 'util';
import { isEmpty } from 'rxjs/operators';
import { Data } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  hide = true;
  erroLogin: boolean;
  msgErroLogin = '';
  emProcessamento = false;

  valEmail = new FormControl('', [Validators.email, Validators.required]);

  constructor(private loginService: LoginService,
    public userService: UserService,
    public snackBar: MatSnackBar,
    public dialogLoginRef: MatDialogRef<ResetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  onEntrarClick(): void {
    this.data.logado = false;
    let mensagem = '';
    this.emProcessamento = true;
    if (isNullOrUndefined(this.data.email)) {
      mensagem = 'e-mail do usuário não informado.';
    }

    if (isNullOrUndefined(this.data.password)) {
      if (!isNullOrUndefined(mensagem)) {
          mensagem = mensagem + '/n';
      }
      mensagem = mensagem + 'e-mail do usuário não informado.';
    }

    if ((!isNullOrUndefined(this.data.email)) &&
       (!isNullOrUndefined(this.data.password))) {
        this.loginService.Login(this.data.email, this.data.password).subscribe(data => {
          // console.log(data);
          this.data.Usuario = data.usuario;
          this.data.Perfil = data.perfil;
          // console.log(this.Usuario.name);
          // console.log(data.token);
          // this.getUsuarios(data.token);
          this.data.token = data.token;
          this.data.logado = data.logado;
          // this.emProcessamento = false;
          this.dialogLoginRef.close(this.data);
        },
          error => {
            this.setErroLogin(error);
        });
    }
  }

  setErroLogin(erro: any) {
    if ((!isNullOrUndefined(erro.error)) && (isNullOrUndefined(erro.message))) {
      this.msgErroLogin = erro.error + ' ' + erro.message;
    } else {
      this.msgErroLogin = 'Não foi possivel se comunicar com o servidor';
    }

    this.erroLogin = true;
    this.emProcessamento = false;
  }


  onNoClick(): void {
    this.data.Usuario = null;
    this.data.Perfil = new Perfil();
    this.data.token = '';
    this.data.logado = false;
    this.dialogLoginRef.close(this.data);
  }

  onResetClick(): void {
    this.data.Usuario = null;
    this.data.Perfil = new Perfil();
    this.data.token = '';
    this.data.logado = false;
    this.data.reset = true;
    this.dialogLoginRef.close(this.data);
  }

  getEmailErrorMessage() {
    let mensagem = '';
    if (this.valEmail.hasError('required')) {
      mensagem = 'Campo e-mail não informado.';
    }

    if (mensagem === '') {
      if (this.valEmail.hasError('email')) {
        mensagem = 'e-mail inválido.';
      }
    }
    return mensagem;
  }

  onEnter(value: string) {
    if (value !== '') {
      this.onEntrarClick();
    }
  }

  getPasswordErrorMessage() {
    const mensagem = '';
    return mensagem;
  }

}
