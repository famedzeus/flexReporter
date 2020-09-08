import { Component, EventEmitter, Input, OnInit } from '@angular/core'
import { IAlert, IAlerts } from './Alert.types'

/**
 * Component class to display rootAlerts
 */
@Component({
  selector: 'c-alerts',
  styleUrls: ['./Alerts.component.scss'],
  templateUrl: './Alerts.component.html'
})
export class AlertsComponent implements OnInit {
  alerts: IAlerts = []
  @Input() alertsDisabled: boolean = false
  @Input() alertPosition = 'relative'
  @Input() emitter: EventEmitter<IAlert> = new EventEmitter<IAlert>()

  ngOnInit () {
    this
      .emitter
      .subscribe((alert: IAlert) => setTimeout(() => this.addAlert(alert), 0))
  }

  addAlert (alert: IAlert) {
    if (this.alertsDisabled) return

    this.alerts.unshift(alert)
    const to = setTimeout(() => this.removeAlert(alert, to), alert.displayMilliseconds)
  }

  clearAlerts () {
    this.alerts = []
  }

  removeAlert (alert: IAlert, timeout ?: any) {
    this.alerts = this.alerts.filter(nAlert => alert !== nAlert)
    clearTimeout(timeout)
  }
}
