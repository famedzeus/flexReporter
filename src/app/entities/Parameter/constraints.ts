import { isPresentString } from '../common-constraints'
import * as constants from './constants'

export const constraints = {
  [constants.userId]: isPresentString(8),
  [constants.parameter]: isPresentString(50),
  [constants.parameterType]: isPresentString(30),
  [constants.value]: isPresentString(200)
}
