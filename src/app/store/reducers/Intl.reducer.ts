import { PayloadAction } from '../BaseStore.types'

interface IntlStore {
  isSettingTranslations: boolean
  translationDictionary: {
    [translationKey: string]: string
  }
}

export interface IStoreDictionary {
  intl: IntlStore
}

export enum IntlActionTypes {
  SetTranslations = 'SET_TRANSLATIONS',
  SetFetching = 'SET_FETCHING_TRANSLATIONS',
  SetFetchingFailed = 'SET_FAILED_FETCHING_TRANSLATIONS'
}

const initialState: IntlStore = {
  isSettingTranslations: false,
  translationDictionary: {}
}

export const intl = (state: IntlStore = initialState, action: PayloadAction): IntlStore => {
  switch (action.type) {
    case IntlActionTypes.SetTranslations:
      return {
        ...state,
        isSettingTranslations: false,
        translationDictionary: action.payload.data
      }

    case IntlActionTypes.SetFetching:
      return {
        ...state,
        isSettingTranslations: true
      }

    case IntlActionTypes.SetFetchingFailed:
      return {
        ...state,
        isSettingTranslations: false
      }

    default:
      return state
  }
}
