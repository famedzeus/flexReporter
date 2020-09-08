import { getIntialState } from '../BaseStore'
import { getDefaultReducer } from './Entities.base.reducer'
import { ISystemEvent } from 'entities'

const initialState = getIntialState<ISystemEvent, null>({
  crudConfig: {
    create: false,
    update: false,
    delete: false,
    config: false
  }
})

export const systemEvents = getDefaultReducer<ISystemEvent, null>(initialState, 'systemEvents')
