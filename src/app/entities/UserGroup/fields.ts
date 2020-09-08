import * as fieldNames from './constants'
import { constraints } from './constraints'
import { FieldCollection } from '../entity.types'

const fields: FieldCollection = [{
  fieldName: fieldNames.accessRight,
  displayName: 'Access Right'
}, {
  fieldName: fieldNames.groupEmailAddress,
  displayName: 'Email'
}, {
  fieldName: fieldNames.groupName,
  displayName: 'Name',
  isDescriptor: true
}]

export default {
  constraints,
  fields,
  fieldNames
}
