import { Component, EventEmitter, Output } from '@angular/core'
import { AgRendererComponent } from 'ag-grid-angular'

@Component({
  selector: 'disabled-checkbox-cell-component',
  template: `
    <input type="checkbox"
      [checked]="value" disabled=""true />
  `
})
export class DisabledCheckboxCellComponent implements AgRendererComponent {
  params:any;
  value: any;

  agInit(params:any): void {
    try {
      this.value = params.data[params.colDef.field]
    } catch (e) {}
      this.params = params;
  }

  refresh () {
    return false
  }
}
