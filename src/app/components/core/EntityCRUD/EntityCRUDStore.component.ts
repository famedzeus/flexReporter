import { EventEmitter, OnChanges, OnDestroy, SimpleChanges } from '@angular/core'
import { MatDialog } from '@angular/material'
import { TableColumn } from '@swimlane/ngx-datatable'
import { Store } from '@ngrx/store'
import { EditGenericComponent, FormSetters } from '../EditGeneric'
import { ConfirmationDialogComponent } from '../ConfirmationDialog'
import { Observable, Subscription } from 'rxjs'
import { Log } from 'services'
import { DefaultAction, IBaseStore } from '../../../store'
import { cloneDeep, isEqual, flatten, findIndex, partition, sortBy, uniqBy } from 'lodash'
import { fieldsToFilters } from '../../../entities/_framework/utils'
import { EntityCRUDService } from '../../../store/effects/Entity.effects.base'
import {
  FieldCollection,
  IEntityModel,
  IResourceFilterOption,
  IRecordField,
  IResourceFilters,
  IResourcePagination,
  IFilterFields} from 'entities'

interface IJoinConfig {
  name: string
  viewFieldNames: Array<string>
  customDisplayKeys?: Array<string>
  joinedBy?: string
  idKey: string
  joinKey?: string
  optionMapper?: (item: any) => IResourceFilterOption
}

interface IRecordExtended extends IRecordField {
  actualFieldName: string
}

interface IJoinConfigExt extends IJoinConfig {
  fields: Array<IRecordExtended>
  hashMap: { [key: string]: any }
  options: Array<IResourceFilterOption>
}

/**
 * Recursively find a path of configs to join data
 *
 * Main use is for join tables rather than direct relationships.
 * Should work with highly nested lookups
 * @param current Current/initial join configuration
 * @param all All join configurations
 * @param acc The join configurations in the correct order to join updata
 */
const joinPath = (current: IJoinConfigExt, all: Array<IJoinConfigExt>, acc = []) => {
  if (current) {
    return joinPath(all.find(config => config.name === current.joinedBy), all, [current].concat(acc))
  }

  return acc
}

export class EntityCRUDStore<T> implements OnChanges, OnDestroy {
  relation: IEntityModel
  onSelected: EventEmitter<T> = new EventEmitter<T>()
  title: string
  entityLocaleKey: string
  entityLocaleKeyPlural: string
  hideFilter: boolean = false
  fields: FieldCollection
  /**
   * Configuration of setters entity edit forms
   *
   * Allows form fields to be set automatically in response to change
   */
  formSetters: FormSetters
  tableOptions = {
    cellSpacing: 5
  }
  datatableRowClass = (item: T) => ''
  datatableRowEditDisabled = (rowData) => false
  pageSizes: Array<number> = [10, 20, 50, 100]
  pagination: IResourcePagination = {
    page: 0,
    size: 20,
    sort: ''
  }
  tableHeight: string
  fetchingData = false
  filters: IResourceFilters
  filterRelations: IResourceFilters
  formFieldLayout
  viewFieldNames: Array<string> = []
  viewFields: Array<IRecordField> = []
  totalItems: number
  serverPagination = false
  fieldList: FieldCollection
  filterFormExpansion = true
  filterResetEnabled = true
  selectFirstRecordOnQuery = true
  store$: Observable<IBaseStore<T, null>>
  public view$: Observable<any>
  otherStores$: Array<Observable<IBaseStore<any, null>>>
  allStores$: Array<Observable<IBaseStore<any | T, any>>>
  storePartitionName: string = ''
  state: IBaseStore<T, null> = {} as any
  joinConfig: Array<IJoinConfig>
  extendedViewFields: Array<IRecordField & TableColumn>
  itemsReorderable = false
  sizeColumnsToFit = true
  dataView
  derivedFields
  suppressDatatableFieldDotNotation = true
  subscriptions: Array<Subscription> = []

  constructor (
    protected log: Log,
    protected dialog: MatDialog,
    protected EffectsService: EntityCRUDService<T, any>,
    private OtherEffectsServices: Array<EntityCRUDService<any, any>> = []
  ) {
    // Assign observables for ngrx data stores
    this.store$ = EffectsService.store$$
    this.view$ = EffectsService.view$$
    this.initialiseFields()
    this.subscriptions = this.subscriptions.concat(this.initialiseStore())
  }

