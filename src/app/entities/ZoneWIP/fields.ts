import { FieldCollection, FieldType } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Zone code',
    fieldName: fieldNames.zoneCode,
    editable: false,
    isDescriptor: true
  },
  {
    displayName: 'Shift',
    fieldName: fieldNames.shiftCode,
    editable: false,
    type: FieldType.DateShift,
    isDescriptor: true
  },
  {
    displayName: 'Target WIP',
    fieldName: fieldNames.targetWIP,
    type: FieldType.Number,
    inlineEditingEnabled: true
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
