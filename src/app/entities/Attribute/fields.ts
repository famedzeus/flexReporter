import { FieldCollection } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Attribute Name',
    fieldName: fieldNames.attributeName,
    isDescriptor: true
  }, {
    displayName: 'Schedule',
    fieldName: fieldNames.scheduleScopeName,
    autoPrimaryKey: true,
    editable: false
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
