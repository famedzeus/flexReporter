import { Component, ViewEncapsulation } from '@angular/core'
import { Router } from '@angular/router'
import { GlobalActivityEffectService, ParameterEffectService } from 'effects'
import { ParameterService, IResourceFilter, EqualityOperator } from 'entities'
import { UserAuth } from '../Auth'
import { AlertBrokerService } from './AlertBroker.service'
import { UserAlertsService } from '../UserAlerts'
import { IntlService } from '../../intl'
import { TasksManagerService } from '../Tasks'
import { ActivityDialogService } from '../core/LoadingDialog'
import config from 'app-config'

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../index.scss'],
  template: `
  <app-header (onAlertClick)="toggleAlerts()"></app-header>
  <app-content
    (backdropClick)="toggleAlerts()"
    [sidenavOpen]="displayAlerts"></app-content>
  <app-footer></app-footer>
  `
})
export class AppComponent {
  appConfig = config
  displayAlerts = false
  protected fetch = fetch.bind(window)

  constructor(
    globalActivityEffects: GlobalActivityEffectService,
    activityDialog: ActivityDialogService,
    router: Router,
    private auth: UserAuth,
    alertBroker: AlertBrokerService,
    private parameterEffects: ParameterEffectService,
    private intl: IntlService,
    userAlerts: UserAlertsService,
    public taskManager: TasksManagerService
  ) {
    router.initialNavigation()
    this.initialiseParameters()
    userAlerts.initialiseSubscriptions()
    alertBroker.subscribeToAlerts()
    this.intl.setLangOnChange()
    this.setEndpoints().then(r => config.endpoints =  r)
    this.tasksOnAuthChange()
    // Let activity dialog service subscribe to store changes
    activityDialog.setDialogState$(globalActivityEffects.activityState$)
  }

  /**
   * Starts and stops task polling based upon auth status observable
   */
  tasksOnAuthChange() {
    this.auth
      .isAuthFailed$
      .distinctUntilChanged()
      .subscribe(isAuthFailed => {
        if (isAuthFailed) {
          this.taskManager.stop()
        } else {
          // this.taskManager.start()
        }
      })
  }

  initialiseParameters() {
    // const filters: Array<IResourceFilter> = [{
    //   name: ParameterService.meta.fieldNames.parameter,
    //   type: EqualityOperator.Match,
    //   value: 'VSUI'
    // }]
    // this.parameterEffects.getCollection(null, filters).catch()
  }

  toggleAlerts() {
    this.displayAlerts = !this.displayAlerts
  }

  /**
     * Fetches a json endpoints set.
     */
  setEndpoints(): Promise<any> {
    const now = (new Date()).getTime()
    const localeUrl = `${config.endPointsUri}/endpoints.json?${now}`
    return this.fetch(localeUrl)
      .then((r: Response) => r.json())
  }

}
