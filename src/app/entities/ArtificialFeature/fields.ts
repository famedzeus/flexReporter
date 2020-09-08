import { FieldCollection, FieldType } from '../entity.types'
import * as fieldNames from './constants'
import { constraints } from './constraints'

const fields: FieldCollection = [{
  fieldName: fieldNames.featureCode,
  displayName: 'Feature Code',
  editable: false
}, {
  fieldName: fieldNames.carSeries,
  displayName: 'Car Series'
}, {
  fieldName: fieldNames.mask,
  displayName: 'Mask',
  type: FieldType.Mask
}, {
  fieldName: fieldNames.description,
  displayName: 'Description',
  isDescriptor: true
}, {
  fieldName: fieldNames.destinationCode,
  displayName: 'Destination'
}]

export default {
  constraints,
  constants: fieldNames,
  fieldNames,
  fields
}
