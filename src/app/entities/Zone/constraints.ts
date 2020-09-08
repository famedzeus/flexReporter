import * as fields from './constants'
import { isBoolean, isPresent, combine, isString, isPresentString, isPresentInteger, isInRange } from '../common-constraints'
import { IConstraintMap } from '../entity.types'

/**
 * @name constraints
 * @description
 * Zone field constraints object in validate.js format.
 */
export const constraints: IConstraintMap = {
  [fields.shopOrder]: combine(isPresent, isInRange(0, 99)),
  [fields.zoneType]: isPresentString(20),
  [fields.calendarCode]: isPresentString(5),
  [fields.zoneCode]: isPresentString(2),
  [fields.zoneName]: isPresentString(20),
  // [fields.zonePatternId]: ,
  [fields.taktMultiplier]: isPresentInteger,
  [fields.active]: isBoolean
}
