import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { UserAuth } from './user-auth'
import { Subscription } from 'rxjs'

@Component({
  selector: 'authentication',
  styleUrls: ['./Authentication.component.scss'],
  template: `
    <authenticating-progress *ngIf="authenticationPending"></authenticating-progress>

    <warning-card
      *ngIf="isAuthFailed && !authenticationPending"
      titleLocale="user_auth_error_title"
      [warningList]="['user_auth_error_content']"
      contentSuffixKey="contact_helpdesk">
      <button
        mat-button
        matTooltip="Retry Authentication"
        (click)="authenticate()">
        Retry
        <i class="fa fa-refresh"></i>
      </button>
    </warning-card>
  `
})
export class AuthenticationComponent {
  authenticationPending = true
  isAuthFailed = false
  authSubscription: Subscription = null

  constructor (
    private userAuth: UserAuth,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.authenticate()
  }

  /**
   * Make an attempt to set auth details
   */
  authenticate () {
    this.authenticationPending = true
    this.isAuthFailed = false
    this.userAuth.initialiseAuthStores()
      .catch(() => {
        this.authenticationPending = false
        this.isAuthFailed = true
      })
  }

  ngOnInit () {
    this.authSubscription = this.userAuth
      .hasUserAuthFailed$
      .subscribe(isAuthFailed => {
        this.isAuthFailed = isAuthFailed

        console.log("Auth failed:" + isAuthFailed)

        if (isAuthFailed === false) {
          // Forward user to previously attempted path
          this.route.queryParams
            .first()
            .subscribe(params => {
              this.router.navigateByUrl(params.forward)
            })
        }
        this.authenticationPending = false
      })
  }

  ngOnDestroy () {
    if (this.authSubscription !== null) {
      this.authSubscription.unsubscribe()
    }
  }
}
