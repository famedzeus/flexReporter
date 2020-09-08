import { Component, EventEmitter, Output } from '@angular/core'
import { AgRendererComponent } from 'ag-grid-angular'

@Component({
  selector: 'checkbox-edit-cell-component',
  template: `
    <input type="checkbox"
      [checked]="value"
      [(ngModel)]="value" (ngModelChange)="handleValueChange($event)" />
  `
})
export class CheckboxEditCellComponent implements AgRendererComponent {
  private params:any;
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

  handleValueChange (event) {
    this.params.setValue(event)
  }

}
