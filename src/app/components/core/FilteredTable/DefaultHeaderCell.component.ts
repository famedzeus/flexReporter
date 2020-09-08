import { Component, EventEmitter, Output, HostListener } from '@angular/core'
import { IHeaderAngularComp } from 'ag-grid-angular'
import { Subject, Subscription } from 'rxjs'

@Component({
  selector: 'default-header-component',
  styleUrls: ['./DefaultHeaderCell.component.scss'],
  template: `
    {{ value | translate }}
    <mat-icon *ngIf="inlineEditEnabled" [matTooltip]="'column_editable' | translate">edit</mat-icon>
    <i *ngIf="isSort" class="fa"
      [class.fa-chevron-up]="isDescending === false"
      [class.fa-chevron-down]="isDescending === true"></i>
  `
})
export class DefaultGridHeaderComponent implements IHeaderAngularComp {
  static onClicked = new EventEmitter<{ field: string, listenerId: number }>()
  static sort = new Subject<{ listenerId: number, field: string, direction: string }>()
  inlineEditEnabled = false
  @HostListener('click')
  setClick () {
    DefaultGridHeaderComponent.onClicked
      .emit({
        field: this.field,
        listenerId: this.params.column.colDef.listenerId
      })
  }
  params:any
  value: string
  private field: string
  private sortSubscription: Subscription
  isSort = false
  private isDescending = false

  ngOnInit () {
    DefaultGridHeaderComponent.sort
      .filter(sortInfo => this.params.column.colDef.listenerId === sortInfo.listenerId)
      .subscribe(sortInfo => {
        this.isSort = sortInfo.field === this.field
        this.isDescending = sortInfo.direction === 'desc'
      })
  }

  agInit(params:any): void {
    this.value = params.displayName
    this.field = params.column.colDef.field
    this.params = params
    this.inlineEditEnabled = params.column.colDef.inlineEditingEnabled
  }

  ngOnDestroy () {
    if (this.sortSubscription) {
      this.sortSubscription.unsubscribe()
    }
  }
}
