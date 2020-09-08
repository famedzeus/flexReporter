import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core'
import { UserAlertsService } from './UserAlerts.service'
import { IAlertMeta } from '../../store/reducers/UserAlerts.reducer'
import { Observable, Subscription } from 'rxjs'
import * as moment from 'moment'

@Component({
  selector: 'user-alerts',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./UserAlerts.component.scss'],
  template: `
  <mat-list>
    <h3 mat-subheader>
      <i class="fa fa-bullhorn"></i>{{ 'user_notifications' | translate }}
    </h3>
    <mat-list-item *ngIf="alerts.length === 0">
      {{ 'no_notifications' | translate }}
    </mat-list-item>
    <mat-list-item *ngFor="let alert of alerts; trackBy: trackBy" [class.item-highlight]="alert.hasDisplayed === false">
      <user-alert [alert]="alert"></user-alert>
      <span class="alert-meta">{{ alert.timeAgo }}</span>
    </mat-list-item>
  </mat-list>
  `
})
export class UserAlertsComponent implements OnDestroy, OnInit {
  alerts: Array<IAlertMeta> = []
  private alerts$: Observable<Array<IAlertMeta>> = Observable.of([])
  private subscriptions: Array<Subscription> = []
  constructor (
    private userAlerts: UserAlertsService
  ) {}

  ngOnDestroy () {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  ngOnInit () {
    // Updates alert timeAgo every 10 second or so
    const alerts$ = Observable
      .timer(0, 1000)
      .flatMap(() => this.userAlerts
        .globalAlerts$
        .map(alerts =>
          alerts
            .map(alert => ({
              ...alert,
              timeAgo: moment(alert.created).fromNow()
            })))
      )

    const alertsSubscription = alerts$
      .subscribe(alerts => {
        this.alerts = alerts
      })

    // Clear alerts when component is created
    const undisplayedAlertSubscription = this.userAlerts
      .globalAlerts$
      .filter(alerts => alerts.some(alert => alert.hasDisplayed === false))
      .subscribe(() => {
        this.userAlerts.setAllDisplayed()
      })

    this.subscriptions = this.subscriptions.concat([alertsSubscription, undisplayedAlertSubscription])
  }

  trackBy (index: number, alert: IAlertMeta) {
    return alert.__id
  }
}
