import * as fields from './constants'
import { isPresentString, isPresentInteger, isInRange, combine } from '../common-constraints'
import { IConstraintMap } from '../entity.types'

export const constraints: IConstraintMap = {
  [fields.patternName]: isPresentString(50),
  [fields.seriesMapName]: isPresentString(50),
  [fields.sequence]: combine(isPresentInteger, isInRange(0, 999))
}
