import { getIntialState } from '../BaseStore'
import { getDefaultReducer, DefaultAction } from './Entities.base.reducer'
import { IBaseStore, PayloadAction } from '../BaseStore.types'
import { IUser, IVehicleSchedulingUser } from 'entities'
import appConfig from 'app-config'

export interface IPermissionsMap {
  user?: { [appSection: string]: boolean },
  admin?: { [appSection: string]: boolean }
}

export interface IUserStore extends IBaseStore<IUser, null> {
  activeUser: IVehicleSchedulingUser
  accessPermissions: IPermissionsMap
  isActiveUserPending: boolean
  isAuthFailed: boolean
  languageCode: string
}

export enum UserActions {
  MergeUser = 'MERGE_USER',
  SetActiveUserPending = 'SET_ACTIVE_USER_PENDING',
  SetActiveUserFailed = 'SET_ACTIVE_USER_FAILED',
  SetActiveUser = 'SET_ACTIVE_USER',
  SetActiveUserLanguage = 'SET_ACTIVE_USER_LANGUAGE',
  SetUserAccessPermissions = 'SET_USER_ACCESS_PERMISSIONS'
}

const baseState = getIntialState<IUser, null> ({
  crudConfig: {
    create: true,
    update: true,
    delete: false,
    config: false
  }
})

const initialState: IUserStore = {
  ...baseState,
  languageCode: 'en',
  activeUser: null,
  isActiveUserPending: !appConfig.permissionsDisabled,
  isUpdatePending: !appConfig.permissionsDisabled,
  accessPermissions: appConfig.permissionsDisabled ? {} : null,
  isAuthFailed: !appConfig.permissionsDisabled
}

const defaultReducer = getDefaultReducer<IUser, null>(initialState, 'users')
export const users = (state: IUserStore = initialState, action: PayloadAction) => {
  switch (action.type) {
    case UserActions.MergeUser: {
      const { data } = action.payload as { data: Array<IUser> }
      // Add user to collection unless it's already there
      const userExists = data.length === 1 && state.collection.some(user => user.userId === data[0].userId)

      return userExists
        ? state
        : defaultReducer(state, {
          payload: {
            ...action.payload,
            data: data[0]
          },
          type: DefaultAction.AddItem
        })

    }

    case UserActions.SetActiveUserLanguage:
      return {
        ...state,
        languageCode: action.payload
      }

    case UserActions.SetUserAccessPermissions:
      return {
        ...state,
        accessPermissions: action.payload.data
      }

    case UserActions.SetActiveUserPending:
      return {
        ...state,
        isActiveUserPending: true
      }

    case UserActions.SetActiveUser:
      const activeUser: IVehicleSchedulingUser = action.payload.data
      const isAuthFailed = !(typeof activeUser === 'object') || !activeUser.username
      return {
        ...state,
        activeUser,
        isAuthFailed,
        isActiveUserPending: false
      }

    default:
      return defaultReducer(state, action)
  }
}
