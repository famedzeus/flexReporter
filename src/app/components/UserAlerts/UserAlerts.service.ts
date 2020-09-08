import { Injectable } from '@angular/core'
import { MatSnackBar, MatSnackBarRef } from '@angular/material'
import { UserAlertEffectService } from 'effects'
import { IAlertMeta } from 'reducers'
import { UserAlertComponent } from './UserAlert.component'
import { UserNotificationService } from './UserNotification.service'

/**
 * Component service to display snackbar alerts
 */
@Injectable()
export class UserAlertsService {
  alerts: Array<IAlertMeta> = []
  private snackbarRef: MatSnackBarRef<UserAlertComponent> = null

  constructor (
    private userAlertEffects: UserAlertEffectService,
    private snackbar: MatSnackBar,
    private notifications: UserNotificationService
  ) {}

  get globalAlerts$ () {
    return this.userAlertEffects
      .getAlertsByScope$('global')
  }

  initialiseSubscriptions () {
    this.globalAlerts$
      .map(alerts => alerts.filter(alert => alert.hasNotified === false && alert.isImportant === true))
      .subscribe(alerts => {
        alerts
          .forEach(alert => {
            this.notifications
              .addNotification(
                alert.titleLocale,
                alert.messageLocale
              ).catch()
            this.userAlertEffects.setAlertNotified(alert)
          })
      })

    this.globalAlerts$
      .map(alerts => alerts.filter(alert => alert.hasDisplayed === false))
      .filter(alerts => alerts.length > 0)
      .throttleTime(5000)
      .subscribe(alerts => {
        const [alert] = alerts
        this.snackbarRef = this.snackbar
          .openFromComponent(UserAlertComponent, {
            duration: 4000
          })

        this.snackbarRef
          .afterOpened()
          .subscribe(() => {
            this.userAlertEffects
              .setAlertDisplayed(alert)
          })

        this.snackbarRef.instance.alert = alert
      })

  }

  setAllDisplayed () {
    this.userAlertEffects.setAllAlertsDisplayed()
  }
}
