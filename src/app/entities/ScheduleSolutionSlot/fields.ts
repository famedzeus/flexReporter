import { FieldType, FieldCollection } from '../entity.types'
import * as fieldNames from './constants'
import { constraints } from './constraints'

const fields: FieldCollection = [{
  fieldName: fieldNames.slotId,
  isDescriptor: true,
  displayName: 'Slot'
}, {
  fieldName: fieldNames.scheduleSolutionName,
  displayName: 'Schedule Solution',
  editable: false
}, {
  fieldName: fieldNames.scheduleScopeName,
  displayName: 'Schedule Scope',
  editable: false
}, {
  fieldName: fieldNames.routeNumber,
  displayName: 'Route Number',
  pinned: 'left',
  type: FieldType.Number,
  minimumWidth: 130,
  width: 130,
  editable: false
}]

export default {
  constraints,
  fields,
  fieldNames
}
