import { FieldCollection } from '../entity.types'
import constraints from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [{
  fieldName: fieldNames.id,
  displayName: 'Route Id'
}, {
  fieldName: fieldNames.carSeries,
  displayName: 'Car Series'
}, {
  fieldName: fieldNames.lineId,
  displayName: 'Line'
}, {
  fieldName: fieldNames.schedulePeriod,
  displayName: 'Schedule Period'
}, {
  fieldName: fieldNames.routeNumber,
  displayName: 'Route Number'
}, {
  fieldName: fieldNames.scheduleDate,
  displayName: 'Schedule Date'
}, {
  fieldName: fieldNames.shiftCode,
  displayName: 'Shift'
}, {
  fieldName: fieldNames.offlineDateTime,
  displayName: 'Offline'
}, {
  fieldName: fieldNames.seriesMap,
  displayName: 'Sereies Map'
}, {
  fieldName: fieldNames.routeStatus,
  displayName: 'Status'
}]

export default {
  constraints,
  fields,
  fieldNames
}
