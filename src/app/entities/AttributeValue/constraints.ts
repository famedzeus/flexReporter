import * as fields from './constants'
import { isPresentString, isReadOnly } from '../common-constraints'
import { IConstraintMap } from '../entity.types'

/**
 * @description
 * AttributeValue field constraint object in validate.js format.
 */
export const constraints: IConstraintMap = {
  [fields.attributeName]: isReadOnly,
  [fields.attributeValue]: isPresentString(20),
  [fields.scheduleScopeName]: isReadOnly
}
