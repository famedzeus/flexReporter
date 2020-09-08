import { Injectable, Pipe, PipeTransform } from '@angular/core'
import { DatePipe } from '@angular/common'
import * as moment from 'moment'

type DSFormat = 'date' | 'shift' | 'date-shift' | 'date-object' | 'shift-number' | 'date-time'

/**
 * A transformer class for: dateshift -> useful formats
 */
@Injectable()
@Pipe({
  name: 'dateShift'
})
export class DateShiftPipe implements PipeTransform {

  constructor (
    private datePipe: DatePipe
  ) {}

  getDateParams (str: string = '') {
    const momentDate = moment(str, 'YYYYMMDD')
    return {
      year: momentDate.year(),
      month: momentDate.month(),
      day: momentDate.date()
    }
  }

  makeDateTime (dateTime: string) {
    const { year, month, day } = this.getDateParams(dateTime)
    const { hour, minute, second } = this.getTimeParams(dateTime)

    return new Date(
      year,
      month,
      day,
      parseInt(hour, 10),
      parseInt(minute, 10),
      parseInt(second, 10)
    )
  }

  /**
   * Transforms a dateshift code to a single entity
   * @param dateShift A dateshift code in custom 2001609222 'format'
   * @param format The intended output format of the transform
   * @param dateFormat Format for string if intended format is string representation of date
   * @returns Either a date object or a string
   */
  transform (dateShift: string | number, format: DSFormat, dateFormat = 'dd-MM-yyyy'): string | Date {
    const shiftStr = typeof dateShift === 'number' ? dateShift.toString() : dateShift
    try {
      switch (format) {
        case 'date-object':
          return this.makeDate(shiftStr)
        case 'date':
          return this.datePipe.transform(this.makeDate(shiftStr), dateFormat)
        case 'date-time':
          return this.datePipe.transform(this.makeDateTime(shiftStr), dateFormat + ' hh:mm:ss')
        case 'date-shift':
          return this.datePipe.transform(this.makeDate(shiftStr), dateFormat) + this.makeShift(shiftStr)
        case 'shift-number':
          return this.makeShift(shiftStr)
        default:
          return 'shift' + this.makeShift(shiftStr)
      }
    } catch {
      return ''
    }
  }

  /**
   * Helper to retrieve shift descriptor from dateShift
   */
  private makeShift (dateShift: string): string {
    const shift = dateShift.substr(8, 1)
    return shift
  }

  private getTimeParams (str: string) {
    return {
      hour: str.substr(8, 2),
      minute: str.substr(10, 2),
      second: str.substr(12, 2)
    }
  }

  /**
   * Helper to retrieve date object from dateShift
   */
  makeDate (dateShift: string): Date {
    const { year, month, day } = this.getDateParams(dateShift)
    return new Date(
      year,
      month,
      day
    )
  }

}
