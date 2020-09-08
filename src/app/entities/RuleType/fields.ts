import { FieldCollection } from '../entity.types'
import * as fieldNames from './constants'
import { constraints } from './constraints'

const fields: FieldCollection = [
  {
    fieldName: fieldNames.ruleType,
    displayName: 'Rule Type Code',
    editable: false
  },
  {
    fieldName: fieldNames.ruleTypeName,
    displayName: 'Rule Type',
    maximumWidth: 160,
    minimumWidth: 160,
    editable: false
  }
]

export default {
  constraints,
  fieldNames,
  fields
}
