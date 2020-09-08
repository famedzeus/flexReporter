import * as fields from './constants'
import { isPresentString, isPresentInteger } from '../common-constraints'

export const constraints = {
  [fields.name]: isPresentString(30),
  [fields.id]: isPresentInteger
}

export const fieldNames = fields
