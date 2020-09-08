import { FieldCollection } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Child Scope',
    fieldName: fieldNames.childScheduleScopeName
  },
  {
    displayName: 'Parent Scope',
    fieldName: fieldNames.parentScheduleScopeName
  },
  {
    displayName: 'Child Set',
    fieldName: fieldNames.childSetName
  }, {
    displayName: 'Parent Set',
    fieldName: fieldNames.parentSetName
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
