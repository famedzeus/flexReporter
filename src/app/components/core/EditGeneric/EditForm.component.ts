import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { FormService } from './Form.service'
import { merge } from 'lodash'
import { Subscription } from 'rxjs'
import { FormSetters, FormChange } from './EditForm.types'

@Component({
  selector: 'edit-form',
  templateUrl: './EditForm.component.html',
  styleUrls: ['./EditForm.component.scss'],
  providers: [FormService]
})
export class EditFormComponent implements OnChanges, OnDestroy {
  @Input() hideFields = false
  @Input() fieldLayout
  @Input() fields
  @Input() cols = null
  @Input() submitLabelCode = 'Save'
  @Input() cancelLabelCode = 'Close'
  @Input() formBodyClass = ''
  @Input() formFooterClass = ''
  @Input() record
  @Input() hideCancel = false
  @Input() hideSave = false
  @Input() saveDisabled = false
  @Input() mode
  @Input() formSetters: FormSetters
  @Output() onAction = new EventEmitter()
  @Output() onCancel = new EventEmitter()
  // Output which will emit any record update if current form is valid
  @Output() onFormUpdate = new EventEmitter()

  /** Output to emit record of changes field values */
  @Output() onFormChanges = new EventEmitter<FormChange>()
  form: FormGroup
  internalRecord
  currentFormSubscription: Subscription = null

  controlLayout

  constructor (
    private FormService: FormService
  ) {}

  setModel (fieldName, value) {
    this.internalRecord[fieldName] = value

    this.form.controls[fieldName].setValue(value)
  }

  submit () {
    this.onAction.emit(this.internalRecord)
  }

  /**
   * Makes reference copy of record so that no mutation is made
   * Sets default Values is provided
   */
  createInternalRecordCopy () {
    if (this.formSetters && this.mode === 'Create') {
      const defaultValues = this.formSetters
        .filter(setter => setter.defaultValue)
        .reduce((acc, setter) => {
          return Object.assign(acc, {
            [setter.fieldName]: setter.defaultValue
          })
        }, {})
      return merge({}, this.record, defaultValues)
    }

    return Object.assign({}, this.record)
  }

  initialiseForm () {
    this.FormService.mode = this.mode

    this.internalRecord = this.createInternalRecordCopy()

    if (this.mode === 'Create') {
      this.record = Object.assign({}, this.internalRecord)
    }

    this.form = this.FormService.toFormGroup(this.fields, this.internalRecord)
    this.currentFormSubscription = this.form.valueChanges
      .subscribe(formVal => {
        // Find changed fields
        const changedFields = Object.keys(formVal)
          .filter(fieldName => this.internalRecord[fieldName] !== formVal[fieldName])

        // Create description of changed field values
        const changedValues = changedFields
          .reduce((acc, fieldName) => {
            return Object
              .assign(acc, {
                [fieldName]: {
                  currentValue: formVal[fieldName],
                  previousValue: this.internalRecord[fieldName]
                }
              })
          }, {})

        let setRecordChanges = {}
        if (this.formSetters) {
          // Compile list of reactive/automatically set field changes
          setRecordChanges = this.formSetters
            // Remove any setters which do not pass the predicate provided
            .filter(setter => setter.fieldSetter && (!setter.fieldChangePredicate || setter.fieldChangePredicate(changedValues, formVal)))
            .reduce((acc, next) => {
              const val = next.fieldSetter(changedValues, formVal)
              // If field value will be the same - discard it
              if (val === this.internalRecord[next.fieldName]) {
                return acc
              }

              return Object.assign(acc, {
                [next.fieldName]: val
              })
            }, {})
        }

        this.internalRecord = merge({}, this.internalRecord, formVal, setRecordChanges)

        if (this.form.valid) {
          this.onFormUpdate.emit(this.internalRecord)
        }

        // Update form controls after internal record updated to prevent stack overflow
        setTimeout(() => {
          Object
            .keys(setRecordChanges)
            .forEach(fieldName => {
              this.form.controls[fieldName].setValue(setRecordChanges[fieldName])
            })
        })
      })

    if (!this.fieldLayout) {
      // Calculate a grid layout
      const cols = this.cols || (this.fields.length < 3 ? this.fields.length : 3)
      this.controlLayout = this.fields.reduce((acc, field, index) => {
        const remainder = index % cols
        if (remainder === 0) {
          acc.push({ fields: [], cols })
        }
        const row = acc[acc.length - 1]
        row.fields.push(field)

        return acc
      }, [])
    } else {
      // Use supplied layout to organise fields
      const findField = fieldName => this.fields.find(field => field.fieldName === fieldName)
      this.controlLayout = this.fieldLayout
        .map(row => Object.assign({}, row, {
          // change field names to field meta data
          fields: row.fields.reduce((acc, fieldName) => {
            const field = findField(fieldName)
            if (field) {
              return acc.concat([field])
            }
            return acc
          }, [])
        }))
        .filter(row => row.fields.length > 0)
    }
  }

  ngOnChanges (changes) {
    if (changes['record'] && this.fields) {
      this.unsubscribeForm()
      this.initialiseForm()
    }
  }

  ngOnDestroy () {
    this.unsubscribeForm()
  }

  private unsubscribeForm () {
    if (this.currentFormSubscription) {
      this.currentFormSubscription.unsubscribe()
    }
  }
}

/**
 * Separated for use with agular 2+  (different template)
 */
@Component({
  selector: 'dialog-edit-form',
  templateUrl: './EditForm.component.dialog.html',
  styleUrls: ['./EditForm.component.dialog.scss'],
  providers: [FormService]
})
export class DialogEditFormComponent extends EditFormComponent {
  @Input() hideFields = false
  @Input() fieldLayout
  @Input() fields
  @Input() submitLabelCode = 'Save'
  @Input() cancelLabelCode = 'Close'
  @Input() formBodyClass = ''
  @Input() formFooterClass = ''
  @Input() record
  @Input() hideCancel = false
  @Input() mode
  @Output() onAction = new EventEmitter()
  @Output() onCancel = new EventEmitter()

  constructor (
    FormService: FormService
  ) { super(FormService) }
}
