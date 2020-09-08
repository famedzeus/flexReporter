import * as fields from './constants'
import { isPresentString, isPresentInteger } from '../common-constraints'
import { IConstraintMap } from '../entity.types'

/**
 * @name constraints
 * @description
 * Shift field constraint object in validate.js format.
 */
export const constraints: IConstraintMap = {
  [fields.shiftCode]: isPresentInteger,
  [fields.status]: isPresentString(30)
}
