import { Injectable } from '@angular/core'
import { UserAlertEffectService } from 'effects'
import { AlertEmitter } from 'services'

/**
 * Middle man service to map any ServicesModule - AlertEmitter messages to store dispatches
 * as it is best not to import effects services into generic ServicesModule and this
 * would also cause circular dependencies
 */
@Injectable()
export class
AlertBrokerService {
  constructor (
    private userAlertEffects: UserAlertEffectService,
    private alertEmitter: AlertEmitter
  ) {}

  subscribeToAlerts () {
    return this
      .alertEmitter
      .subscribe(alert => {
        this.userAlertEffects
          .addAlert(alert)
      })
  }
}
