import { getIntialState } from '../BaseStore'
import { getDefaultReducer } from './Entities.base.reducer'
import { IUserGroupUser } from 'entities'

const initialState = getIntialState<IUserGroupUser, null>({
  crudConfig: {
    create: false,
    update: false,
    delete: true,
    config: false
  }
})

export const userGroupUsers = getDefaultReducer<IUserGroupUser, null>(initialState, 'userGroupUsers')
