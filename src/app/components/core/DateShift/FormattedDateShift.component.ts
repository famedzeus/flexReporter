import { Component, Input } from '@angular/core';

@Component({
  selector: 'formatted-date-shift',
  template: `
    {{ dateShift | dateShift : 'date' : 'dd/MM/yyyy' }}
    ({{ dateShift | dateShift : 'shift' | translate }})
  `
})

export class FormattedDateShiftComponent {
  @Input() dateShift = 0
}
