import { MatDialog, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA, MatDialogClose } from '@angular/material'
import { AfterViewInit, Component, Inject, Injectable, Input, Output, OnInit, EventEmitter } from '@angular/core'

@Component({
  selector: 'prompt-dialog',
  template: `
    <div mat-dialog-title>
      <span [class]="'fa ' + data.icon"></span>&nbsp;&nbsp;{{data.message}}
    </div>
    <div mat-dialog-content>
     <p>{{data.text}}</p>
    </div>
    <div *ngIf="data.type == 'question'" mat-dialog-actions>
      <button mat-button (click)="onNoClick()">No</button>
      <button mat-button [mat-dialog-close]="'true'" cdkFocusInitial>Yes</button>
    </div>
    <div *ngIf="data.type == 'notify'" mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Ok</button>
    </div>
  `
})
export class Dialog {

  constructor(
    public dialogRef: MatDialogRef<Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}