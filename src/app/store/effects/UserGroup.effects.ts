import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { EntityCRUDService } from './Entity.effects.base'
import { Log } from 'services'
import { UserGroupService, IUserGroup } from 'entities'
import { IBaseStoreDictionary } from '../'
import { DataViewEffectService } from './DataView.effects'

@Injectable()
export class UserGroupEffectService extends EntityCRUDService<IUserGroup, null> {
  constructor (
    UserGroup: UserGroupService,
    store: Store<IBaseStoreDictionary<IUserGroup, null>>,
    log: Log,
    DataViewEffect: DataViewEffectService
  ) {
    super(UserGroup, store, log, DataViewEffect, 'userGroups')
  }
}
