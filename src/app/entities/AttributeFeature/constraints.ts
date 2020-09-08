import * as fields from './constants'
import { isPresentString, isReadOnly } from '../common-constraints'
import { IConstraintMap } from '../entity.types'

/**
 * @description
 * AttributeFeature field constraint object in validate.js format.
 */
export const constraints: IConstraintMap = {
  [fields.attributeValue]: isReadOnly,
  [fields.attributeName]: isReadOnly,
  [fields.carSeries]: isPresentString(4),
  [fields.featureCode]: isPresentString(4),
  [fields.scheduleScopeName]: isReadOnly
}
