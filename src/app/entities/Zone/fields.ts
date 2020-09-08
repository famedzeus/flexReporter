import { FieldCollection, FieldType } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Zone code',
    fieldName: fieldNames.zoneCode,
    editable: false,
    isDescriptor: true
  },
  {
    displayName: 'Zone Description',
    fieldName: fieldNames.zoneName
  },
  {
    displayName: 'Zone type',
    fieldName: fieldNames.zoneType
  },
  {
    displayName: 'Zone pattern Id',
    fieldName: fieldNames.zonePatternId
  },
  {
    displayName: 'Calendar code',
    fieldName: fieldNames.calendarCode
  },
  {
    displayName: 'TAKT Multiplier',
    fieldName: fieldNames.taktMultiplier,

  },
  {
    displayName: 'Shop order',
    fieldName: fieldNames.shopOrder
  },
  // {
  //   displayName: 'Linked zones',
  //   fieldName: fieldNames.linkedZones
  // },
  {
    displayName: 'Active',
    fieldName: fieldNames.active,
    type: FieldType.Boolean
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
