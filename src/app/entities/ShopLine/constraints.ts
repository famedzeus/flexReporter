import * as fields from './constants'
import { isPresentString, isPresentInteger } from '../common-constraints'
import { IConstraintMap } from '../entity.types'

/**
 * @name constraints
 * @description
 * ShopLine field constraint object in validate.js format.
 */
export const constraints: IConstraintMap = {
  [fields.calendarCode]: isPresentString(5),
  [fields.buildOrder]: isPresentInteger,
  [fields.lineId]: isPresentInteger,
  [fields.shopId]: isPresentInteger
}
