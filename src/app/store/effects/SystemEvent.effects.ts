import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { EntityCRUDService } from './Entity.effects.base'
import { Log } from 'services'
import { SystemEventService, ISystemEvent } from 'entities'
import { IBaseStoreDictionary } from '../'
import { DataViewEffectService } from './DataView.effects'

@Injectable()
export class SystemEventEffectService extends EntityCRUDService<ISystemEvent, null> {

  constructor (
    SystemEvent: SystemEventService,
    store: Store<IBaseStoreDictionary<ISystemEvent, null>>,
    log: Log,
    DataViewEffect: DataViewEffectService
  ) {
    super(SystemEvent, store, log, DataViewEffect, 'systemEvents')
  }
}
