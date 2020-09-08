import { getIntialState } from '../BaseStore'
import { getDefaultReducer } from './Entities.base.reducer'
import { IUserGroup } from 'entities'

const initialState = getIntialState<IUserGroup, null>({
  crudConfig: {
    create: false,
    update: false,
    delete: true,
    config: false
  }
})

export const userGroups = getDefaultReducer<IUserGroup, null>(initialState, 'userGroups')
