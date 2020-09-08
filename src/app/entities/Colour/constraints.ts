import { isPresentString } from '../common-constraints'
import * as constants from './constants'

export const constraints = {
  [constants.colourCode]: isPresentString(3),
  [constants.colourTypeCode]: isPresentString(2),
  [constants.description]: isPresentString(30)
}
