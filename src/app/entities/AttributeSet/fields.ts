import { FieldCollection, FieldType } from '../entity.types'
import * as fieldNames from './constants'
import { constraints } from './constraints'

const { SetOperation } = fieldNames
const fields: FieldCollection = [
  {
    displayName: 'Schedule Scope',
    fieldName: fieldNames.scheduleScopeName,
    editable: false,
    autoPrimaryKey: true
  },
  {
    displayName: 'Set Name',
    fieldName: fieldNames.setName,
    isDescriptor: true
  },
  {
    displayName: 'Operation',
    fieldName: fieldNames.operation,
    options: [
      { value: SetOperation.Every, description: 'Every' },
      { value: SetOperation.Some, description: 'Some' }]
  },
  {
    displayName: 'Inverse',
    fieldName: fieldNames.inverse,
    type: FieldType.Boolean
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
