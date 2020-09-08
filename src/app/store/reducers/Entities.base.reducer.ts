import { ActionReducer } from '@ngrx/store'
import { PayloadAction, IBaseStore } from '../BaseStore.types'
import { remove } from 'lodash'
import { getIdGen } from '../utils'

export enum DefaultAction {
  ClearCollection = 'CLEAR_COLLECTION',
  SetCollection = 'SET_COLLECTION',
  AddItems = 'ADD_ITEMS',
  FilterCollection = 'FILTER_COLLECTION',
  UpdateItem = 'UPDATE_ITEM',
  DeleteItem = 'DELETE_ITEM',
  AddItem = 'ADD_ITEM',
  RemoveItem = 'REMOVE_ITEM',
  SetPending = 'SET_PENDING',
  SetNotPending = 'SET_NOT_PENDING',
  ResetState = 'RESET_STATE',
  SetRequestError = 'SET_REQUEST_ERROR'
}



/**
 * Provides a default reducer function for a BaseStore
 * - Uses a storePartition string as a namespace to take into account that the default Action types will be generic
 */
export const getDefaultReducer =
  <T, U>(initialState: IBaseStore<T, U>, storePartition: string): ActionReducer<IBaseStore<T, U>, PayloadAction> => {
    let idGen = getIdGen()
    const mapIdToCollection = (collection: Array<any>) => collection.map(item => Object.assign(item, { __id: idGen() }))
    return (state: IBaseStore<T, U> = initialState, action: PayloadAction): IBaseStore<T, U> => {
      const { payload = {} } = action

      if (payload.storePartition && payload.storePartition !== storePartition) {
        return state
      }

      switch (action.type) {
        case DefaultAction.SetPending:
          return { ...state, isUpdatePending: true }

        case DefaultAction.SetCollection: {
          idGen = getIdGen()
          const collection = mapIdToCollection(payload.data)
          return {
            ...state,
            collection,
            isUpdatePending: false,
            totalItems: payload.totalItems === void 0 ? collection.length : payload.totalItems
          }
        }

        case DefaultAction.SetNotPending:
          return { ...state, isUpdatePending: false }

        case DefaultAction.AddItems: {
          const collection = state.collection.concat(mapIdToCollection(payload.data))
          return {
            ...state,
            collection,
            totalItems: state.totalItems + payload.data.length
          }
        }

        case DefaultAction.FilterCollection:
          const collection = state.collection.filter(action.payload.comparitor)
          return {
            ...state,
            collection,
            totalItems: state.totalItems
          }

        case DefaultAction.ClearCollection:
          return {
            ...state,
            collection: [],
            isUpdatePending: false,
            totalItems: 0
          }

        case DefaultAction.SetRequestError:
          return {
            ...state,
            isUpdatePending: false
          }

        case DefaultAction.AddItem:
          return {
            ...state,
            isUpdatePending: false,
            totalItems: state.totalItems + 1,
            collection: state.collection.concat(mapIdToCollection([payload.data]))
          }

        case DefaultAction.RemoveItem:
          return {
            ...state,
            isUpdatePending: false,
            totalItems: state.totalItems - 1,
            collection: state.collection.filter(item => item.__id !== payload.data.__id)
          }

        case DefaultAction.UpdateItem:
          return {
            ...state,
            isUpdatePending: false,
            collection: state.collection.map(item => {
              // Compare 'internal' store id's
              const { __id } = payload.originalItem
              if (item.__id === __id) {
                return { ...payload.updatedItem, __id }
              }

              return item
            })
          }

        case DefaultAction.ResetState:
          idGen = getIdGen()
          return initialState

        default: return state
      }
    }
  }
