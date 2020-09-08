import { Component, EventEmitter, Output } from '@angular/core'
import { AgRendererComponent } from 'ag-grid-angular'

@Component({
  selector: 'date-shift-cell-component',
  template: `
    {{value | dateShift:'date'}}
    ({{(value | dateShift:'shift' | translate ) }})
  `
})
export class DateShiftGridCellComponent implements AgRendererComponent {
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
