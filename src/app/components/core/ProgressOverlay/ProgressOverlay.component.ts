import { Component, Input, HostBinding } from '@angular/core'

@Component({
  selector: 'progress-overlay',
  styleUrls: ['./ProgressOverlay.component.scss'],
  template: `
  <mat-progress-spinner
    *ngIf="displayOverlay"
    mode="indeterminate"></mat-progress-spinner>
  `
})
export class ProgressOverlayComponent {
  @Input() displayOverlay: boolean = false
  @HostBinding('class.progress-overlay-show') displayOverlayValue = false

  ngOnChanges () {
    this.displayOverlayValue = this.displayOverlay
  }

}
