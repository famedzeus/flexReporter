import { Component, EventEmitter, OnInit, Input, Output, ViewEncapsulation } from '@angular/core';
import { IFilterFields, IResourceFilters } from 'entities'
import { FilterFields, FilterFormComponent, IFilterChangeEvent, FormAction } from './FilterForm.component'

/**
 * The filter form component contained within a material expansion panel
 */
@Component({
  selector: 'expansion-filter-form',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./ExpansionFilterForm.component.scss'],
  templateUrl: './ExpansionFilterForm.component.html'
})
export class ExpansionFilterFormComponent extends FilterFormComponent {
  @Input() filters: FilterFields
  @Input() filterRelations: IResourceFilters
  @Input() resetEnabled = true
  @Input() columns = 4
  @Input() submitEnabled: boolean = false
  @Input() filterTitle: string
  @Input() toggleable = false
  @Input() filterListOperators = true
  @Output() onFilterChange = new EventEmitter<IFilterChangeEvent>()
  @Output() onFormAction: EventEmitter<FormAction> = new EventEmitter<FormAction>()
}
