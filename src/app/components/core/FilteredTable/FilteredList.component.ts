import {
  trigger, state, transition, style, animate,
  Component, EventEmitter, ContentChild, TemplateRef,
  Input, Output, OnChanges, OnInit, ViewEncapsulation } from '@angular/core'
import { IFilterChangeEvent } from '../FilterForm'
import { PageEvent } from '@angular/material'
import { IResourceFilters, IFilterFields, IRecordField, IResourcePagination } from 'entities'

@Component({
  selector: 'filtered-list',
  styleUrls: ['./FilteredList.component.scss'],
  templateUrl: './FilteredList.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'scaleY(1)', opacity: 1, transformOrigin: 'top center' })),
      transition(':enter', [
        style({ transform: 'scaleY(0)', opacity: 0, transformOrigin: 'top center' }),
        animate('0.1s ease-in')
      ])
    ])
  ]
})
export class FilteredListComponent implements OnChanges, OnInit {
  /** Input array of data objects */
  @Input() dataset = []
  datasetCopy = []
  /** Title of table */
  @Input() title: string
  /** Show loading indicator */
  @Input() loadingIndicator: boolean
  /** List of filters to supply to filter form component */
  @Input() filters: IFilterFields
  /** Passed to filter form for filter validation NOTE: Maybe this is not needed */
  @Input() filterRelations: IResourceFilters
  /** List of field information to control how the dataset is presented */
  @Input() fields: Array<IRecordField>
  /** A flag to inform component whther to use internal filtering or request external filtering */
  @Input() filterButton: boolean = false
  /** Options object for table settings */
  @Input() options
  /** Total number of items - use with external pagination */
  @Input() totalItems: number
  /** Whether to display filter form component */
  @Input() filterDisabled: boolean = false
  /** Currently selected data item (from dataset) */
  @Input() selectedItem
  /** List of allowable items per page */
  @Input() pageSizes = [10, 20, 50, 100]
  /** Initial field to sort data by.  Prepend '-' for reverse sort direction  */
  @Input() sort: string = ''
  /** Initial page size, optional */
  @Input() pageSize: number
  /** Metadata for values organised by fieldName */
  @Input() fieldValueMetadata = {}
  /** Current table pagination settings */
  @Input() pagination: IResourcePagination = {
    sort: '',
    page: 0,
    size: 20
  }
  // Will apply a flexbox based style to float table header
  @Input() floatingHeader: boolean = false
  // Max height
  @Input() maxBodyHeight: number = 300
  /** An event emitter to be fired if a table item is selected by the user */
  @Output() onSelectItem: EventEmitter<any> = new EventEmitter()
  /** Emit to be fired when filter form component action button is selected */
  @Output() onSelectAction: EventEmitter<any> = new EventEmitter()
  /** Emitter to be fired when page changes */
  @Output() onPaginationChange: EventEmitter<{ filters: IResourceFilters, pagination: IResourcePagination }> = new EventEmitter()

  /** Emit to be fired when filter form component action button is selected */
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter()

  @Input() filterColumns = 1

  @ContentChild(TemplateRef) template

  /**
   * Emit which button action has been requested (edit, create...)
   * @param actionName Name of the action to be emitted (eg Edit)
   * @param item Item of data the user intends to operate upon
   */
  selectAction (actionName: string, item?: Object, $event?) {
    if ($event && $event.stopPropagation) {
      $event.stopPropagation()
    }
    this.onSelectAction.emit({
      actionName,
      value: item,
      $event,
      change: $event
    })
  }

  /**
   * Sets initial pagination sort field/direction
   */
  ngOnInit () {
    if (this.sort) {
      this.pagination.sort = this.sort
    }
    if (this.pageSize) {
      this.pagination.size = this.pageSize
    }
  }

  /**
   * @param changes Object containing change information for component inputs
   * If dataset input changes
   *  -> filters the dataset
   *  -> or just sets filtered data as entire dataset (relying on external pagination)
   */
  ngOnChanges (changes) {
    if ((changes.fieldValueMetadata || changes.fields) && this.fieldValueMetadata && this.fields) {
      // Attach metadata to field for ease of access in template
      this.fields = this.fields.map(field => Object.assign({}, field, {
        metadata: this.fieldValueMetadata[field.fieldName] || null
      }))
    }
  }

  /**
   * Is used as a call back when pagination component page is changed
   * If external pagination flag is set it will trigger an emit to update data
   * Otherwise it will set the paginated data directly (from pagination component)
   *
   * @param $event Pagination component event.
   * $event.value is paginated dataset & $event.page is the current page number
   */
  pageChange (event: PageEvent) {
    const { pageIndex, pageSize } = event
    this.pagination.page = pageIndex
    this.pagination.size = pageSize
    this.emitPaginationChange()
  }

  /**
   * Sets the data sort field and direction
   * @param fieldName Name of field to sort data by
   */
  setPaginationSort (event) {
    if (event.sorts.length === 0) return

    // prop == fieldName
    const { dir, prop } = event.sorts[0]

    if (dir === 'desc') {
      this.pagination.sort = `-${prop}` // reverse direction
    } else {
      this.pagination.sort = prop
    }

    this.emitPaginationChange()
  }

  /**
   * Notifify outer component that pagination value has been updated
   * so that it can react
   */
  emitPaginationChange () {
    this.onPaginationChange.emit({
      pagination: Object.assign(
        {},
        this.pagination,
        { page: this.pagination.page }
      ),
      filters: this.filters
    })
  }

  /**
   * Emits change event for fuilter change
   * @param $event An event emitted by filter form which contains updated filter values
   */
  onFilterFormAction ($event: { value: IFilterFields }) {
    this.emitPaginationChange()
  }

  /**
   * Toggles the selected table item
   * @item Item in current dataset which has been selected by user
   */
  toggleSelectedItem (item) {
    // Set or unset the selected item
    this.selectedItem = this.selectedItem === item ? null : item
    // Let outer components know this has happened
    this.onSelectItem.emit(this.selectedItem)
  }

  /**
   * Updates the filters
   * @param Updated filter values
   */
  updateFilters ({ filters }: IFilterChangeEvent) {
    this.onFilterChange.emit(filters)
  }

  getIcon (record, field) {
    const meta = record[field.fieldName + 'Meta']
    if (meta) {
      return meta.icon
    }
  }
}
