import { FieldCollection } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Shop id',
    fieldName: fieldNames.id,
    autoPrimaryKey: true,
    editable: false
  },
  {
    displayName: 'Shop Name',
    fullDisplayName: 'Shop Name',
    isDescriptor: true,
    fieldName: fieldNames.name
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
