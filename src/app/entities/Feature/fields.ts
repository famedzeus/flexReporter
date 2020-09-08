import { FieldCollection, FieldType } from '../entity.types'
import * as fieldNames from './constants'
import { constraints } from './constraints'

const fields: FieldCollection = [
  {
    fieldName: fieldNames.abolishShift,
    displayName: 'Abolish Shift',
    type: FieldType.DateShift
  },
  {
    fieldName: fieldNames.adoptShift,
    displayName: 'Adopt Shift',
    type: FieldType.DateShift
  },
  {
    fieldName: fieldNames.description,
    displayName: 'Description',
    isDescriptor: true,
    inlineEditingEnabled: true,
    type: FieldType.String
  },
  {
    fieldName: fieldNames.carSeries,
    displayName: 'Car Series'
  },
  {
    fieldName: fieldNames.featureCode,
    displayName: 'Feature Code',
    isDescriptor: true
  },
  {
    fieldName: fieldNames.featureType,
    displayName: 'Feature Type'
  }
]

export default {
  constraints,
  fieldNames,
  fields
}
