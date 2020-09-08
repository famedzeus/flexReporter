import { Component, OnDestroy, OnInit } from '@angular/core'
import { UserAuth } from './user-auth'
import { Subscription } from 'rxjs'

@Component({
  selector: 'unauthorised-message',
  template: `
    <warning-card
      titleLocale="access_denied"
      [warningList]="authErrorCodes"
      contentSuffixKey="contact_helpdesk">
    </warning-card>
  `
})
export class UnauthorisedComponent implements OnInit, OnDestroy {
  authErrorCodes: Array<string> = []
  private errorSubscription: Subscription = null

  constructor (
    private UserAuth: UserAuth
  ) {

  }

  ngOnDestroy () {
    if (this.errorSubscription === null) return

    this.errorSubscription.unsubscribe()
  }

  ngOnInit () {
    this.errorSubscription = this.UserAuth
      .subErrors(errorCodes => {
        this.authErrorCodes = errorCodes
      })
  }
}
