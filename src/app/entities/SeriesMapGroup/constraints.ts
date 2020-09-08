import * as fields from './constants'
import { isPresentString, isPresentInteger } from '../common-constraints'
import { IConstraintMap } from '../entity.types'

export const constraints: IConstraintMap = {
  [fields.id]: isPresentInteger,
  [fields.description]: isPresentString(30)
}
