import * as fields from './constants'
import { isPresentString, isPresentInteger } from '../common-constraints'
import { IConstraintMap } from '../entity.types'

/**
 * @name constraints
 * @description
 * ZonePatternElement field constraints object in validate.js format.
 */
export const constraints: IConstraintMap = {
  [fields.sequence]: isPresentInteger,
  [fields.zoneCode]: isPresentString(2),
  [fields.zonePatternId]: isPresentInteger
}
