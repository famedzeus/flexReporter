import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { EntityCRUDService } from './Entity.effects.base'
import { Log } from 'services'
import { UserGroupUserService, IUserGroupUser } from 'entities'
import { IBaseStoreDictionary } from '../'
import { DataViewEffectService } from './DataView.effects'

@Injectable()
export class UserGroupUserEffectService extends EntityCRUDService<IUserGroupUser, null> {
  constructor (
    UserGroupUser: UserGroupUserService,
    store: Store<IBaseStoreDictionary<IUserGroupUser, null>>,
    log: Log,
    DataViewEffect: DataViewEffectService
  ) {
    super(UserGroupUser, store, log, DataViewEffect, 'userGroupUsers')
  }
}
