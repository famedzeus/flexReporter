import * as fieldNames from './constants'
import { constraints } from './constraints'
import { FieldCollection } from '../entity.types'

const fields: FieldCollection = [{
  fieldName: fieldNames.id,
  displayName: 'Id'
}, {
  fieldName: fieldNames.calendarCode,
  displayName: 'Calendar Code'
}, {
  fieldName: fieldNames.shiftCode,
  displayName: 'Shift'
}, {
  fieldName: fieldNames.weekCode,
  displayName: 'Week'
}, {
  fieldName: fieldNames.startDateTime,
  displayName: 'Start Date'
}, {
  fieldName: fieldNames.endDateTime,
  displayName: 'End Date'
}]

export default {
  constraints,
  fieldNames,
  fields
}
