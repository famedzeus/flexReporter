import * as consts from './constants'
import { combine, isPresent, isString } from '../common-constraints'
export default {
  [consts.featureCode]: combine(isPresent, isString(5)),
  [consts.abolishShift]: isPresent
}
