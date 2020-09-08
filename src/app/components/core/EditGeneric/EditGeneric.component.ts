import { Component, EventEmitter, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material'
import { cloneDeep } from 'lodash'
import { Log } from '../../../services/log'
import { IRecordField } from 'entities'
import { IAlert } from '../Alerts'
import { FormSetters } from './EditForm.types'

/**
 * @description
 * Controller for creating/ editing a record (intended to be called with ui modal)
 */
@Component({
  selector: 'edit-generic',
  styleUrls: ['./EditGeneric.component.scss'],
  templateUrl: './EditGeneric.component.html'
})
export class EditGenericComponent implements OnInit {
  fieldOrder: Array<string> = []
  fieldLayout: Array<{ fields: Array<any> }>
  fields: Array<IRecordField>
  hasActionFailed: boolean = false
  alertEmitter = new EventEmitter<IAlert>()
  hideFields = false
  mode
  record
  initialRecord
  action
  errorDescription: string
  customTitles = {}
  formSetters: FormSetters

  constructor (
    protected Log: Log,
    public instance: MatDialogRef<any>
  ) {}

  ngOnInit () {
    if (this.mode === 'Delete' || this.mode === 'Edit') {
      this.initialRecord = this.record
      this.record = cloneDeep(this.record)
    } else if (this.mode === 'Create') {
      this.record = {}
      this.fields = this.fields.filter(field => !field.autoPrimaryKey)
      this.fields.forEach(field => {
        if (field.type === 'boolean') {
          this.record[field.fieldName] = false
        } else if (!field.type || (field.type === 'string' && !field.options) || field.type === 'mask') {
          this.record[field.fieldName] = ''
        }
      })
    }
  }

  commitAction (modifiedRecord = this.record) {
    const handleSuccess = () => {
      this.instance.close({ $value: modifiedRecord })
    }
    const handleErr = (response) => {
      const { body: { message = '' } = {} } = response
      this.alertEmitter.emit({
        displayMilliseconds: 1000000,
        message: message || response.message || 'edit_request_error',
        type: 'danger'
      })
    }
    const prom = this.action({ data: modifiedRecord, currentRecord: this.initialRecord })

    if (prom.then) {
      prom
        .then(handleSuccess)
        .catch(handleErr)
    } else {
      this.instance.close()
    }
  }

  cancel () {
    this.instance.close({ $value: 'cancel' })
  }
}
