import { isPresentString, isBoolean } from '../common-constraints'
import * as consts from './constants'
export const constraints = {
  [consts.scheduleScopeName]: isPresentString(50),
  [consts.setName]: isPresentString(30),
  [consts.inverse]: isBoolean,
  [consts.operation]: isPresentString(3)
}
