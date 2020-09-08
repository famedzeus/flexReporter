import { Component, Input } from '@angular/core'
import { MatDialogRef } from '@angular/material'

@Component({
  template: `
    <h3 mat-dialog-title>
      {{ titleLocale | translate }}
    </h3>
    <mat-dialog-content>
      <p>
        {{ bodyLocale | translate }}
      </p>
      <code *ngIf="extraInformationLocale" style="white-space: pre-wrap; display: block;">{{ extraInformationLocale | translate }}</code>

    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button color="accent" type="button" (click)="cancel()">
        {{ rejectLocale | translate }}
      </button>
      <div style="flex: 1"></div>
      <button mat-raised-button [color]="confirmColour" type="button" (click)="confirmAction()">
        {{ confirmLocale | translate }}
      </button>
    </mat-dialog-actions>
  `
})
export class ConfirmationDialogComponent {
  @Input() titleLocale = 'confirm_title'
  @Input() bodyLocale = 'confirm_body'
  @Input() extraInformationLocale = ''
  @Input() rejectLocale = 'cancel'
  @Input() confirmLocale = 'confirm_button'
  @Input() confirmColour = 'warn'

  constructor (
    private instance: MatDialogRef<any>
  ) {}

  confirmAction () {
    this.instance.close(true)
  }

  cancel () {
    this.instance.close(false)
  }
}
