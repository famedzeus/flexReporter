import { Component, Input } from '@angular/core'

/**
 * Date shifts are outputted in plenty of views.  This should be standardized by using a component
 */
@Component({
  selector: 'formatted-date-shift-range',
  template: `
    <formatted-date-shift [dateShift]="startDateShift"></formatted-date-shift>
    -
    <formatted-date-shift [dateShift]="endDateShift"></formatted-date-shift>
  `
})

export class FormattedDateShiftRangeComponent {
  @Input() startDateShift = 0
  @Input() endDateShift = 0
}