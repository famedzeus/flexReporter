import { Component, Output, EventEmitter } from '@angular/core'
import { UserAlertsService } from './UserAlerts.service'

@Component({
  selector: 'user-alert-notifications',
  styleUrls: ['./UserAlertNotifications.component.scss'],
  template: `
    <a href="" (click)="$event.preventDefault(); onAlertClick.emit()"><i class="fa fa-bell-o" [class.shout]="undisplayedAlerts > 0"></i></a>
    <span class="alert-count" [hidden]="undisplayedAlerts === 0">{{undisplayedAlerts}}</span>
  `
})
export class UserAlertNotificationsComponent {
  @Output() onAlertClick = new EventEmitter()
  undisplayedAlerts = 0
  constructor (
    userAlerts: UserAlertsService
  ) {
    userAlerts
      .globalAlerts$
      .debounceTime(500)
      .map(alerts => alerts.filter(alert => alert.hasDisplayed === false))
      .subscribe(alerts => {
        this.undisplayedAlerts = alerts.length
      })
  }
}
