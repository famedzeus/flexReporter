import {
  ChangeDetectionStrategy,
  ContentChild,
  SimpleChanges,
  Component, EventEmitter, ViewChild,
  Input, Output, OnChanges, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { IResourceFilters, IFilterFields, IRecordField, IResourcePagination, FieldType } from 'entities'
import { TableColumn } from '@swimlane/ngx-datatable'
import { FilteredListComponent } from './FilteredList.component'
import { AgGridColumn } from 'ag-grid-angular'
import { DefaultGridCellComponent } from './DefaultGridCell.component'
import { DefaultGridHeaderComponent } from './DefaultHeaderCell.component'
import { DefaultActionsCellComponent } from './DefaultActionsCell.component'
import { DisabledCheckboxCellComponent } from './DisabledCheckboxCell.component'
import { CheckboxEditCellComponent } from './CheckboxEditCell.component'
import { DateGridCellComponent } from './DateCell.component'
import { DateShiftGridCellComponent } from './DateShiftCell.component'
import { DateTimeGridCellComponent } from './DateTimeCell.component'
import { DefaultColouredCellComponent } from './DefaultColouredCell.component'
import { getIdGen } from '../../../store/utils'

const idGen = getIdGen()
@Component({
  selector: 'filtered-table',
  styleUrls: ['./FilteredTable.component.scss'],
  templateUrl: './FilteredTable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilteredTableComponent extends FilteredListComponent implements OnChanges, OnInit {
  /** Input array of data objects */
  @Input() dataset = []
  /** Title of table */
  @Input() title: string
  /** Show loading indicator */
  @Input() loadingIndicator: boolean
  /** List of filters to supply to filter form component */
  @Input() filters: IFilterFields
  /** Passed to filter form for filter validation NOTE: Maybe this is not needed */
  @Input() filterRelations: IResourceFilters
  /** AgGrid datatable row class rules */
  @Input() rowClassRules
  /** List of field information to control how the dataset is presented */
  @Input() sizeColumnsToFit = true
  @Input() suppressFieldDotNotation = true
  @Input() enableAgSorting = false
  @Input()
  set fields (fieldList: Array<IRecordField>) {
    this.fieldList = fieldList
    this.clearSubscriptions()

    this.setColumnDefinitions(fieldList)

    // Hack to get around ag-grids lack of event emitters
    const headerSubscription = DefaultGridHeaderComponent
      .onClicked
      .filter(event => event.listenerId === this.listenerId)
      .subscribe(event => this.setSort(event.field))
    const actionSubscription = DefaultActionsCellComponent
      .onClicked
      .filter(event => event.listenerId === this.listenerId)
      .subscribe(event => this.cellItemClicked(event))

    this.cellSubscribers = [headerSubscription, actionSubscription]
    this.frameworkComponents = { agColumnHeader: this.enableAgSorting ? undefined :  DefaultGridHeaderComponent, ...this.frameworkComponents }
  }

  cellSubscribers: Array<Subscription> = []

  frameworkComponents: any = { dareShiftGridCell: DateShiftGridCellComponent}
  /** A flag to inform component whther to use internal filtering or request external filtering */
  @Input() columns: Array<TableColumn & IRecordField & { isActionsColumn?: boolean }> = []

  @Input() rowClass: (rowData: any) => string
  @Input() rowEditDisabled = rowData => false
  @Input() filterFormExpansion = true

  @Input() filterButton: boolean = false
  /** Options object for table settings */
  @Input() options
  /** Temp to hide table  */
  @Input() externalTable = false
  /** Total number of items - use with external pagination */
  @Input() totalItems: number
  /** Whether to display filter form component */
  @Input() filterDisabled: boolean = false
  /** Currently selected data item (from dataset) */
  @Input() tableHeight: number
  @Input() selectedItem
  /** List of allowable items per page */
  @Input() pageSizes = [10, 20, 50, 100]
  /** Initial field to sort data by.  Prepend '-' for reverse sort direction  */
  @Input() sort: string = ''
  /** Initial page size, optional */
  @Input() pageSize: number
  /** Add buttons and trigger events to reoder rows */
  @Input() rowsReorderable = false
  /** Metadata for values organised by fieldName */
  @Input() fieldValueMetadata = {}
  @Input() tableWidth
  @Input() filterResetEnabled = true
  /** Current table pagination settings */
  @Input() pagination: IResourcePagination = {
    sort: '',
    page: 0,
    size: 20
  }
  @Input() filterColumns = null
  // Will apply a flexbox based style to float table header
  @Input() floatingHeader: boolean = false
  // Only applied if floating header is true (limits body so scroll)
  @Input() maxTableHeight: number = 700
  @Input() minTableHeight: number = 500
  /** An event emitter to be fired if a table item is selected by the user */
  @Output() onSelectItem: EventEmitter<any> = new EventEmitter()
  /** Emit to be fired when filter form component action button is selected */
  @Output() onSelectAction: EventEmitter<any> = new EventEmitter()
  /** Emit to be fired when filter form component action button is selected */
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter()
  /** Emitter to be fired when page changes */
  @Output() onPaginationChange: EventEmitter<{ filters: IResourceFilters, pagination: IResourcePagination }> = new EventEmitter()
  @Output() onCellClick = new EventEmitter()
  /** Data which has been filtered internally or by external process */
  filteredDataset
  /** Data which has been filtered internally or by external process */
  paginatedDataset

  /** Width of scrollbar set on ngOnInit - used for floating table header padding */
  scrollbarWidth: number = 0
  rowStyle = {}
  /** width of action button column */
  actionWidth: number = 0

  fieldList: Array<IRecordField>
  columnDefs: Array<any> = []
  gridOptions: { api?: any } = {}
  private listenerId: number
  /**
   * Sets initial pagination sort field/direction
   */
  ngOnInit () {
    this.listenerId = idGen()
    super.ngOnInit()
  }

  clearSubscriptions () {
    this.cellSubscribers.forEach(sub => sub.unsubscribe())
    this.cellSubscribers = []
  }

  ngOnChanges (changes: SimpleChanges) {
    if (changes.fieldValueMetadata && this.columns.length > 0 && this.fieldValueMetadata) {
       this.columns = this.columns
          .map(column => Object.assign({}, column, {
            metadata: this.fieldValueMetadata[column.fieldName] || null
          }))
      this.setColumnDefinitions(this.fieldList)
    }

    if (changes.rowsReorderable) {
      const sortable = !this.rowsReorderable
      this.columns = this.columns.map(column => Object.assign({}, column, { sortable }))
    }

    if ((changes.selectedItem || changes.dataset) && this.gridOptions.api) {
      setTimeout(() => {
        if (!this.gridOptions.api) return

        this.gridOptions.api.forEachNode(node => {
          if (node.data === this.selectedItem) {
            node.setSelected(true)
          }
        })
      }, 0)
    }

    if (changes.loadingIndicator && this.gridOptions.api) {
      if (this.loadingIndicator === true) {
        this.gridOptions.api.showLoadingOverlay()
      } else {
        this.gridOptions.api.hideOverlay()
      }
    }
  }

  ngOnDestroy() {
    this.clearSubscriptions()
  }

  ngAfterViewInit() {
    this.setColumnDefinitions(this.fieldList || [])
  }

  setColumnDefinitions (fieldList) {
    const actionColumnWidth = this.getActionColumnWidth()
    this.columnDefs = fieldList
      .filter(field => field !== undefined)
      .map(field => {
        const cellStyle = this.fieldValueMetadata && this.fieldValueMetadata[field.fieldName]
          ? (params) => {
            // Double check this isn't undefined as the fieldValueMetadata may change
            if (this.fieldValueMetadata[field.fieldName] === undefined) return {}

            const colourMetadata = this.fieldValueMetadata[field.fieldName][params.value]

            if (colourMetadata === undefined) return {}

            return {
              color: colourMetadata.textColour,
              'background-color': colourMetadata.backgroundColour
            }
          }
        : undefined

        return {
          children: field.children,
          field: field.fieldName,
          headerName: field.displayName,
          listenerId: this.listenerId,
          cellRendererFramework: field.cellTemplate || this.getCellRenderer(field),
          headerRendererFramework: DefaultGridHeaderComponent,
          type: field.type,
          width: field.minimumWidth,
          minWidth: field.minimumWidth,
          maxWidth: field.maximumWidth,
          cellClass: field.cellClass,
          pinned: field.pinned,
          inlineEditingEnabled: field.inlineEditingEnabled,
          editable: field.type !== 'boolean' ? field.inlineEditingEnabled : false,
          cellStyle
        }
      })
      .concat([{
        field: ' ',
        isActionsColumn: true,
        cellRendererFramework: DefaultActionsCellComponent,
        pinned: 'right',
        listenerId: this.listenerId,
        rowsReorderable: this.rowsReorderable,
        ...this.options,
        minWidth: actionColumnWidth,
        maxWidth: actionColumnWidth,
        width: actionColumnWidth,
        hide: !actionColumnWidth
      } as any])

    if (!this.sizeColumnsToFit) return

    setTimeout(() => {
      if (this.gridOptions.api) {
        this.gridOptions.api.sizeColumnsToFit()
      }
    }, 0)
  }

  rowSelectionChange (event) {
    const selectedRows = this.gridOptions.api.getSelectedRows()

    this.onSelectItem.emit(selectedRows[0])
  }

  setSort (fieldName: string) {
    const direction = this.pagination.sort === fieldName ? 'desc' : 'asc'
    this.pagination.sort = direction === 'desc' ? `-${fieldName}`: fieldName
    DefaultGridHeaderComponent.sort.next({
      listenerId: this.listenerId,
      field: fieldName,
      direction
    })
    this.emitPaginationChange()
  }

  getCellRenderer (field: IRecordField) {
    switch (field.type) {
      case FieldType.DateTime:
        return DateTimeGridCellComponent
      case FieldType.Date:
        return DateGridCellComponent
      case FieldType.DateShift:
        return DateShiftGridCellComponent
      case FieldType.Boolean: {
        if (field.inlineEditingEnabled) {
          return CheckboxEditCellComponent
        }

        return DisabledCheckboxCellComponent
      }

      default:
        return DefaultGridCellComponent
    }
  }

  /**
   * calculates a min width for action buttons
   * */
  getActionColumnWidth () {
    if (!this.options) return 0

    const width = (
      (this.options.update ? 1 : 0) + (this.options.delete ? 1 : 0) + (this.options.config ? 1 : 0) + (this.rowsReorderable ? 2 : 0)
    ) * 34

    return width === 0
      ? width
      // Cell padding
      : width + 50
  }

  cellItemClicked (event) {
    this.selectAction(event.actionName, event.row, event.$event)
  }

  cellSelected (event) {
    if (event.rowIndex === null) return

    const data = this.dataset[event.rowIndex]
    this.onCellClick.emit({
      fieldName: event.column.colDef.field,
      colDef: event.column.colDef,
      row: data
    })
  }

  valueChanged ($event) {
    this.onSelectAction.emit({
      actionName: 'Edited',
      value: $event.data,
      $event,
      change: $event.data
    })
  }

  onRowActivate (rowActivation) {
    if (!this.options.update) return void 0

    switch (rowActivation.type) {
      case 'dblclick': {
        rowActivation.event.stopPropagation()
        return this.selectAction('Edit', rowActivation.row, rowActivation.event)
      }
    }
  }

  selectItem (event) {
    const { selected = [] } = event
    this.onSelectItem.emit(selected[0])
    this.selectedItem = selected[0]
  }
}
