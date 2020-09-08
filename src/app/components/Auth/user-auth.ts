import { Injectable } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import appConfig from 'app-config'
import { UserEffectService, UserGroupEffectService } from 'effects'
import { UserService } from 'entities'
import { AuthenticatingProgressComponent } from './AuthenticatingProgress'
import { ReplaySubject } from 'rxjs'
import { noop } from 'lodash'
import { IUser, IUserGroup, } from 'entities'
import { adminAccessCode, userPermissions } from './Auth.config'


const invertObject = obj => Object.keys(obj)
  .reduce((acc, key) => Object.assign(acc, { [obj[key]]: key }), {})

const niceNameMap = {
  VSR: 'VSR'
}

const inverseNiceNameMap = invertObject(niceNameMap)

const ADMIN = 'admin'
interface IPermissionsMap {
  user?: { [key: string]: boolean },
  admin?: { [key: string]: boolean }
}

export type ISiteSection = 'VSR'
type UG_VSU_Tuple = [Array<IUserGroup>, IUser, Array<string>]
type UGTuple = [Array<IUserGroup>, Array<string>]

/**
 * A service to be injected into routes and non routed component views so
 * that user access can be controlled based upon service information
 */
@Injectable()
export class UserAuth {
  private dialogInstance: MatDialogRef<AuthenticatingProgressComponent> = null
  private errors: Array<string> = []
  private errorEmitter = new ReplaySubject<Array<string>>()
  private invalidAccount = false

  private username
  private userGroup
  private userId
  private authorised = false

  constructor (
    private dialog: MatDialog,
    private Router: Router,
    private User: UserService,
    private userEffects: UserEffectService,
    private userGroupEffects: UserGroupEffectService
  ) {
    // Flag should only ever be true in dev env config
    if (appConfig.permissionsDisabled === true) {
      const canAccess = (section?: ISiteSection) => Observable.of(true)
      this.canAccess = canAccess
      this.isAdmin = canAccess
      this.isSomeAdmin = canAccess
      this.navigateUnauth = noop
      this.userNotPermitted = noop
    }

    this.setSubscribers()
  }

  setUserDetails(details){
    this.username = details.username
    this.userGroup  = details.userGroup
    this.userId = details.userId
  }

  getUserDetails(){
    return {username:this.username,userGroup:this.userGroup, userId:this.userId}
  }

  setAuthorised(auth){
    this.authorised = auth
  }

  isAuthorised(){
    return this.authorised
  }

  /**
   * Sets access permissions based upon current store values
   */
  private setSubscribers () {
    Observable
      .combineLatest(
        this.userGroupEffects.collection$,
        this.userEffects.activeUser$,
        this.userEffects.activeUserGroups$
      )
      .filter((latest: UG_VSU_Tuple) => latest[1] !== null)
      .subscribe((latest: UG_VSU_Tuple) => {
        const [userGroups, activeUser, activeUserGroups] = latest

        // Error getting user => no permissions
        if (activeUser as any === false) {
          return this.userEffects
            .setAccessPermissions(false)
        }

        const groups = activeUserGroups
          .map(groupName => userGroups.find(userGroup => userGroup.groupName === groupName))
          .filter(group => group !== undefined)

        // No groups exists in db => no permissions
        if (groups.length === 0) {
          return this.userEffects
            .setAccessPermissions(false)
        }

        const permissionsMap: IPermissionsMap = groups
          .reduce((acc, ugu) => {
            const { access, section } = this.getGroupDetails(ugu)
            acc[access][section] = true
            return acc
          }, {
            user: {},
            admin: {}
          })

        this.userEffects
          .setAccessPermissions(permissionsMap)
      })
  }

  async initialiseAuthStores () {
    await this.userGroupEffects.getCollection()
    return this.userEffects.setActiveUser()
  }

  /**
   * Subscribe to auth validation errors
   * @param cb A callback for onNext error event
   */
  subErrors (cb) {
    return this.errorEmitter.subscribe(cb)
  }

  userNotPermitted () {
    this.invalidAccount = true
    this.navigateUnauth()
  }

  navigateUnauth () {
    this.Router.navigate(['unauthorised'])
  }

  /**
   * Create domain spefic group code from site section and role
   * @param sectionName
   * @param role
   */
  getGroupCode (sectionName: string, role: string) {
    const groupType = role === 'admin' ? '_ADMIN_GROUP' : '_USER'
    console.log("getGroupCode:"+ inverseNiceNameMap[sectionName] + groupType)
    return inverseNiceNameMap[sectionName] + groupType
  }

