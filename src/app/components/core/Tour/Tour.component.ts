import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core'
import { TourService } from './Tour.service'

@Component({
  selector: 'tour-guide',
  styleUrls: ['./Tour.component.scss'],
  template: `
  <button mat-mini-fab
    [matTooltip]="tooltipLocale | translate"
    (click)="startTour()">
    <i [class]="iconClassName"></i>
  </button>
  `
})
export class TourComponent implements OnDestroy {
  @Input() iconClassName = 'fa fa-question'
  @Input() startStep = 0
  @Input() tourDefinition: TourDefinition = null
  @Input() tooltipLocale = 'tour_guide'
  @Output() onTourStarted = new EventEmitter<null>()

  constructor (
    private Tour: TourService
  ) {}

  ngOnDestroy () {
    this.Tour.endTour()
  }

  /**
   * Translate locale messages then start a tour
   * @throws Error when tour definition is not set
   */
  startTour () {
    if (!this.tourDefinition) throw new Error(`TourDefinition has not been provided`)

    this.Tour
      .translateMessages(this.tourDefinition)
      .first()
      .subscribe(tourDefinition => {
        this.Tour.startTour(tourDefinition, this.startStep)
        this.onTourStarted.emit()
      })
  }

}
