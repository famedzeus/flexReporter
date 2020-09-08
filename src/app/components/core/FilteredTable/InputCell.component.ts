// import { Component, EventEmitter, Output } from '@angular/core'
// import { AgRendererComponent } from 'ag-grid-angular'

// @Component({
//   selector: 'input-cell-component',
//   template: `
//   <c-inline-input
//     [(model)]="row[field.fieldName]"
//     [field]="field"
//     [icon]="getIcon(row,field)"
//     [type]="field.type"
//     [isPersisting]="row.isPersisting"
//     [tabIndex]="field.tabIndex + i"
//     (onSave)="selectAction('Edited', row, $event)"></c-inline-input>
//   `
// })
// export class GridInputCellComponent implements AgRendererComponent {
//   @Output() onClicked = new EventEmitter()
//   private params:any;
//   private value: any;

//   agInit(params:any): void {
//     try {
//       this.value = params.data[params.colDef.field]
//     } catch (e) {}
//       this.params = params;
//   }

//   refresh () {
//     return false
//   }

// }
