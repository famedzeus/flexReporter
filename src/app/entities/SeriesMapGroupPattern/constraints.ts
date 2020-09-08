import * as fields from './constants'
import { isPresentString, isPresentInteger } from '../common-constraints'
import { IConstraintMap } from '../entity.types'

export const constraints: IConstraintMap = {
  [fields.name]: isPresentString(30),
  [fields.zoneCode]: isPresentString(30),
  [fields.sequence]: isPresentInteger,
  [fields.seriesMapGroupId]: isPresentInteger
}
