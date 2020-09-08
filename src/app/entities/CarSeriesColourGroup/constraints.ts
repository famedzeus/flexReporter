import { isPresentString } from '../common-constraints'
import * as constants from './constants'
import { IConstraintMap } from '../entity.types'

export const constraints: IConstraintMap = {
  [constants.carSeriesCode]: isPresentString(4),
  [constants.colourGroupCode]: isPresentString(3),
  [constants.description]: isPresentString(30)
}
