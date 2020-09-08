import { isPresentString } from '../common-constraints'
import * as constants from './constants'

export const constraints = {
  [constants.destinationCode]: isPresentString(3),
  [constants.destinationName]: isPresentString(30)
}
