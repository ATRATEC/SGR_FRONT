import { User } from './../user';
import { LoginService } from './../login.service';
import { isNullOrUndefined } from 'util';
import { isEmpty } from 'rxjs/operators';
import { Data } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  erroLogin: boolean;
  msgErroLogin = '';
  emProcessamento = false;

  valEmail = new FormControl('', [Validators.email, Validators.required]);
  valPassword = new FormControl('', [Validators.required]);

  constructor(private loginService: LoginService,
    public dialogLoginRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
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
          // console.log(this.Usuario.name);
          // console.log(data.token);
          // this.getUsuarios(data.token);
          this.data.token = data.token;
          this.data.logado = data.logado;
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
    this.data.token = '';
    this.data.logado = false;
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
    let mensagem = '';

    if (this.valPassword.hasError('required')) {
      mensagem = mensagem + 'Campo senha não informado.';
    }
    return mensagem;
  }

}
