import { Injectable, Pipe, PipeTransform } from '@angular/core'
import { DatePipe } from '@angular/common'

@Injectable()
@Pipe({
  name: 'customDateFilter'
})
export class CustomDatePipe implements PipeTransform {

  constructor (
    private datePipe: DatePipe
  ) {}

  transform (rawInput: number | string = '', format: string) {
    const input = typeof rawInput === 'number' ? rawInput.toString() : rawInput

    switch (format) {
      case 'YYYYWWDD':
        return 'Day ' + input.substr(6,2) + ', week ' + input.substr(4,2) + ', ' + input.substr(0,4)
      case 'YYYYWW':
        return 'Week ' + input.substr(4,2) + ', ' + input.substr(0,4)
      case 'YYYYWWDDSS':
        return 'Day ' + input.substr(6,2) + ', week ' + input.substr(4,2) + ', shift ' + input.substr(8,2) + ', ' + input.substr(0,4)
      case 'WW':
        return 'Week ' + input.substr(4,2)
      case 'SSS':
				// Needs 'dynamicising'
        const shiftNum = input.substr(8,1)
        return this.getShiftName(shiftNum)
      case 'YYYYMMDDS':
        return `${input.substr(6,2)}-${input.substr(4,2)}-${input.substr(0,4)}, ${this.getShiftName(Number(input.substr(8,1)))} shift`
      case 'UTC':
        return this.datePipe.transform(input, 'dd-MM-yyyy HH:mm:ss')
      case 'UTC-DATE-ONLY':
        return this.datePipe.transform(input, 'dd-MM-yyyy')
      default:
        return input
    }
  }

  getShiftName (shiftNum) {
    switch (+shiftNum) {
      case 1:
        return 'Day'
      case 2:
        return 'Late'
      case 3:
        return 'Night'
    }
  }

}
