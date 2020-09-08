import * as fields from './constants'
import { isPresentString, isPresentInteger } from '../common-constraints'
import { IConstraintMap } from '../entity.types'

/**
 * @name constraints
 * @description
 * ZoneWIP field constraints object in validate.js format.
 */
export const constraints: IConstraintMap = {
  [fields.zoneCode]: isPresentString(4),
  [fields.shiftCode]: isPresentInteger,
  [fields.targetWIP]: isPresentInteger
}
