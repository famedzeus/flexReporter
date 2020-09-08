import { isPresentString, isPresentInteger } from '../common-constraints'
import * as constants from './constants'

export const constraints = {
  [constants.penaltyFunctionName]: isPresentString(30),
  [constants.costFunctionTypeCode]: isPresentString(2),
  [constants.costFunctionParameter]: isPresentInteger
}
