import { FieldCollection, FieldType } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Line Name',
    fieldName: fieldNames.name,
    isDescriptor: true
  },
  {
    displayName: 'Line Id',
    fieldName: fieldNames.id,
    type: FieldType.Number,
    autoPrimaryKey: true,
    editable: false
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
