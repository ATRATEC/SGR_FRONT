import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Injectable()
export class DialogService {

  constructor(private dialog: MatDialog) { }


  success(_title: string, _message: string, _detail: string = '') {
    const dialogLoginRef = this.dialog.open(DialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
      data: { title: _title,
              message: _message,
              detail: _detail,
              showOkButton: true,
              showYesNoButton: false,
              showCancelButton: false,
              type: 'success'
            }
    });
  }

  error(_title: string, _message: string, _detail: string = '') {
    const dialogLoginRef = this.dialog.open(DialogComponent, {
      width: '450px',
      height: '300px',
      disableClose: true,
      data: { title: _title,
              message: _message,
              detail: _detail,
              showOkButton: true,
              showYesNoButton: false,
              showCancelButton: false,
              type: 'error'
            }
    });
  }

  warning(_title: string, _message: string, _detail: string = '') {
    const dialogLoginRef = this.dialog.open(DialogComponent, {
      width: '450px',
      height: '300px',
      disableClose: true,
      data: { title: _title,
              message: _message,
              detail: _detail,
              showOkButton: true,
              showYesNoButton: false,
              showCancelButton: false,
              type: 'warning'
            }
    });
  }

  info(_title: string, _message: string, _detail: string = '') {
    const dialogLoginRef = this.dialog.open(DialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
      data: { title: _title,
              message: _message,
              detail: _detail,
              showOkButton: true,
              showYesNoButton: false,
              showCancelButton: false,
              type: 'info'
            }
    });
  }

  question(_title: string, _message: string, _detail: string = ''): Observable<any> {
    const dialogLoginRef = this.dialog.open(DialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
      data: { title: _title,
              message: _message,
              detail: _detail,
              showOkButton: false,
              showYesNoButton: true,
              showCancelButton: false,
              type: 'question'
            }
    });

    return dialogLoginRef.afterClosed();

    // dialogLoginRef.afterClosed().subscribe(result => {
    //   return result.retorno;
    // });
  }

  // confirm (_title: string, _message: string, _detail: string = ''): Observable<any> {
  //   const dialogLoginRef = this.dialog.open(DialogComponent, {
  //     width: '450px',
  //     height: '250px',
  //     disableClose: true,
  //     data: { title: _title,
  //             message: _message,
  //             detail: _detail,
  //             showOkButton: false,
  //             showYesNoButton: true,
  //             showCancelButton: false,
  //             type: 'question'
  //           }
  //   });

  //   return dialogLoginRef.afterClosed();

  //   // dialogLoginRef.afterClosed().subscribe(result => {
  //   //   return result.retorno;
  //   // });
  // }

  confirm(message?: string): Observable<boolean> {
    const confirmation = window.confirm(message);

    return Observable.of(confirmation);
  }
}
