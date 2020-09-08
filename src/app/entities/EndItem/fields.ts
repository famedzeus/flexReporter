import { FieldCollection, FieldType } from '../entity.types'
import * as fieldNames from './constants'
import constraints from './constraints'

const fields: FieldCollection = [{
  fieldName: fieldNames.modelVariant,
  displayName: 'Model',
  editable: false
}, {
  fieldName: fieldNames.carSeriesCode,
  displayName: 'Car Series',
  editable: false
}, {
  fieldName: fieldNames.destinationCode,
  displayName: 'Destination',
  editable: false
}, {
  fieldName: fieldNames.adoptShift,
  displayName: 'Adoption Shift',
  type: FieldType.DateShift,
  editable: false
}, {
  fieldName: fieldNames.abolishShift,
  displayName: 'Abolition Shift',
  type: FieldType.DateShift
}, {
  fieldName: fieldNames.description,
  displayName: 'Description',
  isDescriptor: true
}]

export default {
  constraints,
  fieldNames,
  fields
}
