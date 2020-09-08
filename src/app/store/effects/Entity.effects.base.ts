import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { Log } from 'services'
import { Observable, Subscription } from 'rxjs'
import { DefaultAction, IBaseStore } from '../'
import { IDataViews, IDataView } from '../../store/reducers/DataView.reducer'
import { IResource } from '../../entities/reflect'
import { IResourceFilters, IResourcePagination, IResourceQuery } from 'entities'
import { DataViewEffectService } from './'
import { invokeSafe, PaginationService } from '../utils'
import { isEqual, merge } from 'lodash'

export abstract class EntityCRUDService<T, U> {
  extendedViewFields
  protected store$: Store<IBaseStore<T, U>>
  protected defaultViewStore$: Observable<IDataView>
  protected state: IBaseStore<T, U>
  private subscription: Subscription = null

  constructor (
    private EntityService: IResource<T>,
    private store: Store<{ [storePartitionName: string]: IBaseStore<T, U> }>,
    private log: Log,
    protected dataView: DataViewEffectService,
    protected storePartitionName: string
  ) {
    this.initialiseStore()
  }

  get constraints () {
    return this.EntityService.constraints
  }

  get entityName () {
    return this.EntityService.entityName
  }

  get fields () {
    return this.EntityService.fields
  }

  get fieldList () {
    return this.EntityService.meta.fields
  }

  getFields (fieldNames: Array<string>) {
    return fieldNames
      .map(fieldName => this.EntityService.fields[fieldName])
      .filter(field => field !== void 0)
  }

  get partitionName () {
    return this.storePartitionName
  }

  get store$$ () {
    return this.store$
  }

  /**
   * Store queries
   */

  get viewQuery$ () {
    return this.dataView.getViewQueryObservable(this.storePartitionName)
  }

  get viewFilters$ () {
    return this.dataView.getViewFilterObservable(this.storePartitionName)
  }

  /**
   * Observable of selected item if item is uniuque and not null
   */
  get selectedViewItem$ () {
    return this.dataView
      .getSelectedItem$(this.storePartitionName)
      .filter(a => a !== null)
      .distinctUntilChanged((a, b) => isEqual(a, b))
  }

  get collectionIsUpdatePending$ () {
    return this.store.select(invokeSafe(store => {
      const state = store[this.storePartitionName]
      return {
        isUpdatePending: state.isUpdatePending,
        collection: state.collection
      }
    }))
  }

  get isUpdatePending$ () {
    return this.store.select(invokeSafe(store => store[this.storePartitionName].isUpdatePending))
  }

  get viewIsServerPaginted$ () {
    return this.dataView.getIsServerPaginated$(this.storePartitionName)
  }

  get view$$ () {
    return this.defaultViewStore$
  }

  get collection$ (): Observable<Array<T>> {
    return this.store.select(invokeSafe(state => state[this.storePartitionName].collection))
  }

  setViewServerPaginated (isServerPaginated = true) {
    this.dataView.setServerPaginated(this.storePartitionName, isServerPaginated)
  }

  setViewPagination (pagination: IResourcePagination) {
    this.dataView.setPagination(this.storePartitionName, pagination)
  }

  setMappedCollection (collection: Array<any>) {
    this.dataView.setMappedCollection(this.storePartitionName, collection)
  }

  setInitialFilters (filters: IResourceFilters) {
    this.dataView.setInitialFilters(this.storePartitionName, filters)
  }

  setSelectedItem (item: T) {
    this.dataView.setSelectedItem(this.storePartitionName, item)
  }

  setFilter (filters: IResourceFilters) {
    this.dataView.setFilter(this.storePartitionName, filters)
  }

  updateFilters (filters: IResourceFilters) {
    this.dataView.setCurrentFilters(this.storePartitionName, filters)
  }

  /**
   * Make a request for collection and rquest store to update
   * @param pagination
   * @param filters
   * @param relation
   */
  getCollection (
    pagination: IResourcePagination = {} as IResourcePagination,
    filters: IResourceFilters = {},
    relation = {}) {
    return this.setCollection(pagination, filters, relation)
  }

  resetCollection () {
    this.store.dispatch({
      type: DefaultAction.ClearCollection,
      payload: { storePartition: this.storePartitionName }
    })
  }

  /**
   * Wraps store dispatch method and merges in store partition name
   * @param action
   */
  dispatch (action) {
    this.store
      .dispatch(merge(action, { payload: { storePartition: this.storePartitionName } }))
  }

