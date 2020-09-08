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
    displayName: 'Weight',
    fieldName: fieldNames.metricWeight,
    type: FieldType.Number
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