  getGroupDetails (group: IUserGroup) {
    
    let groupDetails =  {
      section: niceNameMap[group.groupName.replace('_ADMIN_GROUP', '').replace('_USER', '')],
      access: group.accessRight === adminAccessCode ? ADMIN : 'VSR'
    }
    console.log("getGroupDetails:" + groupDetails)
    return groupDetails
  }

  /**
   * Get the current list of auth error locale codes
   */
  get errorCodes () {
    return this.errors
  }

  get userGroups$ () {
    return this.userGroupEffects.collection$
  }

  get userInfo$ (): Observable<IUser | false> {
    return this.userEffects.activeUser$
  }

  get isAuthFailed$ (): Observable<boolean> {
    return this.userEffects.isAuthFailed$
  }

  get userAuth$ () {
    return Observable
      .combineLatest([
        this.userEffects.isAuthFailed$,
        this.userEffects.isActiveUserPending$,
        this.userEffects.userAccessPermissions$])
  }

  get hasUserAuthFailed$ () {
    return this.userAuth$
      .filter(([authFail, isUserPending, accessPerms]) => isUserPending === false && accessPerms !== null)
      .map(([authFail, isUserPending, accessPerms]) => {
        console.log(authFail)
        return authFail === true || accessPerms === false
      })
  }

  /**
   * subscribes to user groups and active user then when next occurs
   * filters for active users groups
   */
  get currentUsersGroups$ () {
    return Observable
      .combineLatest(
        this.userGroupEffects.collection$,
        this.userEffects.activeUserGroups$
      )
      .map((next: UGTuple) => {
        const [userGroups, activeUserGroupNames] = next

        return activeUserGroupNames
          .map(groupName => userGroups.find(userGroup => userGroup.groupName === groupName))
          .filter(group => group !== void 0)
      })
  }

  /**
   * Checks to see if current user is able to access/view an app section.
   * Then it sets the current auth error code and publishes it for app component consumption.
   * It finally returns a promise which resolves to a boolean.
   *
   * @param section Name of section to check user permissions for
   */
  canAccess (section: ISiteSection) {
    const canAccess$ = Observable
      .combineLatest(
        this.userEffects.activeUserGroups$,
        this.userEffects.userAccessPermissions$
      )
      .filter(([_, access]) => access !== null)
      .map(next => {
        const [userGroups, accessPermissions] = next
        if (section === 'VSR' && userGroups.length > 0) {
          return true
        }

        if (accessPermissions === false) {
          return false
        }

        return !!(accessPermissions['VSR'][section] || accessPermissions[ADMIN][section])
      })

    canAccess$
      .forEach(access => {
        if (access === false) {
          this.errors = [`access_denied_${section}`]
          this.errorEmitter.next(this.errors)
        }
      })

    return canAccess$
  }

  isAdmin (section: ISiteSection) {
    return this.userEffects.userAccessPermissions$.map(permissions => permissions[ADMIN][section])
  }

  getPermissions (section: ISiteSection) {
    return this.userEffects.userAccessPermissions$
      .map(permissionsMap => {
        const adminPerms = permissionsMap[ADMIN][section]
        if (adminPerms) return userPermissions[section][ADMIN]

        const userPerms = permissionsMap['VSR'][section]
        if (userPerms) return userPermissions[section]['VSR']
      })
  }

  sectionAdminList () {
    return this
      .currentUsersGroups$
      .map(userGroups => {
        return userGroups.filter(userGroup => userGroup.accessRight === 'A')
      })

  }

  isSomeAdmin () {
   
   
   return this.userEffects
      .userAccessPermissions$
      .map(permissionsMap =>
        Object.keys(permissionsMap[ADMIN])
          .some(section => permissionsMap[ADMIN][section] === true))
  }

  /**
   * Closes the progress dialog
   */
  private closeDialog () {
    if (this.dialogInstance === null) return

    this.dialogInstance.close()
    this.dialogInstance = null
  }

  /**
   * Displays a progress dialog whilst waiting for user details
   */
  private displayDialog () {
    this.dialogInstance = this.dialog.open(
      AuthenticatingProgressComponent,
      {
        disableClose: true
      }
    )
  }

  // private getAuthErrorCodes () {
  //   if (this.invalidAccount) {
  //     return ['account_invalid']
  //   }

  //   const { currentUser } = this
  //   const errorCodes = {
  //     account_disabled: !currentUser.enabled,
  //     account_expired: !currentUser.accountNonExpired,
  //     account_locked: !currentUser.accountNonLocked,
  //     account_credentials_expired: !currentUser.credentialsNonExpired
  //   }

  //   return Object.keys(errorCodes).filter(code => errorCodes[code] === true)
  // }
}
