import { FieldCollection } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Schedule',
    fieldName: fieldNames.scheduleScopeName,
    autoPrimaryKey: true
  },
  {
    displayName: 'Attribute Name',
    fieldName: fieldNames.attributeName,
    autoPrimaryKey: true
  }, {
    displayName: 'Value',
    fieldName: fieldNames.attributeValue,
    isDescriptor: true
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
