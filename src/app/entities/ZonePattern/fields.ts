import { FieldCollection } from '../entity.types'
import * as fieldNames from './constants'
import { constraints } from './constraints'

const fields: FieldCollection = [
  {
    fieldName: fieldNames.id,
    displayName: 'Id',
    autoPrimaryKey: true,
    editable: false
  }, {
    fieldName: fieldNames.name,
    displayName: 'Name',
    isDescriptor: true
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
