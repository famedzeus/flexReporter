import * as fields from './constants'
import { isPresentString, isPresentInteger } from '../common-constraints'

export const constraints = {
  [fields.carSeriesCode]: isPresentString(4),
  [fields.description]: isPresentString(30)
}

export const fieldNames = fields
