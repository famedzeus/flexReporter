import { Injectable } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material'
import { Observable, Subscription } from 'rxjs'
import { CogActivityComponent } from './CogActivityPanel.component'
import { ActivityState, ActivityType } from './ActivityState.types'

@Injectable()
export class ActivityDialogService {
  private dialogInstance: MatDialogRef<CogActivityComponent>
  private dialogState: Subscription
  private closeTimeout: number

  constructor(
    private dialog: MatDialog
  ) { }

  setDialogState$ (
    state$: Observable<ActivityState>
  ) {
    if (this.dialogState) {
      this.dialogState.unsubscribe()
    }

    // React to state changes with dialog actions
    this.dialogState = state$
      .subscribe(dialogState => {
        // Use timeouts to prevent dialog close/reopen with flow of states.
        // TODO: Figure out how to manage this with rxjs observable methods
        clearTimeout(this.closeTimeout)
        if (dialogState.status === ActivityType.None) {
          this.closeTimeout = setTimeout(() => this.closeDialog(), 400)
        } else {
          const instance = this.openDialog()
          if (instance.componentInstance) {
            instance.componentInstance.message = dialogState.message
            instance.componentInstance.status = dialogState.message
          }
        }
      })
  }

  private closeDialog () {
    if (this.dialogInstance !== undefined) {
      this.dialogInstance.close()
      this.dialogInstance = undefined
    }
  }


  private openDialog () {
    if (this.dialogInstance === undefined || !this.dialogInstance.componentInstance) {
      this.dialogInstance = this.dialog
        .open(CogActivityComponent, { disableClose: true, panelClass: 'cog-bg' })
    }

    return this.dialogInstance
  }
}