  /**
   * Creates a copy of the list of entity fields + constraints and assigns it
   */
  initialiseFields () {
    const { EffectsService } = this
    // Create unique copies of Entity info so we don't mutate original
    Object.assign(this, {
      fields: cloneDeep(EffectsService.fields)
    })

    this.fieldList = EffectsService.fieldList.map(field => Object.assign({
      constraints: EffectsService.constraints[field.fieldName]
    }, field))
  }

  ngOnChanges (changes: SimpleChanges): any {
    this.log.debug(`${this.EffectsService.entityName } changes`, changes)
    if (changes.relation) {
      return this.updateCollection()
    }
  }

  /**
   * Angular destroy lifecyle
   */
  ngOnDestroy () {
    this.subscriptions
      .forEach(subscription => subscription.unsubscribe())

    this.EffectsService.resetDataView()
  }

  /**
   * Takes a list of fields and creates an array filter information objects depending upon the
   * type of field.  It will then be possible in another function to flatten the filter list into
   * a query string and also to apply them client side.
   * @param fields A list of field information for an Entity (reference in entities folder)
   * @return A object with a list of filters and 'relations'.  Relations are intended to be used
   * in a way for range fields to validate against each other.
   * NOTE: Maybe rethink 'relations' for filters
   */
  fieldsToFilters (fields: Array<IRecordField>): IFilterFields {
    return fieldsToFilters(
      fields
        .filter(field => !this.serverPagination || field.fieldName.split('.').length === 1)
    )
  }

  /**
   * Set the currently active record
   */
  setSelected (record: T) {
    this.EffectsService.setSelectedItem(record)
  }

  /**
   * Maps an action name to a method call
   */
  mapActionNameToAction (actionName, record: T) {
    switch (actionName) {
      case 'Delete':
        return ({ data }) => this.delete(record)
      case 'Edit':
        return ({ data, currentRecord }) => this.update(data, currentRecord)
      default:
        return ({ data }) => this.create(data)
    }
  }

  descriptionFromRecord (record: T): string {
    return uniqBy(this.fieldList.concat(this.extendedViewFields), 'fieldName')
      .filter(field => field.isDescriptor === true)
      .map(field => `${field.displayName}: ${record[field.fieldName]}`)
      .join(', ')
  }

  /**
   * Description from list of fields which are flagged as descriptors
   * Returns a promise so that translation can take place
   * TODO: Translate field names
   * @param record
   */
  createEntityDescription (record: T): Promise<string> {
    return new Promise(resolve => {

      resolve(
        this.descriptionFromRecord(record)
      )
    })
  }

  /**
   * Opens a material dialog
   * TODO: Typing for $event, rename openDialog
   * @param $event
   * @param Component Custom component to display within dialog
   * @param customPropertyValues Custom values to be assigned to dialog's component instance
   */
  openModal ($event, Component ?: any, customPropertyValues: any = {}) {
    const { actionName, value } = $event
    const action = this.mapActionNameToAction(actionName, value)
    const { entityName } = this.EffectsService

    if (actionName === 'Delete') {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent)

      Object.assign(dialogRef.componentInstance, {
        title: this.entityLocaleKey || this.title,
        titleLocale: `delete_entity_dialog_title::${entityName}`,
        bodyLocale: `delete_entity_dialog_body::${entityName}`,
        mode: actionName,
        record: value,
        action: action
      })

      this.createEntityDescription(value)
        .then(description => {
          dialogRef.componentInstance.extraInformationLocale = description
        })

      dialogRef.afterClosed()
        .first()
        .filter(shouldDoAction => shouldDoAction === true)
        .subscribe(() => this.delete(value))
      return
    }

    const ref = this.dialog.open(Component || EditGenericComponent)

