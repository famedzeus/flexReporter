import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core'
import { Subscription } from 'rxjs'
import { AlertEmitter} from 'services'
import { ServerInfo } from '../../services/ServerInfo'
import { UserAuth } from '../Auth/user-auth'
import { HttpRequestEffectService } from '../../store/effects/HttpRequest.effects'
import config from 'app-config'

@Component({
  selector: 'app-header',
  templateUrl: './AppHeader.component.html',
  styleUrls: ['./AppHeader.component.scss']
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  @Input() appConfig = config
  @Output() onAlertClick = new EventEmitter()
  hasAuthFailed = true
  logoutUrl: string
  shouldMiniNav = false
  hasPendingRequests = false
  subscriptions: Array<Subscription> = []


  constructor (
    public alertEmitter: AlertEmitter,
    private auth: UserAuth,
    private serverInfo: ServerInfo,
    private httpRequestEffects: HttpRequestEffectService
  ) {
    this.logoutUrl = `${serverInfo.domainURL()}/logout`
    this.setStateOnScroll = this.setStateOnScroll.bind(this)
  }

  setStateOnScroll () {
    // this.shouldMiniNav = window.pageYOffset > 40
  }

  getUserDetails(){
    let userDetails = this.auth.getUserDetails()
  }


  getDataSubscriptions () {
    return [
      this.auth.hasUserAuthFailed$.subscribe(authFailed => this.hasAuthFailed = authFailed),
      this.httpRequestEffects.hasPendingRequests$
        .subscribe(hasPendingRequests => {
          this.hasPendingRequests = hasPendingRequests
        })
    ]
  }

  ngOnInit () {
    window.addEventListener('scroll', this.setStateOnScroll)

    this.subscriptions = this.subscriptions.concat(this.getDataSubscriptions())
  }

  ngOnDestroy () {
    window.removeEventListener('scroll', this.setStateOnScroll)

    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }
}
