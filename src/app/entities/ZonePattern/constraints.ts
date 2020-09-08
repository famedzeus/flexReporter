import * as fields from './constants'
import { isPresentString, isPresentInteger } from '../common-constraints'
import { IConstraintMap } from '../entity.types'

/**
 * @name constraints
 * @description
 * ZonePattern field constraints object in validate.js format.
 */
export const constraints: IConstraintMap = {
  [fields.id]: isPresentInteger,
  [fields.name]: isPresentString(50)
}