    Object.assign(ref.componentInstance, {
      title: this.entityLocaleKey || this.title,
      mode: actionName,
      fields: this.fieldList,
      record: value,
      action: action,
      fieldLayout: this.formFieldLayout,
      dataset: value,
      formSetters: this.formSetters
    }, customPropertyValues)
  }

  updateCollection () {
    if (this.relation) {
      return this.getCollection()
    } else {
      this.EffectsService.resetCollection()
    }
  }

  /**
   * To be fired when pagination is to be changed
   * either via a component callback or in child instance
   */
  paginationChange (event) {
    // Don't let user sort is items are reorderable in the datatable
    if (this.itemsReorderable === true) return void 0

    this.EffectsService
      .setViewPagination({
        ...event.pagination,
        page: event.pagination.page
      })

    // Request new collection if using server pagination
    Observable
      .combineLatest(
        this.EffectsService.viewIsServerPaginted$,
        this.EffectsService.viewQuery$
      )
      .first()
      .filter(([isServerPaginated, query]) => isServerPaginated === true)
      .subscribe(next => {
        const [isServerPaginated, query] = next
        return this.getCollection(query.pagination)
      })
  }

  /**
   * Make requests for all other stores to set collections
   * so that related field data can be joined
   */
  setOtherStores (filters: Array<IResourceFilters> = [], collectionsAlreadySet = false) {
    if (this.OtherEffectsServices.length === 0) return void 0

    this.otherStores$ = this.OtherEffectsServices.map(effectsService => effectsService.store$$)
    this.allStores$ = [this.store$, ...this.otherStores$]

    if (collectionsAlreadySet === false) {
      this.OtherEffectsServices.forEach((service, i) => service.getCollection(null, filters[i]))
    }

    const result = this.subscribeJoinedView()
    this.subscriptions.push(result.subscription)
    return result.query
  }

  get otherCollectionsSource$ () {
    return Observable
      .combineLatest(
        // Latest collections from related data stores
        this.OtherEffectsServices.map<Observable<Array<any>>>(effectsService => effectsService.collection$))
  }

  get collectionsSource () {
    const allServices = [this.EffectsService, ...this.OtherEffectsServices]
    // Make a collection of observables for any store collection we require
    const collections = allServices.map<Observable<Array<any>>>(effectsService => effectsService.collection$)
    const pendings = allServices.map(service => service.isUpdatePending$)

    // Mix store & service information in with the collections
    return Observable
      .combineLatest(
        Observable.combineLatest(collections),
        Observable.combineLatest(pendings)
      )
      .filter(([collections, pendings]) => !pendings.some(isPending => isPending === true) && collections.length > 0)
      .map(([collections]) => collections)
      // Provide partitionName and EffectService for each collection
      .map(
        collections =>
          collections
            .map((collection, i) =>
              ({
                collection,
                EffectService: allServices[i],
                partitionName: allServices[i].partitionName
              }))
      )
  }

  get storesSource () {
    return Observable
      .combineLatest(this.allStores$)
  }

  /**
   * Update filters in for data view in store
   * @param updatedFilters
   */
  updateFilters (updatedFilters: IResourceFilters, datatableTriggered = false) {
    this.EffectsService.updateFilters(updatedFilters)
  }

  provideInitialFilters (): IFilterFields {
    return this.fieldsToFilters(this.viewFields)
  }

  ngOnInit () {
    if (!this.entityLocaleKey) {
      this.entityLocaleKey = this.EffectsService.entityName
    }
    if (!this.entityLocaleKeyPlural) {
      this.entityLocaleKeyPlural = `${this.entityLocaleKey}s`
    }
    this.viewFields = this.EffectsService.getFields(this.viewFieldNames)
    this.extendedViewFields = this.viewFields

    this.view$
      .filter(store => store)
      .first()
      .subscribe(() => {
        // If a list of filters have not been set in specialised version of this class - create some basic ones
        if (!this.dataView.filters) {
          this.EffectsService.setInitialFilters(this.provideInitialFilters())
        }

        // Set initial pagination config for data view
        this.EffectsService.setViewPagination(this.pagination)
        if (!this.joinConfig) {
          this.subscriptions.push(this.subscribeView())
        }

        this.subscriptions.push(
          this.EffectsService.selectedViewItem$
            .subscribe(selected => this.onSelected.emit(selected))
        )
      })
  }

  /**
   * Reacts to main provided store observable
   *
   * To be used in simple views with no joined data.
   */
  subscribeView () {
    return this.collectionsSource
      .subscribe((collections) => {
        const [collectionInfo] = collections

        if (!this.dataView.filters) {
          this.EffectsService.setInitialFilters(
            this.provideInitialFilters()
          )
        }
        this.EffectsService.setMappedCollection(collectionInfo.collection)
      })
  }

  /**
   * Creates a query on all data stores which the child class instance needs to
   * use in order to join data & create derived field values.
   *
   * To be used for collection views with data joins
   */
  subscribeJoinedView () {
    // Create a query against all data stores
    const query = this.collectionsSource
      .map(collectionInfo => {
        // TODO: Move lump of code into a service
        const [storeDetails, ...otherStores] = collectionInfo

        const collectionWithDerivedValues: Array<any> = !this.derivedFields
          ? storeDetails.collection
          : this.derivedFields
              .reduce((acc, derivedFieldConfig) => {
                return acc
                  .map((item, index) => ({
                    ...item,
                    [derivedFieldConfig.fieldName]: derivedFieldConfig.mapper(item, otherStores, index)
                  }))

              }, storeDetails.collection)

        // Create has map to find join information
        const joins: Array<IJoinConfigExt> = this.joinConfig.map(config => {
          const otherStoreDetails = otherStores.find(inf => inf.partitionName === config.name)

          if (otherStoreDetails === void 0) {
            // No data join information -> return 'blank' info object
            return Object.assign({
              fields: [] as Array<IRecordField & { actualFieldName: string }>,
              hashMap: {},
              options: [] },
              config)
          }

          // Create lookup hashmap
          const hashMap = otherStoreDetails.collection.reduce((acc, item) => ({
            ...acc,
            [item[config.idKey]]: item
          }), {})

          // Get View fields for data display purposes and modify them as required
          const joinedFields = otherStoreDetails.EffectService
            .getFields(config.viewFieldNames)
            .map((field, i) => {
              const { displayName, fieldName } = field
              const { customDisplayKeys = [] } = config
              return {
                ...field,
                actualFieldName: fieldName,
                fieldName: `${config.name}.${fieldName}`,
                displayName: customDisplayKeys[i] || displayName,
                // Add options for client filtering of field
                options: sortBy(uniqBy(otherStoreDetails.collection, fieldName).map(item => ({
                  value: item[fieldName],
                  description: item[fieldName]
                })), 'description')
              }
            })


          /**
           * Make list of potential options for fields which have a joinKey and hence will be 'joined'
           * Put an 'ANY' as first option if it exists
           */
          const getOptions = () => {
            if (!config.optionMapper) return undefined

            const [anyOption, remainingOptions] = partition(
              otherStoreDetails.collection.map(config.optionMapper),
              option => option.value === 'ANY'
            )

            return anyOption.concat(remainingOptions)
          }

          return Object.assign({ fields: joinedFields, hashMap, options: getOptions() }, config)
        })

        // Map extra information from other store collections onto our collection
        const mappedCollection = collectionWithDerivedValues.map(item => {
          const extraFields = joins
            .reduce((acc, config: IJoinConfigExt) => {
              const joinPaths = joinPath(config, joins)
              const props = config
                .fields
                .reduce((acc, field) => {
                  const { actualFieldName, fieldName } = field
                  // Go through each hashmap to lookup joined/related record
                  const data = joinPaths.reduce((acc, config) => {
                    return config.hashMap[acc[config.joinKey]] || {}
                  }, item)

                  return { ...acc, [fieldName]: data[actualFieldName] }
                }, {})
              return Object.assign(acc, props)
            }, {})

          return Object.assign(extraFields, item)
        })

        // Extend view fields with options
        const extendedViewFields = this.viewFields
          .map(field => {
            const join = joins.find(join => join.joinKey === field.fieldName)
            if (join === void 0 || !join.options) {
              return field
            }

            return { ...field, options: join.options }
          })
        // List of extra view fields
        const otherViewFields = flatten(joins.map(item => item.fields))
          .concat(this.derivedFields || [])

        return {
          extendedViewFields,
          mappedCollection,
          otherViewFields,
          joins
        }
      })

    // Subscribes to the query then reacts to data changes
    const subscription = query
      .subscribe(result => {
        const { extendedViewFields, joins, mappedCollection, otherViewFields } = result
        this.extendedViewFields = extendedViewFields.concat(otherViewFields)
        // Add list of options for any join(foreign key) fields
        this.updateFieldListOptions(joins)

        // Set mapped collection for dataView store (which is used for the datatable)
        this.EffectsService.setMappedCollection(mappedCollection)

        // If data is client paginated ad extra filter fields
        // -> becuase we have all values and can filter based upon related entity/dbtable data
        this.EffectsService.viewIsServerPaginted$
          .first()
          .subscribe(isServerPaginated => {
            // Do not allow filtering by related field values if server paginated
            // but use extra information such as options
            const fields = isServerPaginated
              ? extendedViewFields
              : this.extendedViewFields


            this.EffectsService.setInitialFilters(
              this.fieldsToFilters(fields))
          })
      })

    return {
      query,
      subscription
    }
  }

  /**
   * Updates field options for Entity
   * @param joins
   */
  updateFieldListOptions (joins: Array<IJoinConfigExt>) {
    this.fieldList = this.fieldList
      .map(field => {
        const modifiedField = joins.find(join => join.joinKey === field.fieldName)

        if (modifiedField && modifiedField.options) {
          return {
            ...field,
            options: modifiedField.options
          }
        }
        return field
      })
  }

  /**
   * Handles update action requests
   */
  onActionRequest ($event, modal?) {
    const { actionName, value, change } = $event

    switch (actionName) {
      // If a record is edited in sub component find it and persist the update
      case 'Edited':
        const original = this.state.collection.find(item => item.__id === value.__id)
        return this.update(Object.assign({}, value, change), original).catch()

      case 'ReorderUp':
      return this.reorderItems(value, 'Up')
      case 'ReorderDown':
        return this.reorderItems(value, 'Down')

      default:
        // Otherwise open a modal for editing
        this.openModal($event, modal)
    }

  }

  sequencingFieldName = 'sequence'
  sequencingItemSwapField = 'sequence'

  getSwapItems$ (item: T, direction: 'Up' | 'Down') {
    return this.EffectsService
      .collection$
      .first()
      .map(items => sortBy(items, this.sequencingFieldName))
      .map(items => {
        const itemSequenceValue = item[this.sequencingFieldName]
        const itemIndex = findIndex(items, itemN => itemN[this.sequencingFieldName] === itemSequenceValue)
        const item2Index = itemIndex + (direction === 'Up' ? -1 : 1)
        const item1 = items[itemIndex]
        const item2 = items[item2Index]
        return { item1, item2 }
      })
  }

  /**
   * To be implemented in children.  No generalised
   * @param item
   * @param direction
   */
  reorderItems (item: T, direction: 'Up' | 'Down') {
    this.getSwapItems$(item, direction)
      .subscribe(({item1, item2}) => {
        const itemsWithNewValues: Array<[T, string]> = [
          [item2, item1[this.sequencingItemSwapField] ],
          [item1, item2[this.sequencingItemSwapField] ]
        ]

        itemsWithNewValues
          .forEach(([item, newFieldValue]) => {

            const newItem = Object.assign({}, item, { [this.sequencingItemSwapField]: newFieldValue })
            this.update(newItem, item)
          })

        // Update selected item to visually highlight change to user
        this.setSelected(item2)
      })
  }

  initialiseStore (): Array<Subscription> {
    return [
      this.store$.subscribe((newState: IBaseStore<T, null>) => {
        this.state = newState
      }),
      this.view$.subscribe(dataView => {
        this.dataView = dataView
      })
    ]
  }

  getCollection (pagination = null, filters = null, relation?) {
    const filter = filters || ((this.dataView && this.dataView.serverPaginated) ? this.dataView.query.filters : {})
    return this.EffectsService.getCollection(pagination, filter, relation || this.relation)
  }

  /**
   * Request that a record is persisted to service (in turn makes api request)
   */
  create (record: T) {
    return this.EffectsService.create(record, this.relation)
  }

  /**
   * Makes request to delete a record and updates view if successful
   */
  delete (record: T) {
    return this.EffectsService.delete(record, this.dataView.query.filters, this.relation)
  }

  /**
   * Updates a record with edited field values
   * then update the collection if successsful
   */
  update (record: T, original: T) {
    return this.EffectsService.update(record, original)
  }

}
