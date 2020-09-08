import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core'
import { IUser } from 'entities'
import { UserAuth } from '../Auth/user-auth'

@Component({
  selector: 'user-info',
  styleUrls: ['./UserInfo.component.scss'],
  template: `
  <mat-progress-spinner
    *ngIf="fetchingUser"
    [diameter]="20"
    mode="indeterminate"></mat-progress-spinner>
  <a *ngIf="userDetails" role="button"
    (click)="onClickUser.emit()"
    routerLink="/users">
    <i class="fa fa-user-circle"></i>
    <span>{{userDetails.username || userDetails.userId}}</span>
  </a>
  `
})
export class UserInfoComponent implements OnInit {
  
  @Input() userDetails

  @Output() onClickUser = new EventEmitter()
  fetchingUser = true
  user: IUser | false = null

  
  constructor (
    private UserAuth: UserAuth
  ) {

    // this.userDetails = UserAuth.getUserDetails()
  }

  ngOnInit () {
    this.UserAuth
      .userInfo$
      .subscribe(user => {
        this.user = user
        console.log("Active user:" + this.user)
        this.fetchingUser = false
      })
  }
}
