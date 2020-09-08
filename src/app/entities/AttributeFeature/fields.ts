import { FieldCollection } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Schedule',
    fieldName: fieldNames.scheduleScopeName,
    editable: false
  },
  {
    displayName: 'Attribute Name',
    fieldName: fieldNames.attributeName,
    editable: false
  }, {
    displayName: 'Value',
    fieldName: fieldNames.attributeValue,
    editable: false
  }, {
    displayName: 'Car Series',
    isDescriptor: true,
    fieldName: fieldNames.carSeries
  }, {
    displayName: 'Code',
    fieldName: fieldNames.featureCode,
    isDescriptor: true
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
