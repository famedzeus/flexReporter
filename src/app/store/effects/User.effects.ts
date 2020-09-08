import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { EntityCRUDService } from './Entity.effects.base'
import { Log } from 'services'
import { UserService, EqualityOperator, IUser, IVehicleSchedulingUser } from 'entities'
import { invokeSafe } from '../utils'
import { IUserStore } from '../reducers/Users.reducer'
import { DataViewEffectService } from './DataView.effects'
import { UserActions } from '../reducers/Users.reducer'

@Injectable()
export class UserEffectService extends EntityCRUDService<IUser, null> {
  private _activeUser$: Observable<IUser | false>
  constructor (
    private User: UserService,
    private userStore: Store<{ [storePartition: string]: IUserStore }>,
    log: Log,
    DataViewEffect: DataViewEffectService
  ) {
    super(User, userStore, log, DataViewEffect, 'users')
    this.setActiveUser$()

    this.activeUserId$
      .subscribe(uid => {
        const { userId } = UserService.meta.fieldNames
        this.setCollection(null, {
          userId: {
            type: EqualityOperator.Equal,
            value: uid,
            name: userId
          }
        }, {}, UserActions.MergeUser).catch()
      })
  }

  setActiveUser () {
    const { userStore } = this
    userStore
      .dispatch({
        type: UserActions.SetActiveUserPending
      })
    return this.User
      .getCurrentUser()
      .then(activeUser => {
        if (!activeUser) throw new Error('Problem getting active user')

        userStore
          .dispatch({
            type: UserActions.SetActiveUser,
            payload: {
              data: activeUser
            }
          })
      })
      .catch(() => {
        userStore
          .dispatch({
            type: UserActions.SetActiveUserFailed
          })
      })
  }

  setAccessPermissions (permissionsMap) {
    this.userStore.dispatch({
      type: UserActions.SetUserAccessPermissions,
      payload: {
        data: permissionsMap
      }
    })
  }

  setLanguageCode (languageCode: string) {
    this.userStore.dispatch({
      type: UserActions.SetActiveUserLanguage,
      payload: languageCode
    })
  }

  get userAccessPermissions$ () {
    return this.userStore
      .select(invokeSafe(store => store[this.storePartitionName].accessPermissions))
  }

  get activeVSUser$ () {
    return this.userStore
      .select(invokeSafe(store => store[this.storePartitionName].activeUser))
      .filter(user => !!user)
  }

  get languageCode$ () {
    return this.userStore
      .select(invokeSafe(store => store[this.storePartitionName].languageCode))
  }

  get userLanguage$ () {
    return this.activeUser$
      .map(invokeSafe<string, null>(user => user.language, null))
  }

  get isActiveUserPending$ () {
    return this.userStore
      .select(invokeSafe(store => store[this.storePartitionName].isActiveUserPending))
  }

  get isAuthFailed$ () {
    return this.userStore
      .select(invokeSafe(store => store[this.storePartitionName].isAuthFailed))
  }


  /**
   * Observable for current VechicleSchedulingUser id
   */
  get activeUserId$ () {
    return this.activeVSUser$.map(user => user.username)
  }

  get activeUserGroups$ () {
    return this.activeVSUser$.map(user => user.groups)
  }

  /**
   * Observable for current active User
   */
  get activeUser$ () {
    return this._activeUser$
  }

  /**
   * Create Observable for current active User
   */
  private setActiveUser$ () {
    this._activeUser$ = Observable
      .combineLatest(
        this.userStore.select(store => store[this.storePartitionName].activeUser),
        this.collection$,
        this.userStore.select(store => store[this.storePartitionName].isUpdatePending)
      )
      .filter(next => next[2] === false)
      .map((latest: [IVehicleSchedulingUser, Array<IUser>, boolean]) => {
        const [activeUser, collection] = latest
        if (activeUser === null) {
          return null
        }

        return collection.find(user => user.userId === activeUser.username) || false
      })

  }
}
