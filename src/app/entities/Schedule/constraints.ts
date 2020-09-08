import * as fields from './constants'
import { isPresentString, isPresentInteger } from '../common-constraints'
import { IConstraintMap } from '../entity.types'

/**
 * @description
 * Shift field constraint object in validate.js format.
 */
export const constraints: IConstraintMap = {
  [fields.shiftCode]: isPresentInteger,
  [fields.weekCode]: isPresentInteger,
  [fields.startDateTime]: isPresentInteger,
  [fields.endDateTime]: isPresentInteger,
  [fields.calendarCode]: isPresentString(5),
  [fields.description]: isPresentString(30),
  [fields.displayOrder]: isPresentInteger,
  [fields.lineId]: isPresentInteger,
  [fields.shopId]: isPresentInteger
}
