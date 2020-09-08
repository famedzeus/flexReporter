import * as constants from './constants'
import { isPresentInteger, isPresentString } from '../common-constraints'

export const constraints = {
  [constants.adoptShift]: isPresentInteger,
  [constants.abolishShift]: isPresentInteger,
  [constants.mapPurpose]: isPresentString(16),
  [constants.description]: isPresentString(30)
}