  find (params) {
    const prom = this.EntityService.find(params)

    prom
      .then(item => {
        this.addItem(item)
        return item
      })

    return prom
  }

  addItem (item: T) {
    this.store
      .dispatch({
        type: DefaultAction.AddItem,
        payload: { data: item, storePartition: this.storePartitionName }
      })
  }

  /**
   * Request that a record is persisted to service (in turn makes api request)
   */
  create (item, relation = {}) {
    const extraVals = this.EntityService.fieldList
      .reduce((acc, field) => {
        return Object.assign(acc, { [field.fieldName]: relation[field.fieldName] })
      }, {})
    const record = Object.assign({}, extraVals, item)
    this.dispatchPending()
    const prom = this.EntityService.save(relation, record)
    return prom
      .then(newRecord => {
        this.addItem(newRecord)
        return newRecord
      })
      .catch(e => {
        this.store.dispatch({
          type: DefaultAction.SetRequestError,
          payload: { error: e, storePartition: this.storePartitionName }
        })
        return e
      })
  }

  /**
   * Makes request to delete a record and updates view if successful
   */
  delete (record, filters?, relation?) {
    const prom = this.EntityService.delete(record)
    this.dispatchPending()
    return prom
      .then((r) => {
        if (this.state.serverPagination === true) {
          // Pagination param exists - update list via API
          return this.getCollection(null, filters, relation)
        } else {
          // Update store collection client side
          this.store.dispatch({
            type: DefaultAction.RemoveItem,
            payload: { data: record, storePartition: this.storePartitionName }
          })
        }
      })
      .catch((e) => {
        this.store.dispatch({
          type: DefaultAction.SetRequestError,
          payload: { error: e, storePartition: this.storePartitionName }
        })
        return e
      })
  }

  /**
   * Updates a record with edited field values
   * then update the collection if successsful
   */
  update (updatedItem, originalItem) {
    this.dispatchPending()
    const promise = this.EntityService.update(originalItem, updatedItem)

    return promise
      .then(() => {
        this.dispatch({
          type: DefaultAction.UpdateItem,
          payload: { originalItem, updatedItem }
        })
      })
      .catch(e => {
        this.dispatch({
          type: DefaultAction.SetRequestError,
          payload: { error: e }
        })
        return e
      })
  }

  protected setCollection (
    pagination: IResourcePagination = {} as IResourcePagination,
    filters: IResourceFilters = {},
    relation = {},
    effectAction: any = DefaultAction.SetCollection
  ) {
    const query: IResourceQuery = { ...pagination, filters }

    this.dispatchPending()
    const prom = this.EntityService.query({ ...relation, ...query })

    // Wrapped in extra promise so that seperate catches can be done extended component
    return prom
      .then(response => {
        const { data, headers } = response
        // Get relevent pagination info and make it available to view
        const headersObject = headers()
        const totalItems = +headersObject['x-total-count']
        this.log.debug(`${this.EntityService.entityName} received for`, data)
        this.store.dispatch({
          type: effectAction,
          payload: { data, totalItems, storePartition: this.storePartitionName }
        })
        return data
      })
      .catch(e => {
        this.store.dispatch({
          type: DefaultAction.SetRequestError,
          payload: { error: e, storePartition: this.storePartitionName }
        })
        throw e
      })
  }

  resetDataView () {
    this.dataView.resetDataView(this.storePartitionName)
  }

  private initialiseStore () {
    this.store$ = this.store.select(this.storePartitionName)
    this.subscription = this.store$.subscribe(state => this.state = state)

    this.dataView.addDataView(this.storePartitionName, {})
    this.defaultViewStore$ = this.dataView.getViewObservable(this.storePartitionName)
    // When store is added subscribe for updates
    const collectionQuery$ = this.dataView.getViewCollectionObservable(this.storePartitionName)
    const externalPagination$ = this.dataView.getIsServerPaginated$(this.storePartitionName)

    Observable
      .combineLatest([collectionQuery$, externalPagination$, this.viewQuery$])
      .subscribe(next => {
        const [collection, isServerPaginated, query] = next

        if (isServerPaginated || collection.length === 0) {
          this.dataView.setViewData(this.storePartitionName, collection, collection.length)
        } else {
          this.dataView
            .filterThenSetViewData(this.storePartitionName, collection, query)
        }
      })
  }

  private dispatchPending () {
    // Set timeout due to issue with ngrx filtering actions
    setTimeout(
      () => this.store
        .dispatch({
          type: DefaultAction.SetPending,
          payload: {
            storePartition: this.storePartitionName
          }
        }),
      0
    )
  }
}
