import { Component, EventEmitter, HostBinding, Output } from '@angular/core'
import { AgRendererComponent } from 'ag-grid-angular'

@Component({
  selector: 'default-coloured-cell-component',
  template: `
    {{ value | translate }}
  `
})
export class DefaultColouredCellComponent implements AgRendererComponent {
  @HostBinding('style.background-color') backgroundColour = 'black'
  @HostBinding('style.color') textColour = 'green'
  @Output() onClicked = new EventEmitter()
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
