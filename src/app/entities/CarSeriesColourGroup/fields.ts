import { FieldCollection } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [{
  fieldName: fieldNames.carSeriesCode,
  displayName: 'Car Series',
  editable: false
}, {
  fieldName: fieldNames.colourGroupCode,
  displayName: 'Colour Group',
  editable: false
}, {
  fieldName: fieldNames.description,
  displayName: 'Description',
  isDescriptor: true
}]

export default {
  fields,
  fieldNames,
  constraints
}
