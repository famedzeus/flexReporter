import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'panel-toggle-button',
  styleUrls: ['./PanelToggleButton.component.scss'],
  template: `
  <button mat-mini-fab color="primary"
    class="toggle-icon-animated"
    (click)="onClick.emit()"
    [matTooltip]="isOpen ? tooltipOpenText : tooltipClosedText"
    [matTooltipPosition]="tooltipPosition"
    [class.opened]="isOpen">
    <i class="fa fa-navicon"></i>
  </button>
  `
})
export class PanelToggleButtonComponent {
  @Input() isOpen: boolean = false
  @Input() tooltipOpenText: string
  @Input() tooltipClosedText: string
  @Input() tooltipPosition = 'top'
  @Output() onClick = new EventEmitter()
}
