import { FieldCollection, FieldType } from '../entity.types'
import * as fieldNames from './constants'
import { constraints } from './constraints'

const fields: FieldCollection = [
  {
    fieldName: fieldNames.id,
    displayName: 'Id'
  },
  {
    fieldName: fieldNames.eventDateTime,
    displayName: 'Logged',
    type: FieldType.Date
  },
  {
    fieldName: fieldNames.userId,
    displayName: 'User Id'
  },
  {
    fieldName: fieldNames.computerName,
    displayName: 'Computer Name'
  },
  {
    fieldName: fieldNames.functionName,
    displayName: 'Function Name'
  },
  {
    fieldName: fieldNames.severity,
    displayName: 'Severity',
    type: FieldType.Number,
    options: [1,2,3].map(item => ({
      value: item,
      description: item.toString()
    }))
  },
  {
    fieldName: fieldNames.eventLogMessage,
    displayName: 'Message'
  },
  {
    fieldName: fieldNames.applicationName,
    displayName: 'App Name'
  }
]

export default {
  constraints,
  fieldNames,
  fields
}
