import { FieldCollection, FieldType } from '../entity.types'
import * as fieldNames from './constants'
import constraints from './constraints'

const fields: FieldCollection = [{
  fieldName: fieldNames.adoptShift,
  displayName: 'Adopt Shift',
  type: FieldType.DateShift,
  editable: false,
  autoPrimaryKey: true
}, {
  fieldName: fieldNames.abolishShift,
  displayName: 'Abolish Shift',
  type: FieldType.DateShift
}, {
  fieldName: fieldNames.destinationCode,
  displayName: 'Destination',
  editable: false,
  autoPrimaryKey: true
}, {
  fieldName: fieldNames.featureCode,
  displayName: 'Feature',
  editable: false,
  isDescriptor: true
}, {
  fieldName: fieldNames.carSeriesCode,
  displayName: 'Car Series',
  editable: false,
  autoPrimaryKey: true
}, {
  fieldName: fieldNames.modelVariant,
  displayName: 'Model Variant',
  editable: false,
  autoPrimaryKey: true
}]

export default {
  constraints,
  fieldNames,
  fields
}
