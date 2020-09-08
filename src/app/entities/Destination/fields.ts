import { FieldCollection } from '../entity.types'
import * as fieldNames from './constants'
import { constraints } from './constraints'

const fields: FieldCollection = [{
  fieldName: fieldNames.destinationCode,
  displayName: 'Destination Code'
}, {
  fieldName: fieldNames.destinationName,
  displayName: 'Destination',
  isDescriptor: true
}]

export default {
  constraints,
  fieldNames,
  fields
}
