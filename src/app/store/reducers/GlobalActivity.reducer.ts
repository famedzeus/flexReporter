import {
  ActivityType,
  ActivityState
} from '../../components/core/LoadingDialog'

export enum GlobalActivityActionType {
  SetNoActivity = 'GLOBAL_ACTIVITY_SET_NONE',
  SetActivity = 'GLOBAL_ACTIVITY_SET_ACTIVITY'
}

export type RestrictedActivityType = ActivityType.Error | ActivityType.Progress
export interface GlobalActivityAction {
  type: GlobalActivityActionType,
  status?: RestrictedActivityType
  message?: string
}

const defaultState: ActivityState = {
  status: ActivityType.None,
  message: ''
}

/**
 * Reducer for an global activity state message.  More boilerplate but leads to more
 * discrete and type controlled code.
 */
export const globalActivityState = (state: ActivityState = defaultState, action: GlobalActivityAction): ActivityState => {
  switch (action.type) {
    case GlobalActivityActionType.SetNoActivity:
      return defaultState

    case GlobalActivityActionType.SetActivity:
      return {
        status: action.status,
        message: action.message
      }

    default:
      return state
  }
}
