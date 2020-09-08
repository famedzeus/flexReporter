import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { FormService } from '../EditGeneric'
import { IFilterField, IFilterFields, IResourceFilters, IResourceFilterOption } from 'entities'

export type ActionType = 'Reset' | 'Submit'
export interface FormAction {
  type: ActionType,
  value: IResourceFilters
  filterValues?: { [key: string]: string | number | boolean }
}

export interface IFilterChangeEvent {
  filters: IFilterFields
  filterValues?: { [key: string]: string | number | boolean }
  changes: { [filterName: string]: boolean }
}

interface FilterFieldWithLocalValues extends IFilterField {
  localValue: string
  filteredOptions: Array<IResourceFilterOption>
}

export interface FilterFields {
  [key: string]: FilterFieldWithLocalValues
}
@Component({
  selector: 'filter-form',
  styleUrls: ['./FilterForm.component.scss'],
  templateUrl: './FilterForm.component.html'
})
export class FilterFormComponent implements OnInit {
  @Input() filters: FilterFields
  @Input() filterRelations: IResourceFilters
  @Input() resetEnabled: boolean = true
  @Input() columns = 4
  @Input() submitEnabled: boolean = false
  @Input() titleDisabled = false
  @Input() filterTitle: string
  @Input() toggleable = false
  @Input() filterListOperators = true
  @Output() onFilterChange = new EventEmitter<IFilterChangeEvent>()
  @Output() onFormAction: EventEmitter<FormAction> = new EventEmitter<FormAction>()
  changes = {}
  filterFields: Array<any>
  filterList: Array<FilterFieldWithLocalValues> = []
  form: FormGroup
  showFilters = true

  constructor (
    private FormService: FormService
  ) {}

  /**
   * ngOnInit lifecyle event
   */
  ngOnInit () {
    if (this.toggleable) this.showFilters = false
    if (!this.columns) this.columns = 4

  }

  ngOnChanges (changes: SimpleChanges) {
    if (changes.filters && this.filters) {
      // Create angular form group for nested form component bindings
      this.filters = Object.keys(this.filters).reduce(
        (acc, key) => {
          acc[key] = Object.assign(this.filters[key], {key})
          // Populate previous filter value
          acc[key].value = this.form
            ? acc[key].value || (this.form.controls[key] ? this.form.controls[key].value : void 0)
            : acc[key].value
          return acc
        },
      {})

      this.form = this.FormService.toFormGroupFromFilter(this.filters)

      // Subscribe to changes in form controls and merge into filter model.
      this.form.valueChanges.subscribe((formValues) => {
        const keys = Object.keys(formValues)

        const { filters, changes } = keys.reduce((acc, key) => {
          const val = formValues[key]
          const filter = this.filters[key]
          if (val !== undefined) {
            const previousValue = this.filters[key].value
            this.filters[key].value = val
            const mutatedFilter = Object.assign({}, filter, { value: val })

            return {
              filters: Object.assign({}, acc.filters, { [key]: mutatedFilter }),
              changes: Object.assign(acc.changes, { [key]: previousValue !== val })
            }
          }

          return acc
        }, { filters: this.filters, changes: {} })

        this.filters = filters
        this.changes = changes
        this.emitFilterChange()
        this.setFilterList()
      })

      // Change filter object to array
      const filterKeys = Object.keys(this.filters).filter(key => !this.filters[key].hidden)
      this.filterFields = filterKeys.map(key => this.filters[key])

      this.setFilterList()
    }
  }

  setFilterList () {
    this.filterList = Object
      .keys(this.filters)
      .map(key => this.filters[key])
      .filter(filterField => filterField.values && filterField.values.length > 0)
  }

  filterOptions (filterValue: string, options) {
    if (filterValue === undefined || filterValue === '') return options

    return options.filter(option => (option.value as string).indexOf(filterValue) === 0)
  }

  addToFilterValues (filterName: string, value: string) {
    if (value === '' || value === undefined) return

    const filter = this.filters[filterName]
    if (!filter.options.some(option => option.value === value) || filter.values.some(val => val === value)) return

    filter.values = filter.values.concat(value)
    filter.localValue = ''
    this.setFilterList()
    this.form.controls[filterName].setValue(filter.values)
  }

  removeFilterValue(filterName: string, value: string) {
    const filter = this.filters[filterName]

    filter.values = filter.values.filter(val => val !== value)
    this.setFilterList()
    this.form.controls[filterName].setValue(filter.values)
  }

  toggleForm () {
    this.showFilters = !this.showFilters
  }

  /**
   * Set all filters to blank
   * TODO: Update clear filters to handle booleans etc
   */
  clearFilters () {
    const keys = Object.keys(this.filters)
    keys.forEach(key => {
      const filter = this.filters[key]
      filter.value = ''
      if (filter.values !== undefined) {
        filter.values = []
      }
      this.form.controls[key].setValue('')
    })
  }

  emitFilters () {
    this.onFilterChange.emit({
      filterValues: this.form.value,
      filters: this.filters,
      changes: this.changes
    })
  }

  /**
   * Emit a change event for external components
   */
  emitFilterChange () {
    if (Object.keys(this.changes).length > 0) {
      this.emitFilters()
    }
  }

  /**
   * Emits a user selected form button action
   * @param actionType The type of action the event communicates
   */
  emitFormAction (actionType: ActionType) {
    this.onFormAction.emit({
      filterValues: this.form.value,
      type: actionType,
      value: this.filters
    })
  }

  /**
   * Clear filters then emit that reset has been selected for external subscribers
   */
  resetFilters () {
    this.clearFilters()
    this.emitFormAction('Reset')
  }
}

@Component({
  selector: 'filter-form-basic',
  template: `
  <form name="filterForm" [formGroup]="form">

    <validatable-input
      *ngFor="let filter of filterFields" style="display: inline-block; margin-right: 2rem;"
      [id]="'filterField-' + filter.key"
      [class.has-error]="form && !form.controls[filter.key].valid"
      [form]="form"
      [field]="filter"
      [name]="filter.key"
      [label]="filter.displayName"
      [type]="filter.fieldType"
      [options]="filter.options"
      [canEdit]="true"
      [(model)]="filter.value"
      [constraints]="filter.constraints"></validatable-input>

    <div class="form-actions">
      <button type="reset"
        mat-button
        (click)="resetFilters()"
        *ngIf="resetEnabled"
        [color]="submitEnabled ? 'accent' : 'primary'">
        {{ 'Reset' | translate }}
      </button>
      <button
        mat-button
        color="primary"
        type="submit"
        [disabled]="form && !form.valid"
        (click)="emitFormAction('Submit')"
        *ngIf="submitEnabled">
        {{ 'Filter' | translate }}
      </button>
    </div>
  </form>
  `
})
export class FilterFormBasicComponent extends FilterFormComponent {
  @Input() filters: FilterFields
  @Input() filterRelations: IResourceFilters
  @Input() columns = 4
  @Input() resetEnabled: boolean = true
  @Input() submitEnabled: boolean = false
  @Input() filterTitle: string
  @Input() toggleable = false
  @Output() onFilterChange = new EventEmitter<IFilterChangeEvent>()
  @Output() onFormAction: EventEmitter<FormAction> = new EventEmitter<FormAction>()
}
