import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import { FormGroup } from '@angular/forms'

interface IMask {
  value: string,
  flag: boolean
}
@Component({
  selector: 'c-mask-input',
  styleUrls: ['./MaskInput.component.scss'],
  template: `
    <fieldset [formGroup]="form">
      <div *ngFor="let char of masks; let i=index">
        <span>{{i + 1}}</span>
        <input
          class="form-control"
          name="{{'mask' + i}}"
          [class.mask-set]="char.value.length > 0"
          [value]="char.value"
          type="text"
          maxlength="1"
          [placeholder]="maskNull"
          size="1"
          (change)="onCharEntry($event.target.value, i)" />
        <input
          type="checkbox"
          (change)="onMaskChange($event.target.checked, i)"
          [checked]="char.flag"
          [disabled]="char.value === ''">
      </div>
      <input [hidden]="true" [value]="maskValue" [formControlName]="'mask'" />
    </fieldset>
  `
})
export class MaskInputComponent implements OnInit {
  /** Length that mask string should be */
  @Input() maskLength: number = 18
  /** The initial value of the mask */
  @Input() model: string = ''
  /** Value of null mask index */
  @Input() maskNull = '-'
  @Input() form: FormGroup

  @Output() onChange = new EventEmitter<string>()
  maskValue = ''
  /** array of masks to represet UI model */
  masks: Array<IMask> = []

  ngOnInit () {
    this.maskValue = this.model
    const blankedModel = this.format(' ', this.maskNull)
    // Store array of masks for UI
    // Set flags to true, false or null depending on related character
    this.masks = blankedModel.split('').map(
      char => char === ' '
        ? { value: '', flag: false}
        : { value: char, flag: char.toUpperCase() === char ? true : false })

    // Create initial model flag string
    this.maskValue = this.format(this.maskNull)

    // Force form to have initial value
    this.form.controls['mask'].setValue(this.maskValue)
  }

  /**
   * Cut flat string to correct size and fill null values
   * with correct characters
   * @example
   * this.model = '  5  7 '
   * format('-', ' ')
   * >> '--5--7-'
   * @param filler A charcter to swap for empty values
   * @param initial The character which represents an empty value
   */
  format (filler: string, initial: string = ' ') {
    return this.maskValue
      .substr(0, this.maskLength)
      .replace(new RegExp(initial, 'ig'), filler)
      .padEnd(this.maskLength, filler)
  }

  /**
   * Replace a character at an index in current model string
   * @param index The index at which the character should be swapped
   * @param char the new character to be placed in the string
   * @return The updated string
   */
  replaceAt (index: number, char: string) {
    return this.maskValue.substr(0, index) + char + this.maskValue.substr(index + 1, this.maskLength)
  }

  onCharEntry (char, index: number) {
    const upperChar = char.toUpperCase()
    const flag = char === '' ? false : true
    this.masks = this.masks.map((mask, i) => i === index ? { value: upperChar, flag } : mask)
    this.replaceModelChar(index, upperChar)
    this.onChange.emit(this.maskValue)
  }

  /**
   * replaces one of the characters in the model string and makes
   * sure the model is formatted into correct string
   */
  replaceModelChar (index: number, char: string) {
    this.maskValue = this.replaceAt(index, char)
    this.maskValue = this.format(this.maskNull)
  }

  /**
   * Sets the character to upper or lower case then resets model string
   * @param value True if an input is ticket
   * @param index char/flag index
   */
  onMaskChange (value: boolean, index: number) {
    this.masks = this.masks.map((mask, i) => {
      if (i === index) {
        return {
          flag: value,
          value: value === true ? this.masks[index].value.toUpperCase() : this.masks[index].value.toLowerCase()
        }
      }
      return mask
    })
    this.replaceModelChar(index, this.masks[index].value)
    this.onChange.emit(this.maskValue)
  }
}
