import { FieldCollection } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'
import requestErrorLocaleCodes from './errorLocaleCodes'

const fields: FieldCollection = [
  {
    displayName: 'Name',
    fieldName: fieldNames.patternName,
    isDescriptor: true
  }
]

export default {
  requestErrorLocaleCodes,
  constraints,
  fields,
  fieldNames
}
