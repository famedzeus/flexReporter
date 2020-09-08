import * as fields from './constants'
import { isPresentString, isPresentInteger } from '../common-constraints'

export const constraints = {
  [fields.id]: isPresentInteger,
  [fields.name]: isPresentString(20)
}

export const fieldNames = fields
