import { isPresent, isPresentString } from '../common-constraints'
import * as fields from './constants'

export const constraints = {
  [fields.carSeries]: isPresent,
  [fields.description]: isPresentString(30),
  [fields.destinationCode]: isPresent,
  [fields.featureCode]: isPresentString(5)
  // [fields.mask]: isPresent
}
