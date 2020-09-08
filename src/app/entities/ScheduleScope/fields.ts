import { FieldCollection, FieldType } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Schedule Scope Name',
    fieldName: fieldNames.scheduleScopeName,
    isDescriptor: true,
    editable: false
  },
  {
    displayName: 'Offline Start Shift',
    fieldName: fieldNames.offlineStartShift,
    type: FieldType.DateShift
  },
  {
    displayName: 'Offline End Shift',
    fieldName: fieldNames.offlineEndShift,
    type: FieldType.DateShift
  },
  {
    displayName: 'Schedule Start Period',
    fieldName: fieldNames.scheduleStartPeriod
  },
  {
    displayName: 'Previous Schedule Scope',
    fieldName: fieldNames.previousScheduleScopeName,
    options: []
  },
  {
    displayName: 'Previous Committed Solution',
    fieldName: fieldNames.previousSolutionName,
    options: []
  },
  {
    displayName: 'Schedule End Period',
    fieldName: fieldNames.scheduleEndPeriod
  },
  {
    displayName: 'Line Map',
    fieldName: fieldNames.lineMapId,
    type: FieldType.Number
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
