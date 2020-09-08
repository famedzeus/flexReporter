import { isPresentString } from '../common-constraints'
import * as constants from './constants'
import { IConstraintMap } from '../entity.types'

export const constraints: IConstraintMap = {
  [constants.colourTypeCode]: isPresentString(2),
  [constants.name]: isPresentString(30)
}
