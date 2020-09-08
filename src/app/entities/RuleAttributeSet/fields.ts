import { FieldCollection, FieldType } from '../entity.types'
import * as fieldNames from './constants'
import { constraints } from './constraints'

const fields: FieldCollection = [
  {
    fieldName: fieldNames.scheduleScopeName,
    displayName: 'Schedule Scope'
  },
  {
    fieldName: fieldNames.ruleId,
    displayName: 'Rule Id'
  },
  {
    fieldName: fieldNames.setName,
    displayName: 'Attribute Set'
  },
  {
    fieldName: fieldNames.relationshipCode,
    displayName: 'Relationship Code'
  },
  {
    fieldName: fieldNames.carSeries,
    displayName: 'Car Series'
  },
  {
    fieldName: fieldNames.opposite,
    displayName: 'Inclusivity',   // NOTE: the heck is this field? opposite of what?
    type: FieldType.Boolean,
    options: [
      { value: false, description: 'in' },
      { value: true, description: 'not in' }
    ]
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
