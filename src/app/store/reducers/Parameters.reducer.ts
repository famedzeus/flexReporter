import { getIntialState } from '../BaseStore'
import { IBaseStore, IBaseStoreDictionary } from '../BaseStore.types'
import { Action } from '@ngrx/store'
import { getDefaultReducer } from './Entities.base.reducer'
import { merge } from 'lodash'
import { IParameter } from 'entities'

const baseState = getIntialState<IParameter, null>({
  crudConfig: {
    create: false,
    update: false,
    delete: false,
    config: false
  }
})
const initialState = {
  ...baseState,
  metadata: {}
}

interface IParameterStore extends IBaseStore<IParameter, any> {
  metadata?: {
    [entityName: string]: {
      [fieldName: string]: any
    }
  }
}

export interface IParameterStoreMap extends IBaseStoreDictionary<IParameter, any> {
  parameters: IParameterStore
}

export enum ParameterActions {
  SetMetadataValue = 'SET_PARAMETER_METADATA_VALUE',
  SetMetadataValues = 'SET_PARAMETER_METADATA_VALUES'
}

interface PayloadAction extends Action {
  payload: any
}

const defaultReducer = getDefaultReducer<IParameter, null>(initialState, 'parameters')
export const parameters = (state: IParameterStore = initialState, action: PayloadAction): IParameterStore => {
  const { payload = {}, type } = action
  const { data, entityName, fieldName, fieldValue } = payload

  switch (type) {

    case ParameterActions.SetMetadataValue:
      const item: IParameter = data

      return {
        ...state,
        metadata: merge({}, state.metadata, {
          [entityName]: {
            [fieldName]: {
              [fieldValue]: item
            }
          }
        })
      }

    case ParameterActions.SetMetadataValues:
      const items: Array<IParameter> = data
      return {
        ...state,
        metadata: merge({}, state.metadata, items)
      }

    default:
      return defaultReducer(state, action)
  }
}
