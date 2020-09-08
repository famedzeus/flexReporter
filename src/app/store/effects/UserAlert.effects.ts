import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { AlertActionType, IAlert, IAlertMeta } from '../../store/reducers/UserAlerts.reducer'

@Injectable()
export class UserAlertEffectService {
  readonly storePartition: string = 'userAlerts'
  constructor (
    private store: Store<Array<IAlertMeta>>
  ) {}

  addAlert (alert: IAlert) {
    this.store
      .dispatch({
        type: AlertActionType.AddAlert,
        payload: {
          data: alert
        }
      })
  }

  setAlertDisplayed (alert: IAlert) {
    this.store
      .dispatch({
        type: AlertActionType.SetDisplayed,
        payload: {
          data: alert
        }
      })
  }

  setAlertNotified (alert: IAlert) {
    this.store
      .dispatch({
        type: AlertActionType.SetNotified,
        payload: {
          data: alert
        }
      })
  }

  setAllAlertsDisplayed () {
    this.store
      .dispatch({
        type: AlertActionType.SetAllDisplayed,
        payload: {}
      })
  }

  getAlertsByScope$ (scopeId: string) {
    return this.alerts$.map(alerts => alerts.filter(alert => alert.scopeId === scopeId))
  }

  get alerts$ () {
    return this.store.select<Array<IAlertMeta>>(store => store[this.storePartition])
  }
}
