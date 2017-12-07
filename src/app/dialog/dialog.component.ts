import { isNullOrUndefined } from 'util';
import { isEmpty } from 'rxjs/operators';
import { Data } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  animations: [
    trigger('overlayAn', [
      state('void', style({opacity: 0})),
      state('leave', style({opacity: 0})),
      state('enter', style({opacity: 1})),
      transition('void => enter', animate('450ms ease-in-out')),
      transition('enter => leave', animate('450ms ease-in-out'))
    ]),
    trigger('wrapperAn', [
      state('void', style({opacity: 0, transform: 'scale(0.75, 0.75) translate(0, -100vh)'})),
      state('leave', style({opacity: 0, transform: 'scale(0.75, 0.75) translate(0, -100vh)'})),
      state('enter', style({opacity: 1, transform: 'scale(1, 1) translate(0, 0)'})),
      transition('void => enter', animate('450ms cubic-bezier(.5, 1.4, .5, 1)')),
      transition('enter => leave', animate('450ms cubic-bezier(.5, 1.4, .5, 1)'))
    ]),
    trigger('symbolAn', [
      state('void', style({opacity: 0, transform: 'rotate(90deg) scale(0.1, 0.1)'})),
      state('leave', style({opacity: 0, transform: 'rotate(90deg) scale(0.1, 0.1)'})),
      state('enter', style({opacity: 1, transform: 'rotate(0deg)'})),
      transition('void => enter', animate('450ms 100ms ease-in-out')),
      transition('enter => leave', animate('450ms 100ms ease-in-out'))
    ]),
    trigger('messageAn', [
      state('void', style({opacity: 0, transform: 'translate(0, 20px) scale(0.01, 0.01)'})),
      state('leave', style({opacity: 0, transform: 'translate(0, 20px) scale(0.01, 0.01)'})),
      state('enter', style({opacity: 1, transform: 'translate(0, 0)'})),
      transition('void => enter', animate('450ms 100ms ease-in-out')),
      transition('enter => leave', animate('450ms 100ms ease-in-out'))
    ]),
    trigger('shortAn', [
      transition('void => enter', [
        animate('450ms 200ms ease-in-out', keyframes([
          style({opacity: 0, transform: 'scale(0, 0)', offset: 0}),
          style({transform: 'scale(1.5, 1.5)', offset: 0.35}),
          style({transform: 'scale(0.9, 0.9)',  offset: 0.85}),
          style({opacity: 1, transform: 'scale(1, 1)',  offset: 1.0})
        ]))
      ])
    ])
  ]
})
export class DialogComponent implements OnInit {

  animationState = 'enter';

  constructor( public dialogRef: MatDialogRef <DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onEntrarClick(): void {
    this.data.retorno = true;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.animationState = 'leave';
    this.data.retorno = false;
    this.dialogRef.close(this.data);
  }

  closeSelf() {

  }
}
