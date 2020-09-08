import * as fields from './constants'
import {
  combine,
  isBoolean,
  isInteger,
  isInRange,
  isString,
  isPresent,
  isPresentString,
  isReadOnly } from '../common-constraints'

/**
 * @name constraints
 * @description
 * Rule entity field constraint object in validate.js format.
 */
export const constraints = {
  [fields.scheduleScopeName]: combine(isPresentString(50), isReadOnly),
  [fields.active]: isBoolean,
  [fields.ruleType]: isPresentString(20),  // TODO: Enum options?
  [fields.ruleDescription]: isString(50),
  [fields.zoneCode]: isPresentString(2),
  [fields.range]: combine(isInteger, isPresent),
  [fields.pattern]: isPresentString(200),
  [fields.parameter1]: combine(isInteger, isPresent),
  [fields.parameter2]: combine(isInteger, isPresent),
  [fields.penaltyFunctionName]: isPresentString(50),
  [fields.priority]: combine(isInteger, isInRange(-999, 999), { presence: true })
}
