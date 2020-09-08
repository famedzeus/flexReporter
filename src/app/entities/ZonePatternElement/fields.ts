import { FieldCollection, FieldType } from '../entity.types'
import * as fieldNames from './constants'
import { constraints } from './constraints'

const fields: FieldCollection = [
  {
    fieldName: fieldNames.sequence,
    displayName: 'Sequence',
    editable: false,
    type: FieldType.Number,
    isDescriptor: true
  },
  {
    fieldName: fieldNames.zonePatternId,
    displayName: 'Pattern Id',
    type: FieldType.String,
    editable: false,
    foreignKey: true

  }, {
    fieldName: fieldNames.zoneCode,
    displayName: 'Zone Code',
    foreignKey: true,
    isDescriptor: true
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
