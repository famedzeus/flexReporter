import { Component, Input } from '@angular/core'
import { IAlertMeta } from 'reducers'

@Component({
  selector: 'user-alert',
  styleUrls: ['./UserAlert.component.scss'],
  template: `
    <div *ngIf="alert"
      [class.error-alert]="alert.alertType === 'error'"
      [class.info-alert]="alert.alertType === 'info'"
      [class.success-alert]="alert.alertType === 'success'">
      <span [ngSwitch]="alert.alertType">
        <i *ngSwitchCase="'success'" class="fa fa-check"></i>
        <i *ngSwitchCase="'error'" class="fa fa-exclamation-triangle"></i>
        <i *ngSwitchCase="'info'" class="fa fa-info-circle"></i>
      </span>
      <span *ngIf="alert.titleLocale">
        {{ alert.titleLocale | translate }}
        <p>{{ alert.messageLocale | translate }}</p>
      </span>
      <span *ngIf="!alert.titleLocale">
        {{ alert.messageLocale | translate }}
      </span>

      <i class="fa info-toggle"
        *ngIf="alert.validationFailures && alert.validationFailures.length > 0 || alert.rawMessage"
        [matTooltip]="'toggle_extra_info' | translate"
        (click)="toggleExtraInformation()"
        [class.fa-plus]="showExtraInformation === false"
        [class.fa-minus]="showExtraInformation === true"></i>

      <p [hidden]="!alert.rawMessage">
        <strong>{{ 'raw_message' | translate }}</strong>
        {{alert.rawMessage}}
      </p>
      <mat-list *ngIf="alert.validationFailures && alert.validationFailures.length > 0 && showExtraInformation === true">
        <mat-list-item *ngFor="let failure of alert.validationFailures">
          {{failure.error}}
        </mat-list-item>
      </mat-list>
    </div>
  `
})
export class UserAlertComponent {
  @Input() alert: IAlertMeta = null
  showExtraInformation = false

  toggleExtraInformation () {
    this.showExtraInformation = !this.showExtraInformation
  }
}
