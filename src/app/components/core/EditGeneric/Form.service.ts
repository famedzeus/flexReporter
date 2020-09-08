import { Injectable } from '@angular/core'
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms'
import { IConstraint, IRecordField, IResourceFilters } from 'entities'
import v = require('validate.js/validate.d')
const validate: v.ValidateJS = require('validate.js')
type InputMode = 'Edit' | 'Create'
export const constraintsValidator =
  (constraints: IConstraint = {}, validator = validate.single): ValidatorFn =>
    (control: AbstractControl) => {
      const { value } = control

      const errors = constraints ? validator(value, constraints) : null

      // validate.js does ignore lack of presence flag
      if (errors && (constraints.presence || value !== '')) {
        return { constraints: errors }
      }

      return null
    }

@Injectable()
export class FormService {
  private _mode: InputMode = 'Create'

  toFormGroup (fields: Array<IRecordField>, model: any) {
    const controls = fields.reduce((acc, field) => Object.assign(
      acc,
      {
        [field.fieldName]: this.getFieldControl(field, model[field.fieldName])
      }
    ), {})

    return new FormGroup(controls)
  }

  /**
   * TODO: add validation
   * @param filters An array of filter objects
   * @param model Current state of filter model
   */
  toFormGroupFromFilter (filters: IResourceFilters) {
    const keys = Object.keys(filters)
    const controls = keys.reduce((acc, filterName) => Object.assign(
      acc,
      {
        [filterName]: new FormControl(filters[filterName].value || '')
      }
    ), {})

    return new FormGroup(controls)
  }

  swapControls (form: FormGroup, removeFields: Array<IRecordField>, newFields: Array<IRecordField>) {
    removeFields.forEach(field => form.removeControl(field.fieldName))
    newFields.forEach(field => form.addControl(field.fieldName, this.getFieldControl(field, '')) )
  }

  set mode (mode: InputMode) {
    this._mode = mode
  }

  private getFieldControl (field: IRecordField, value: any) {
    return new FormControl(
      { value: value, disabled: field.editable === false && this._mode === 'Edit' },
      constraintsValidator(field.constraints, validate.single)
    )
  }
}
