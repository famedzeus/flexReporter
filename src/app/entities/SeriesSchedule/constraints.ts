import * as fields from './constants'
import { isPresentString, isPresentInteger } from '../common-constraints'

export const constraints = {
  [fields.shiftCode]: isPresentInteger,
  [fields.volume]: isPresentInteger,
  [fields.seriesMapName]: isPresentString(30),
  [fields.scheduleSequence]: isPresentInteger
}

export const fieldNames = fields
