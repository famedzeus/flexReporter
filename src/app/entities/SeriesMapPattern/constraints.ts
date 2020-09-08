import * as fields from './constants'
import { isPresentString } from '../common-constraints'
import { IConstraintMap } from '../entity.types'

export const constraints: IConstraintMap = {
  [fields.patternName]: isPresentString(30)
}
