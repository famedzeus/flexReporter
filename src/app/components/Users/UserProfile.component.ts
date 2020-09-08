import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { UserService, IUser } from 'entities'
import { UserRoleService } from './UserRole.service'
import { UserEffectService } from 'effects'


// const languageOptions = Object.keys(appConfig.languages).map(key => {
//   const lang = appConfig.languages[key]
//   return {
//     description: lang.name,
//     value: lang.code
//   }
// })

@Component({
  selector: 'user-profile',
  styleUrls: ['./UserProfile.component.scss'],
  template: `

  <mat-card *ngIf="user">
    <mat-card-header>
      <mat-card-title>
        <i class="fa fa-user-circle"></i>
        <span>{{user.userName}}</span> ({{user.userId}})
      </mat-card-title>
      <mat-card-subtitle>
        {{user.emailAddress}}
      </mat-card-subtitle>
    </mat-card-header>
    <mat-card-content>
      <mat-form-field>
        <mat-select [(ngModel)]="user.language" (ngModelChange)="onChangeLanguage.emit(user.language)">
          <mat-option *ngFor="let language of languages" [value]="language.value">
            <img [src]="'assets/images/flags/4x3/' + language.value + '.svg'" width="25"/>
            {{language.description | translate}}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </mat-card-content>
    <div class="flex">
      <mat-chip-list>
        <mat-chip *ngFor="let group of userGroups">
          {{group.displayName | translate}}
        </mat-chip>
      </mat-chip-list>
    </div>
  </mat-card>
  `
})
export class UserProfileComponent implements OnInit {
  @Output() onChangeLanguage = new EventEmitter<string>()
  user: IUser | false = null
  languages
  userGroups: Array<any> = []

  constructor (
    private User: UserService,
    private userRoleHelper: UserRoleService,
    private userEffects: UserEffectService
  ) {}

  ngOnInit () {
    this.languages = this.User.meta.fields.find(field => field.fieldName === 'language').options
    this.userEffects
      .activeUser$
      .subscribe(user => {
        this.user = Object.assign({ language: 'en' }, user)
      })

    this.userRoleHelper
      .currentUserGroups
      .subscribe(userGroups => {
        this.userGroups = userGroups
      })
  }
}
