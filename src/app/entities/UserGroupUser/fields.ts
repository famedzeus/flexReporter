import * as fieldNames from './constants'
import { constraints } from './constraints'
import { FieldCollection } from '../entity.types'

const fields: FieldCollection = [{
  fieldName: fieldNames.groupName,
  displayName: 'Group'
}, {
  fieldName: fieldNames.userId,
  displayName: 'User'
}]

export default {
  constraints,
  fields,
  fieldNames
}
