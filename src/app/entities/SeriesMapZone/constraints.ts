import * as fields from './constants'
import { isPresentString, isInRange, isPresentInteger, isBoolean } from '../common-constraints'
import { IConstraintMap } from '../entity.types'

export const constraints: IConstraintMap = {
  [fields.additionalSeconds]: isInRange(0, 100000000),
  [fields.seriesMapName]: isPresentString(30),
  [fields.pullForwardBy]: isInRange(0, 100000000),
  [fields.zoneCode]: isPresentString(30),
  [fields.minimumSpacing]: isInRange(0, 10000000),
  [fields.ignorePattern]: isBoolean,
  [fields.position]: isPresentInteger
}
