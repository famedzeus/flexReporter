import { Component, EventEmitter, Output } from '@angular/core'
import { AgRendererComponent } from 'ag-grid-angular'

@Component({
  selector: 'date-time-cell-component',
  template: `
    {{ value | date: 'dd/MM/yyyy HH:mm:ss' }}
  `
})
export class DateTimeGridCellComponent implements AgRendererComponent {
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
