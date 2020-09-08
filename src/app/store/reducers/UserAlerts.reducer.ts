import { getIdGen } from '../utils'

const MAX_ALERTS = 100
const idGen = getIdGen()

export interface IAlert {
  scopeId: string
  messageType?: string
  alertType: string
  titleLocale?: string
  messageLocale: string
  isImportant?: boolean
  rawMessage?: string
  validationFailures?: Array<{ message: string, severity: string }>
}

export interface IAlertMeta extends IAlert {
  created: string
  hasDisplayed: boolean
  hasNotified: boolean
  __id: number
}

export enum AlertActionType {
  AddAlert = 'ADD_USER_ALERT',
  SetDisplayed = 'SET_USER_ALERT_DISPLAYED',
  SetAllDisplayed = 'SET_USER_ALL_ALERT_DISPLAYED',
  SetNotified = 'SET_USE_ALERT_NOTIFIED'
}

interface IAlertAction {
  type: AlertActionType
  payload?: any
}

const userAlert = (state: IAlertMeta, action: IAlertAction): IAlertMeta => {
  switch (action.type) {
    case AlertActionType.AddAlert: {
      const data: IAlert = action.payload.data
      const alert: IAlertMeta = {
        ...data,
        __id: idGen(),
        isImportant: !!data.isImportant,
        created: (new Date()).toISOString(),
        hasDisplayed: false,
        hasNotified: false
      }
      return alert
    }

    case AlertActionType.SetDisplayed: {
      return {
        ...state,
        hasDisplayed: true
      }
    }

    case AlertActionType.SetNotified: {
      return {
        ...state,
        hasNotified: true
      }
    }

    default:
      return state
  }
}

const mapById = (state: Array<IAlertMeta> = [], action: IAlertAction) =>
  state.map(item => {
    if (item.__id === action.payload.data.__id) {
      return userAlert(item, action)
    }

    return item
  })

export const userAlerts = (state: Array<IAlertMeta> = [], action: IAlertAction): Array<IAlertMeta> => {
  switch (action.type) {
    case AlertActionType.AddAlert: {
      const alert = userAlert(null, action)
      return [alert].concat(state).slice(0, MAX_ALERTS)
    }

    case AlertActionType.SetDisplayed:
      return mapById(state, action)

    case AlertActionType.SetNotified:
      return mapById(state, action)

    case AlertActionType.SetAllDisplayed: {
      return state.map(item => {
        if (item.hasDisplayed === false) {
          return userAlert(item, { type: AlertActionType.SetDisplayed })
        }

        return item
      })
    }

    default:
      return state
  }
}
