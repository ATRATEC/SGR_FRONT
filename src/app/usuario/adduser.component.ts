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
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AddUserComponent implements OnInit {
  hide = true;

  private _name = '';
  private _email = '';
  private _password = '';
  private _confpassword = '';
  private _perfil: number;

  perfis: Perfil[];

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

  @Input('email')
  set email(email: string){
    this._email = email;
  }
  get email(): string {
    return this._email;
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

  @Input('perfil')
  set perfil(perfil: number){
    this._perfil = perfil;
  }
  get perfil(): number {
    return this._perfil;
  }


  valPerfil = new FormControl('', [Validators.required]);
  valNome = new FormControl('', [Validators.required]);
  valEmail = new FormControl('', [Validators.email, Validators.required]);
  valPassword = new FormControl('', [Validators.minLength(6), Validators.required]);
  valConfPassword = new FormControl('', [Validators.minLength(6), Validators.required,
    passwordEqualsValidator(this.valPassword)]);

  constructor(private _userService: UserService,
    private _tokenManager: TokenManagerService,
    private _snackBar: MatSnackBar,
    public dialogLoginRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.perfil = null;
    this.perfis = new Array<Perfil>();
    this._userService.getListPerfis(this._tokenManager.retrieve()).subscribe(
      data => {
        this.perfis = JSON.parse(data._body);
      }
    );
  }

  validaCampos(): boolean {
    return this.valNome.valid && this.valEmail.valid && this.valPassword.valid && this.valConfPassword.valid;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  onEntrarClick(): void {
    this.emProcessamento = true;
    if (this.validaCampos()) {
      this._userService.addUsuario(this._tokenManager.retrieve(),
      this.name, this.email, this.password, this.confpassword, this.perfil).subscribe(
        data => {
          this.emProcessamento = false;
          this.openSnackBar('Usuário ' + this.name + ' adicionado com sucesso.', 'SGR');
          this.dialogLoginRef.close(this.data);
        },
        error => {
          this.emProcessamento = false;
          this.openSnackBar(error.message, error.error);
        });
    }

    // this.data.logado = false;
    // let mensagem = '';

    // if (isNullOrUndefined(this.data.email)) {
    //   mensagem = 'e-mail do usuário não informado.';
    // }

    // if (isNullOrUndefined(this.data.password)) {
    //   if (!isNullOrUndefined(mensagem)) {
    //       mensagem = mensagem + '/n';
    //   }
    //   mensagem = mensagem + 'e-mail do usuário não informado.';
    // }

    // if ((!isNullOrUndefined(this.data.email)) &&
    //    (!isNullOrUndefined(this.data.password))) {
    //     this.loginService.Login(this.data.email, this.data.password).subscribe(data => {
    //       // console.log(data);
    //       this.data.Usuario = data.usuario;
    //       this.data.Perfil = data.perfil;
    //       // console.log(this.Usuario.name);
    //       // console.log(data.token);
    //       // this.getUsuarios(data.token);
    //       this.data.token = data.token;
    //       this.data.logado = data.logado;
    //       // this.emProcessamento = false;
    //       this.dialogLoginRef.close(this.data);
    //     },
    //       error => {
    //         this.setErroMsg(error);
    //     });
    // }
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
