import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core'

type CardType = 'warn' | 'advise' | 'info'

/**
 * Card message component which is styled with warning colours
 */
@Component({
  selector: 'warning-card',
  styleUrls: ['./WarningCard.component.scss'],
  template: `
    <mat-card [attr.color]="colour">
      <mat-card-title>
        <i [class]="iconClass"></i>
        <span>{{ titleLocale | translate }}</span>
      </mat-card-title>
      <mat-list *ngIf="warningList && warningList.length > 0">
        <mat-list-item
          color="warn"
          *ngFor="let warningCode of warningList">
          {{ warningCode | translate }}
        </mat-list-item>
      </mat-list>
      <ng-content></ng-content>
      <p *ngIf="contentSuffixKey">{{ contentSuffixKey | translate }}</p>
    </mat-card>
  `
})
export class WarningCardComponent {
  @Input() titleLocale = ''
  @Input() contentSuffixKey = ''
  @Input() warningList: Array<string> = []

  @Input()
  set cardType(type: CardType) {
    this.colour = type
    this.iconClass = this.getIconClass(type)
  }

  iconClass = 'fa fa-exclamation-circle'
  colour = 'warn'

  getIconClass (type: CardType) {
    switch (type) {
      case 'warn': return 'fa fa-exclamation-circle'
      case 'advise': return 'fa fa-exclamation-triangle'
      default: return 'fa fa-info-circle'
    }
  }
}
