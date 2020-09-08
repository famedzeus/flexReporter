export default `
  <filtered-table
    *ngIf="dataView"
    [dataset]="dataView.viewCollection"
    [title]="title"
    [rowClass]="datatableRowClass"
    [rowEditDisabled]="datatableRowEditDisabled"
    [rowsReorderable]="itemsReorderable"
    [filters]="dataView.initialFilters"
    [fields]="extendedViewFields || viewFields"
    [options]="state.crudConfig"
    [filterDisabled]="hideFilter"
    [filterFormExpansion]="filterFormExpansion"
    [filterResetEnabled]="filterResetEnabled"
    [externalTable]="externalTable"
    [tableHeight]="tableHeight"
    [filterButton]="dataView.serverPaginated"
    [totalItems]="dataView.serverPaginated ? state.totalItems : dataView.totalItems"
    [selectedItem]="dataView.selectedItem"
    [pageSizes]="pageSizes"
    [tableWidth]="tableOptions.width"
    [loadingIndicator]="state.isUpdatePending"
    [sort]="pagination.sort"
    [pageSize]="pagination.size"
    [fieldValueMetadata]="fieldValueMetadata"
    [sizeColumnsToFit]="sizeColumnsToFit"
    [suppressFieldDotNotation]="suppressDatatableFieldDotNotation"
    (onFilterChange)="updateFilters($event)"
    (onSelectItem)="setSelected($event)"
    (onSelectAction)="onActionRequest($event)"
    (onPaginationChange)="paginationChange($event)">
  </filtered-table>
`