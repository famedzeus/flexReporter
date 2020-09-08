import { Component, EventEmitter, Output } from '@angular/core'
import { AgRendererComponent } from 'ag-grid-angular'

@Component({
  selector: 'date-cell-component',
  template: `
    {{ value | date}}
  `
})
export class DateGridCellComponent implements AgRendererComponent {
  value: any;

  agInit(params:any): void {
    try {
      this.value = params.data[params.colDef.field]
    } catch (e) {}
  }

  refresh () {
    return false
  }

}
