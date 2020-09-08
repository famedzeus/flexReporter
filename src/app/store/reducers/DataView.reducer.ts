import { Action } from '@ngrx/store'
import { FieldCollection, IResourceFilters, IResourcePagination } from 'entities'

export enum DataViewAction {
  AddDataView = 'ADD_DATA_VIEW',
  RemoveDataView = 'REMOVE_DATA_VIEW',
  SetFilter = 'SET_VIEW_FILTER',
  SetFilters = 'SET_VIEW_FILTERS',
  SetInitialFilters = 'SET_INITIAL_VIEW_FILTERS',
  UpdateFilters = 'UPDATE_VIEW_FILTERS',
  SetViewCollection = 'SET_VIEW_COLLECTION',
  SetPageNumber = 'SET_VIEW_PAGE_NUMBER',
  SetPageSize = 'SET_VIEW_PAGE_SIZE',
  SetPagination = 'SET_VIEW_PAGINATION',
  ResetDataView = 'RESET_DATA_VIEW',
  SetMappedCollection = 'SET_VIEW_MAPPED_COLLECTION',
  SetSelectedItem = 'SET_VIEW_SELECTED_ITEM',
  SetServerPaginated = 'SET_VIEW_SERVER_PAGINATED'
}

export interface IDataViewGeneric<T = any, U = any> {
  viewFields?: FieldCollection
  viewFieldNames?: Array<string>
  viewCollection?: Array<T>
  mappedCollection?: Array<U>
  selectedItem?: T,
  initialFilters?: IResourceFilters,
  serverPaginated?: boolean,
  totalItems?: number,
  query?: {
    filters: IResourceFilters,
    pagination: IResourcePagination
  }
}

export interface IDataView extends IDataViewGeneric {}

export interface IDataViews {
  [viewKey: string]: IDataView
}

export const defaultDataView = (): IDataView => ({
  viewFields: [],
  viewFieldNames: [],
  viewCollection: [],
  mappedCollection: [],
  initialFilters: {},
  serverPaginated: false,
  selectedItem: null,
  totalItems: 0,
  query: {
    filters: {},
    pagination: {
      page: 0,
      size: 20
    }
  }
})

export interface IPayload {
  viewKey: string
  data: any
  totalItems: number
}

export interface IDataViewAction extends Action {
  type: DataViewAction | null,
  payload: IPayload
  nonStandard: boolean
}

/**
 * Matches an action type and returns a new state for the dataViews store.
 * The idea is to do this without mutating state.
 *
 * The store is in the form of a dictionary rather than a collection to make it a bit
 * simpler to read.
 *
 * If you're not familiar with the ... operator on an object
 *  - it behaves like ... on an array - applying a spread destructuring.
 */
export const dataViews = (state: IDataViews = {}, action: IDataViewAction): IDataViews => {
  const { payload = {} as IPayload } = action
  const { viewKey, data } = payload

  switch (action.type) {
    case DataViewAction.AddDataView:
      return {
        ...state,
        [viewKey]: {
          ...defaultDataView(),
          ...data
        }
      }

    case DataViewAction.ResetDataView:
      return {
        ...state,
        [viewKey]: {
          ...defaultDataView()
        }
      }

    case DataViewAction.SetServerPaginated:
      return {
        ...state,
        [viewKey]: {
          ...state[viewKey],
          serverPaginated: data
        }
      }

    case DataViewAction.RemoveDataView:
      return {
        ...state,
        [viewKey]: null
      }

    case DataViewAction.SetViewCollection: {
      const previousItem = state[viewKey].selectedItem
      const selectedItem = previousItem ? data.find(item => item.__id === previousItem.__id) : null

      return {
        ...state,
        [viewKey]: {
          ...state[viewKey],
          viewCollection: data,
          totalItems: payload.totalItems,
          selectedItem: selectedItem || (data.length > 0 ? data[0] : null)
        }
      }
    }

    case DataViewAction.SetSelectedItem:
      return {
        ...state,
        [viewKey]: {
          ...state[viewKey],
          selectedItem: data
        }
      }

    case DataViewAction.SetFilters:
      return {
        ...state,
        [viewKey]: {
          ...state[viewKey],
          query: {
            ...state[viewKey].query,
            filters: data
          }
        }
      }

    case DataViewAction.SetFilter:
      const { filters = {} } = state[viewKey].query
      return {
        ...state,
        [viewKey]: {
          ...state[viewKey],
          query: {
            ...state[viewKey].query,
            filters: {
              ...filters,
              ...data
            }
          }
        }
      }

    case DataViewAction.SetPagination:
      return {
        ...state,
        [viewKey]: {
          ...state[viewKey],
          query: {
            ...state[viewKey].query,
            pagination: {
              ...state[viewKey].query.pagination,
              ...data
            }
          }
        }
      }

    case DataViewAction.SetInitialFilters: {
      const dataView = state[viewKey]

      let initialFilters = data
      if (dataView.query && dataView.query.filters) {
        const keys = Object.keys(data)
        initialFilters = keys.reduce((acc, key) => {
          if (dataView.query.filters[key] && dataView.query.filters[key].value !== undefined) {
            return {
              ...acc,
              [key]: {
                ...acc[key],
                value: dataView.query.filters[key].value
              }
            }

          }

          return acc
        }, data)
      }

      return {
        ...state,
        [viewKey]: {
          ...state[viewKey],
          initialFilters
        }
      }
    }

    case DataViewAction.SetMappedCollection:
      return {
        ...state,
        [viewKey]: {
          ...state[viewKey],
          mappedCollection: data
        }
      }

    default:
      return state
  }
}
