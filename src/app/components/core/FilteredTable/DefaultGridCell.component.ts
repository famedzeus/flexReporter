import { Component, Output } from '@angular/core'
import { AgRendererComponent } from 'ag-grid-angular'
import { BaseCell } from './BaseCell'

@Component({
  selector: 'default-cell-component',
  template: `
    <span *ngIf="params.colDef.type === 'number'">{{ value }}</span>
    <span *ngIf="params.colDef.type !== 'number'"> {{ value | translate }}</span>
  `
})
export class DefaultGridCellComponent extends BaseCell {}
