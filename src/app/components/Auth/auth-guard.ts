import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { ISiteSection, UserAuth } from './user-auth'
import appConfig from 'app-config'
import { ServerInfo } from '../../services/ServerInfo'

abstract class AuthGuard implements CanActivate {
  protected section: ISiteSection
  constructor(
    private UserAuth: UserAuth,
    private Router: Router
  ) {
    // Flag should only ever be true in dev env config
    // if (appConfig.permissionsDisabled === true) {
    //   Object.assign(this, { canActivate: () => Observable.of(true) })
    // }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const isAuth$ = this.UserAuth.isAuthFailed$
    const canAccess$ = this.UserAuth.canAccess(this.section)
      // This map will only ever be invoked when auth hasn't failed completly
      // => which is when canAccess$ is provided as the observable below
      .map(canActivate => {
        if (canActivate === false) {
          this.navigateUnauth()
        }

        return canActivate
      })

    return this.UserAuth
      .userAuth$
      .map(([authFail, , accessPerms]) => authFail === true || accessPerms === false)
      .flatMap(isAuthFailed => {
        // If auth has failed then send user to auth page
        if (isAuthFailed) {
          this.Router
            .navigate(['authenticate'], {
              // passi requested url to forward to if auth is successful
              queryParams: {
                forward: state.url
              }
            })

          // block access to route
          return Observable.of(false)
        }

        // If auth hasn't failed then control route access by section accessPermissions
        return canAccess$
      })
  }

  protected navigateUnauth() {
    this.Router.navigate(['unauthorised'])
  }
}

@Injectable()
export class PlantsAuthGuard extends AuthGuard implements CanActivate {

  constructor(
    UserAuth: UserAuth,
    Router: Router
  ) {
    super(UserAuth, Router)
    this.section = 'VSR'
  }
}

@Injectable()
export class SequencingAuthGuard extends AuthGuard implements CanActivate {

  constructor(
    UserAuth: UserAuth,
    Router: Router
  ) {
    super(UserAuth, Router)
    this.section = 'VSR'
  }
}

@Injectable()
export class RoutesAuthGuard extends AuthGuard implements CanActivate {

  constructor(
    UserAuth: UserAuth,
    Router: Router
  ) {
    super(UserAuth, Router)
    this.section = 'VSR'
  }
}

@Injectable()
export class GeneralAuthGuard implements CanActivate {

  constructor(
    private UserAuth: UserAuth,
    private Router: Router,
    private serverInfo: ServerInfo
  ) {
    // super(UserAuth, Router)
    // this.section = 'VSR'



  }

  canActivate() {
    return this.authenticate()
  }

  async authenticate() {

    if (!this.UserAuth.isAuthorised()) {

      try {
        let loggedOnUser = await fetch(this.serverInfo.URL() + 'loggedonuser', { credentials: 'include' }).then(response => response.json())
        let users = await fetch(this.serverInfo.URL() + 'users', { credentials: 'include' }).then(response => response.json())
        let userGroups = await fetch(this.serverInfo.URL() + 'userGroups', { credentials: 'include' }).then(response => response.json())
        let userGroupUsers = await fetch(this.serverInfo.URL() + 'userGroupUsers', { credentials: 'include' }).then(response => response.json())

        // Does user exist in users?
        let userRegistered = users.find(user => user.userId == loggedOnUser.username)
        if (userRegistered) {
          console.log("User found in users table:" + userRegistered.userName)
        }

        // Is user in user group?
        let userInUserGroup = userGroupUsers.find(user => user.userId == loggedOnUser.username)

        if (!userRegistered || !userInUserGroup) {
          this.Router.navigate(['unauthorised']) // Problem
          this.UserAuth.setAuthorised(false)
          return false
        } else {
          this.UserAuth.setUserDetails({ username: userRegistered.userName, userGroup: userInUserGroup, userId: loggedOnUser.username })
          this.UserAuth.setAuthorised(true)
          return true
        }
      } catch (e) {
        this.Router.navigate(['unauthorised']) // Problem
        this.UserAuth.setAuthorised(false)
		// this.UserAuth.setAuthorised(true)
        return false
      }


    } else {
      return true
    }

  }

}
