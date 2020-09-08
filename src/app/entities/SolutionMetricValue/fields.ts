import { FieldCollection, FieldType } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Metric',
    fieldName: fieldNames.metricName,
    editable: false,
    isDescriptor: true
  },
  {
    displayName: 'Value',
    fieldName: fieldNames.metricValue,
    type: FieldType.Number
  },
  {
    displayName: 'Scope Name',
    fieldName: fieldNames.scheduleScopeName,
    editable: false,
    isDescriptor: true
  },
  {
    displayName: 'Solution Name',
    fieldName: fieldNames.scheduleSolutionName,
    editable: false,
    isDescriptor: true
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
