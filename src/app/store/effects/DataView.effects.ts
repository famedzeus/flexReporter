import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { DataViewAction } from '../reducers/DataView.reducer'
import { invokeSafe, PaginationService } from '../utils'
import { IResourceFilters, IResourcePagination } from 'entities'
import { DataViewPipe } from './DataView.pipe'
import { IDataViews, IDataView } from '../../store/reducers/DataView.reducer'

@Injectable()
export class DataViewEffectService {
  protected dataViewsPartition = 'dataViews'
  constructor (
    private store: Store<IDataViews>,
    private dataViewPipe: DataViewPipe,
    private paginationService: PaginationService
  ) {}

  /**
   * Dispatches state change event to add new data view for supplied viewKey
   * @param viewKey
   * @param viewConfig
   */
  addDataView (viewKey: string, viewStateOverrides: IDataView) {
    this
      .store
      .dispatch({
        type: DataViewAction.AddDataView,
        payload: {
          data: viewStateOverrides,
          viewKey
        }
      })
  }

  /**
   * Dispatches state change event in order to set a filter for a specific data view
   * (merge filters)
   */
  setFilter (viewKey: string, filters: IResourceFilters) {
    this.store
      .dispatch({
        type: DataViewAction.SetFilter,
        payload: {
          data: filters,
          viewKey
        }
      })
  }

  /**
   * Dispatches state change event in order to set all filters for a specific data view
   * (overwrite filters)
   * @param viewKey
   * @param filters
   */
  setCurrentFilters (viewKey: string, filters: IResourceFilters) {
    this.store
      .dispatch({
        type: DataViewAction.SetFilters,
        payload: {
          data: filters,
          viewKey
        }
      })
  }

  /**
   * Dispatches state change event in order to set all initialFilters prop for a specific dataView
   * @param viewKey
   * @param filters
   */
  setInitialFilters (viewKey: string, filters: IResourceFilters) {
    this.store
      .dispatch({
        type: DataViewAction.SetInitialFilters,
        payload: {
          data: filters,
          viewKey
        }
      })
  }

  /**
   * Dispatches state change event in order to set how data should be paginated for a spefic data view
   */
  setPagination (viewKey: string, pagination) {
    this.store
      .dispatch({
        type: DataViewAction.SetPagination,
        payload: {
          data: pagination,
          viewKey
        }
      })
  }

  /**
   * Dispatches state change event in order to set a collection after it has been transformed (mapped)
   * @param viewKey
   * @param collection
   */
  setMappedCollection (viewKey: string, collection: Array<any>) {
    this.store
      .dispatch({
        type: DataViewAction.SetMappedCollection,
        payload: {
          data: collection,
          viewKey
        }
      })
  }

  /**
   * Dispatches state change event in order to flag data for data view will be server paginated/filtered
   * @param viewKey
   */
  setServerPaginated (viewKey: string, isServerPaginated = true) {
    this.store.dispatch({
      type: DataViewAction.SetServerPaginated,
      payload: {
        viewKey,
        data: isServerPaginated
      }
    })
  }

  /**
   * Dispatches state change event in order to set a selected item from current collection
   * @param viewKey
   * @param selectedItem
   */
  setSelectedItem (viewKey: string, selectedItem: any) {
    this.store.dispatch({
      type: DataViewAction.SetSelectedItem,
      payload: {
        viewKey,
        data: selectedItem
      }
    })
  }

  resetDataView (viewKey: string) {
    this.store.dispatch({
      type: DataViewAction.ResetDataView,
      payload: {
        viewKey
      }
    })
  }

  /**
   * Dispatches state change event in order to set base collection data from which
   * the data view will be made
   * @param viewKey
   * @param page
   * @param totalItems
   */
  setViewData<T> (viewKey: string, page: Array<T>, totalItems: number) {
    this.store
      .dispatch({
        type: DataViewAction.SetViewCollection,
        payload: {
          data: page,
          totalItems,
          viewKey
        }
      })
  }

  /**
   * Filters a
   * @param viewKey
   * @param collection
   * @param query
   */
  filterThenSetViewData<T> (viewKey: string, collection: Array<T>, query: { filters: IResourceFilters, pagination: IResourcePagination }) {
    const { filters, pagination = {} as IResourcePagination } = query
    const filteredDataset = this.dataViewPipe.transform(collection, filters)
    const page = this.paginationService
      .sortDataset(
        filteredDataset,
        pagination.sort, pagination.page, pagination.size)

    this.setViewData(viewKey, page, filteredDataset.length)
  }

  // Store queries

  getSelectedItem$ (viewKey: string) {
    return this.store.select(invokeSafe(state => state[this.dataViewsPartition][viewKey].selectedItem))
  }

  getIsServerPaginated$ (viewKey: string) {
    return this.store.select(invokeSafe(state => state[this.dataViewsPartition][viewKey].serverPaginated))
  }

  getViewFilterObservable (viewKey: string): Observable<IResourceFilters> {
    return this.store.select(invokeSafe(store => store[this.dataViewsPartition][viewKey].query.filters))
  }

  getViewObservable (viewKey: string) {
    return this.store.select(store => store[this.dataViewsPartition][viewKey])
  }

  getViewQueryObservable (viewKey: string) {
    return this.store.select(invokeSafe(store => store[this.dataViewsPartition][viewKey].query, {}))
  }

  getViewCollectionObservable (viewKey: string) {
    return this.store.select(invokeSafe(store => store[this.dataViewsPartition][viewKey].mappedCollection, []))
  }
}
