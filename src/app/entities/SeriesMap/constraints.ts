import * as fields from './constants'
import { isPresentString, isPresentInteger, isInteger } from '../common-constraints'

export const constraints = {
  [fields.seriesMapName]: isPresentString(30),
  [fields.carSeriesCode]: isPresentString(4),
  [fields.carSeriesMapColour]: isPresentString(30),
  [fields.lineMapId]: isPresentInteger,
  [fields.seriesMapGroupId]: isInteger
}

export const fieldNames = fields
