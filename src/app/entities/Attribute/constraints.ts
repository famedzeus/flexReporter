import * as fields from './constants'
import { isPresentString } from '../common-constraints'
import { IConstraintMap } from '../entity.types'

/**
 * @description
 * Attribute field constraint object in validate.js format.
 */
export const constraints: IConstraintMap = {
  [fields.attributeName]: isPresentString(20),
  [fields.scheduleScopeName]: {
    presence: true
  }
}
