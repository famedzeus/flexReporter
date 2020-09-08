import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core'
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material'
import { AbstractControl, FormGroup } from '@angular/forms'
import { cloneDeep } from 'lodash'
import { IConstraint, IRecordField, IResourceFilterOption } from 'entities'
type Errors = Array<string>

@Component({
  selector: 'validatable-input',
  styleUrls: ['./ValidatableInput.component.scss'],
  templateUrl: './ValidatableInput.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop' }]
})
export class ValidatableInputComponent implements OnInit {
  @Input() form: FormGroup
  @Input() autocomplete: boolean
  @Input() constraints: IConstraint
  @Input() disableLengthHint: boolean = false
  @Input() canEdit: boolean
  @Input() field: IRecordField
  @Input() model = ''
  @Input() name: string
  @Input() type: string
  @Input() hintLocale: string = ''
  @Input() label: string
  @Input() options: Array<IResourceFilterOption> = []
  @Input() loading: boolean
  @Input() initialModel: any
  @Input() defaultOptionDisabled = false
  @Input() description = ''
  @Input() allowIndeterminate = false
  @Output() onUpdateError = new EventEmitter<Errors>()
  @Output() onInputChange = new EventEmitter<any>()
  control: AbstractControl
  indeterminate: boolean = false

  selectStyle () {
    const selected = this.options.find(option => option.value === this.model)

    if (selected && selected.extraInformation) {
      return {
        color: selected.extraInformation.textColour,
        background: selected.extraInformation.backgroundColour
      }
    }

    return {}
  }

  ngOnInit () {
    this.initialModel = cloneDeep(this.model)

    if (this.allowIndeterminate && this.model === '') {
      this.indeterminate = true
    }

    if (this.form) {
      this.control = this.form.controls[this.name]
    }
  }

  containsExtraInformation () {
    if (!this.options) return false

    return this.options.some(option => option.extraInformation)
  }

  onChange (value) {
    this.onInputChange.emit(value)
  }

  setNextCheckboxValue () {
    const currentValue = this.control.value
    if (this.allowIndeterminate === true) {
      if (currentValue === true) {
        this.control.setValue(false)
        this.indeterminate = false
      } else if (currentValue === false) {
        this.control.setValue(null)
        this.indeterminate = true
      } else {
        this.control.setValue(true)
        this.indeterminate = false
      }
    } else {
      this.control.setValue(!currentValue)
    }

  }

  updateModel (value) {
    this.model = value
    this.onChange(this.model)
  }
}
