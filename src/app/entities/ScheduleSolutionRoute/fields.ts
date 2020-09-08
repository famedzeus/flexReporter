import { FieldType, FieldCollection } from '../entity.types'
import * as fieldNames from './constants'
import { constraints } from './constraints'

const fields: FieldCollection = [{
  fieldName: fieldNames.routeNumber,
  isDescriptor: true,
  displayName: 'Route'
}, {
  fieldName: fieldNames.scheduleSolutionName,
  displayName: 'Schedule Solution',
  editable: false
}, {
  fieldName: fieldNames.scheduleScopeName,
  displayName: 'Schedule Scope',
  editable: false
}, {
  fieldName: fieldNames.kiteflyer,
  displayName: 'Kiteflyer',
  minimumWidth: 90,
  width: 90,
  type: FieldType.Boolean
}, {
  fieldName: fieldNames.userAllocated,
  displayName: 'User Allocated',
  minimumWidth: 120,
  width: 120,
  type: FieldType.Boolean
}]

export default {
  constraints,
  fields,
  fieldNames
}
