import { FieldCollection } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Schedule',
    fieldName: fieldNames.scheduleScopeName
  },
  {
    displayName: 'Attribute Set',
    fieldName: fieldNames.setName
  },
  {
    displayName: 'Attribute Name',
    fieldName: fieldNames.attributeName
  }, {
    displayName: 'Attribute Value',
    fieldName: fieldNames.attributeValue,
    isDescriptor: true
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
