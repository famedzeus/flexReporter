import { FieldType, FieldCollection } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Shift',
    fieldName: fieldNames.shiftCode,
    type: FieldType.DateShift,
    minimumWidth: 190,
    width: 190
  },
  {
    displayName: 'Status',
    fieldName: fieldNames.status,
    minimumWidth: 165,
    maximumWidth: 165
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
