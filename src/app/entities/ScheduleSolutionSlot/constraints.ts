import * as fields from './constants'
import { combine, isPresentString, isPresentInteger, isInRange } from '../common-constraints'

export const constraints = {
  [fields.scheduleScopeName]: isPresentString(50),
  [fields.scheduleSolutionName]: isPresentString(50),
  [fields.schedulePeriod]: isPresentString(8),
  [fields.routeNumber]: combine(isInRange(0, 9999), isPresentInteger),
  [fields.slotId]: isPresentString(100)
}
