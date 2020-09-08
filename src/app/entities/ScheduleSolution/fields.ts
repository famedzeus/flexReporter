import { FieldCollection } from '../entity.types'
import * as fieldNames from './constants'
import { constraints } from './constraints'

const fields: FieldCollection = [{
  fieldName: fieldNames.scheduleSolutionName,
  displayName: 'Schedule Solution',
  isDescriptor: true,
  editable: false
}, {
  fieldName: fieldNames.scheduleScopeName,
  displayName: 'Schedule Scope',
  isDescriptor: true,
  editable: false
}]

export default {
  constraints,
  fields,
  fieldNames
}
