import { FieldCollection, FieldType } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Zone',
    fieldName: fieldNames.zoneCode
  },
  {
    displayName: 'Entry time',
    fieldName: fieldNames.entryTime,
    type: FieldType.DateTime
  },
  {
    displayName: 'Exit time',
    fieldName: fieldNames.exitTime
  },
  {
    displayName: 'Entry sequence',
    fieldName: fieldNames.entrySequence
  },
  {
    displayName: 'Exit sequence',
    fieldName: fieldNames.exitSequence
  },
  {
    displayName: 'Takt time',
    fieldName: fieldNames.taktTime
  },
  {
    displayName: 'Actual zone',
    fieldName: fieldNames.actualZone
  },
  {
    displayName: 'Wip',
    fieldName: fieldNames.wip
  },
  {
    displayName: 'Takt multiplier',
    fieldName: fieldNames.taktMultiplier
  },
  {
    displayName: 'Schedule date',
    fieldName: fieldNames.scheduleDate
  },
  {
    displayName: 'Shift',
    fieldName: fieldNames.shiftCode
  },
  {
    displayName: 'Status',
    fieldName: fieldNames.status
  },
  {
    displayName: 'RouteId',
    fieldName: 'routeId'
  },
  {
    displayName: 'Slot id',
    fieldName: 'id'
  },
  {
    displayName: 'Schedule period',
    fieldName: fieldNames.schedulePeriod
  },
  {
    displayName: 'Route number',
    fieldName: fieldNames.routeNumber
  },
  {
    displayName: 'Line Id',
    fieldName: fieldNames.lineId
  },
  {
    displayName: 'Previous shop line',
    fieldName: fieldNames.previousShopLine
  },
  {
    displayName: 'Previous zone code',
    fieldName: fieldNames.previousZoneCode
  },
  {
    displayName: 'Extended lead time',
    fieldName: fieldNames.extendedLeadTime
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
