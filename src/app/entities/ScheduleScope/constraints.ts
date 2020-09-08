import * as fields from './constants'
import { combine, isPresentString, isPresentInteger, isReadOnly } from '../common-constraints'

/**
 * @description
 * Schedule field constraint object in validate.js format.
 */
export const constraints = {
  [fields.scheduleScopeName]: combine(isPresentString(50), isReadOnly),
  [fields.scheduleStartPeriod]: isPresentString(8),
  [fields.scheduleEndPeriod]: isPresentString(8),
  // [fields.previousSolutionName]: isPresentString(50),
  // [fields.previousScheduleScopeName]: isPresentString(50),
  [fields.offlineStartShift]: isPresentInteger,
  [fields.offlineEndShift]: isPresentInteger,
  [fields.lineMapId]: isPresentInteger
}
