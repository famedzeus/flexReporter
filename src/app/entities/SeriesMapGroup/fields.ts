import { FieldCollection } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Description',
    fieldName: fieldNames.description,
    isDescriptor: true
  },
  {
    displayName: 'Id',
    fieldName: fieldNames.id,
    editable: false,
    autoPrimaryKey: true
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
