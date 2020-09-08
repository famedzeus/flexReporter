import { combine, isPresentInteger, isInRange, isPresentString } from '../common-constraints'
import * as constants from './constants'
import { IConstraintMap } from '../entity.types'

export const constraints: IConstraintMap = {
  [constants.carSeries]: isPresentString(6),
  [constants.colourCode]: isPresentString(3),
  [constants.colourGroupCode]: isPresentString(3),
  [constants.colourPaintSeq]: combine(isPresentInteger, isInRange(0, 99)),
  [constants.colourTypeCode]: isPresentString(2)
}
