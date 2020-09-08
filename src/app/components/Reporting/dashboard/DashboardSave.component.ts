import { Component, Inject, Injectable, Input, Output, OnInit, EventEmitter } from '@angular/core'
import { CanDeactivate } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { MatDialog, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Dialog } from '../dialogues/dialogues.component'

const template = require('./DashboardSave.component.html')

/**
 * @description
 
 */
@Component({
  selector: 'c-dashboard-guard',
  template: './DashboardSave.component.html'
})
export class DashboardSaveGuard implements CanDeactivate<any> {

  @Input() changeMade: boolean

  constructor(
    private dialog: MatDialog
  ) {

  }

  openDialog(config): Observable<any> {
    let dialogRef = this.dialog.open(Dialog, {
      data: config
    });

    return dialogRef.afterClosed()
  }


  canDeactivate(changes): Observable<boolean> | Promise<boolean> | boolean {

    if (changes.changeMade) {
      this.openDialog({
        type: 'question',
        message: 'Save changes',
        text: 'Save changes to ' + changes.currentDataSource.name + '?',
        icon: 'fa-warning'
      }).subscribe(result => {
        if (result == 'true') {
          changes.saveChanges()
        } else {
          changes.changeMade = false
        }
      })
      return false
    } else {
      return true
    }

  }

  ngOnInit() {

  }



}

