import { FieldCollection, FieldType } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Name',
    fieldName: fieldNames.name,
    isDescriptor: true
  },
  {
    displayName: 'Sequence',
    fieldName: fieldNames.sequence,
    type: FieldType.Number
  },
  {
    displayName: 'Group',
    fieldName: fieldNames.seriesMapGroupId,
    options: [],
    editable: false
  },
  {
    displayName: 'Zone code',
    fieldName: fieldNames.zoneCode
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
