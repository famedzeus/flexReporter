import * as constants from './constants'
import { isPresent } from '../common-constraints'
export const constraints = {
  [constants.userId]: isPresent,
  [constants.emailAddress]: isPresent,
  [constants.userName]: isPresent,
  [constants.language]: isPresent,
  [constants.enabled]: isPresent
}
