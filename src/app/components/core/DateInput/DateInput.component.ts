import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormGroup } from '@angular/forms'
import * as moment from 'moment'
const validate = require('validate.js')

export interface IDateStruct {
  year: number
  month: number
  day: number
}

validate.extend(validate.validators.datetime, {
  parse (value, options) {
    return +moment.utc(value)
  },

  format (value, options) {
    const format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss'
    return moment.utc(value).format(format)
  }
})

/**
 * Component which wraps a datepicker & input
 */
@Component({
  selector: 'date-input',
  styleUrls: ['./DateInput.component.scss'],
  templateUrl: './DateInput.component.html'
})
export class DateInputComponent {
  @Input() constraints
  @Input() model
  @Input() inputDisabled: boolean = false
  @Input() maxDate
  @Input() minDate
  @Input() label: string
  @Input() name: string
  @Input() form: FormGroup
  @Input() placeholder: string = ''
  @Input() floatPlaceholder: boolean = false
  @Input() dateStruct: IDateStruct
  @Output() onUpdateErrors = new EventEmitter()
  @Output() onDateChange = new EventEmitter<any>()
  date: Date
  dateString: string

  ngOnChanges (changes) {
    if ((!changes.model && !changes.dateStruct)) return

    const date = this.dateStruct || this.model || this.date

    if (typeof date === 'string') {
      this.date = moment(date, 'YYYY-MM-DD').toDate()
    } else if (date && date.month) {
      const {day, year, month} = date
      this.date = new Date(year, month - 1, day)
    }

    if (this.form && this.date) {
      this.form.controls[this.name].setValue(this.formatDate(this.date))
    }
  }

  updateErrors (errors) {
    this.onUpdateErrors.emit(errors)
  }

  dateChanged (date: Date) {
    const dateStr = this.formatDate(date)
    if (this.form) {
      this.form.controls[this.name].setValue(dateStr)
    }

    if (dateStr === this.dateString) return
    this.dateString = dateStr

    this.onDateChange.emit(dateStr)
  }

  private formatDate (date: Date) {
    return moment(date).format('YYYY-MM-DD')
  }
}
