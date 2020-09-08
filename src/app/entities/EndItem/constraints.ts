import * as consts from './constants'
import { combine, isString, isStringMin } from '../common-constraints'

export default {
  [consts.modelVariant]: combine(isString(18), isStringMin(18)),
  [consts.description]: isString(30)
}
