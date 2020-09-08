import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { getBoundOffset } from '../../../services/browser-utils'

/**
 * A wrapper for whichever colour picker implementation is used
 */
@Component({
  selector: 'colour-input',
  styleUrls: ['./ColourInput.component.scss'],
  template: `
  <div class="colour-input">
    <div #el>
      <label *ngIf="name">{{ name | translate }}</label>
      <input class="form-control"
        *ngIf="pickerPosition"
        (colorPickerChange)="colourChanged($event)"
        [colorPicker]="colourCode"
        [style.background-color]="colourCode"
        [cpPosition]="pickerPosition"
        [value]="colourCode" />
    </div>
  </div>
  `
})
export class ColourInputComponent {
  @ViewChild('el') el
  @Input() colourCode = '#fff'
  @Input() name = ''
  @Output() onColourChange = new EventEmitter<any>()
  pickerPosition = ''

  ngAfterViewInit () {
    // Wait for angular to stop messing about with the dom then set the colour picker position
    setTimeout(() => this.setPickerPosition(), 0)
  }

  colourChanged (colour) {
    this.colourCode = colour
    this.onColourChange.emit(colour)
  }

  /**
   * Will get bound offset of element compared to body then set the position to
   * top or bottom depending upon bound offset.
   */
  setPickerPosition () {
    const boundOffset = getBoundOffset(this.el.nativeElement, new RegExp('body', 'gi'))
    const xPosition = boundOffset.x < 350 ? 'right' : 'left'
    this.pickerPosition = boundOffset.y < 600 ? xPosition : 'top'
  }
}
