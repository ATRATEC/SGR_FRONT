import { TokenManagerService } from './../token-manager.service';
import { UserService } from './../user.service';
import { Perfil } from './../perfil';
import { User } from './../user';
import { LoginService } from './../login.service';
import { isNullOrUndefined } from 'util';
import { isEmpty } from 'rxjs/operators';
import { Data } from '@angular/router';
import { Component, OnInit, Inject, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, Validators, ValidatorFn } from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {passwordEqualsValidator} from './password-equals.directive';

@Component({
  selector: 'app-changepassworduser',
  templateUrl: './changepassworduser.component.html',
  styleUrls: ['./changepassworduser.component.css']
})
export class ChangePasswordUserComponent implements OnInit {
  hide = true;

  usuario: User;
  private _name = '';
  private _oldpassword = '';
  private _password = '';
  private _confpassword = '';

  erroLogin: boolean;
  msgErroLogin = '';
  emProcessamento = false;

  @Input('name')
  set name(name: string){
    this._name = name;
  }
  get name(): string {
    return this._name;
  }

  @Input('password')
  set password(password: string){
    this._password = password;
  }
  get password(): string {
    return this._password;
  }

  @Input('confpassword')
  set confpassword(confpassword: string){
    this._confpassword = confpassword;
  }
  get confpassword(): string {
    return this._confpassword;
  }

  valNome = new FormControl('', [Validators.required]);
  valPassword = new FormControl('', [Validators.minLength(6), Validators.required]);
  valConfPassword = new FormControl('', [Validators.minLength(6), Validators.required,
    passwordEqualsValidator(this.valPassword)]);

  constructor(private _userService: UserService,
    private _tokenManager: TokenManagerService,
    private _snackBar: MatSnackBar,
    public dialogLoginRef: MatDialogRef<ChangePasswordUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.usuario = new User();
    if (!isNullOrUndefined(this.data.usuario)) {
      this.usuario = this.data.usuario;
    }
    this.name = this.usuario.name;
  }

  validaCampos(): boolean {
    return  this.valPassword.valid && this.valConfPassword.valid;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  onEntrarClick(): void {
    this.emProcessamento = true;
    if (this.validaCampos()) {
      this._userService.changePasswordUsuario(this._tokenManager.retrieve(), this.usuario.id,
      this.password, this.confpassword).subscribe(
        data => {
          this.emProcessamento = false;
          this.openSnackBar('Senha alterada com sucesso.', 'SGR');
          this.dialogLoginRef.close(this.data);
        },
        error => {
          this.emProcessamento = false;
          this.openSnackBar(error.message, error.error);
        });
    }
  }

  setErroMsg(erro: any) {
    if ((!isNullOrUndefined(erro.error)) && (isNullOrUndefined(erro.message))) {
      this.msgErroLogin = erro.error + ' ' + erro.message;
    } else {
      this.msgErroLogin = 'Não foi possivel se comunicar com o servidor';
    }

    this.erroLogin = true;
    this.emProcessamento = false;
  }


  onNoClick(): void {
    this.dialogLoginRef.close();
  }

  onResetClick(): void {
    this.dialogLoginRef.close();
  }

  getErrorMessage(control: FormControl) {
    let mensagem = '';
    if (control.hasError('required')) {
      mensagem = 'Campo obrigatório.';
    }

    if (mensagem === '') {
      if (control.hasError('email')) {
        mensagem = 'e-mail inválido.';
      }
    }

    if (mensagem === '') {
      if (control.hasError('pwsinvalid')) {
        mensagem = 'Senhas informadas não conferem .';
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
