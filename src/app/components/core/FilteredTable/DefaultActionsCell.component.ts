import { Component, EventEmitter, Output } from '@angular/core'
import { AgRendererComponent } from 'ag-grid-angular'

@Component({
  selector: 'default-actions-cell',
  styleUrls: ['./DefaultActionsCell.component.scss'],
  template: `
    <div class="flex actions-column" >
      <div *ngIf="colDef?.rowsReorderable === true">
        <button mat-mini-fab
          [matTooltip]="'datatable_reorder_item_up' | translate"
          [disabled]="params.rowIndex === 0"
          (click)="selectAction('ReorderUp', $event)">
          <i class="fa fa-arrow-up"></i>
        </button>
        <button mat-mini-fab
          [matTooltip]="'datatable_reorder_item_down' | translate"
          (click)="selectAction('ReorderDown', $event)">
          <i class="fa fa-arrow-down"></i>
        </button>
      </div>
      <button *ngIf="colDef?.update"
        mat-mini-fab
        [matTooltip]="'datatable_edit_item' | translate"
        (click)="selectAction('Edit', $event)">
        <i class="fa fa-pencil"></i>
      </button>
      <button
        *ngIf="colDef?.delete"
        [matTooltip]="'datatable_delete_item' | translate"
        mat-mini-fab
        color="warn"
        (click)="selectAction('Delete', $event)">
        <i class="fa fa-trash-o"></i>
      </button>
      <button *ngIf="colDef?.config"
        mat-mini-fab
        [matTooltip]="'datatable_edit_item_metaconfig' | translate"
        (click)="selectAction('Settings', $event)">
        <i class="fa fa-gear"></i>
      </button>
    </div>
  `
})
export class DefaultActionsCellComponent implements AgRendererComponent {
  static onClicked: EventEmitter<any> = new EventEmitter()
  params:any;
  value: any;

  colDef: any

  agInit (params:any): void {
    try {
      this.colDef = params.colDef
    } catch (e) {}
    this.params = params;
  }

  refresh () {
    return false
  }

  selectAction (actionName: string, $event) {
    $event.stopPropagation()
    DefaultActionsCellComponent
      .onClicked
      .emit({
        actionName,
        $event,
        row: this.params.data,
        listenerId: this.params.column.colDef.listenerId
      })
  }

}
