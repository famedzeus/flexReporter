import { FieldCollection, FieldType } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Calendar code',
    fieldName: fieldNames.calendarCode,
    minimumWidth: 130,
    maximumWidth: 130
  },
  {
    displayName: 'Shift',
    fieldName: fieldNames.shiftCode,
    type: FieldType.DateShift,
    minimumWidth: 190,
    maximumWidth: 190,
    pinned: 'left'
  },
  {
    displayName: 'Week',
    fieldName: fieldNames.weekCode,
    maximumWidth: 130,
    minimumWidth: 100
  },
  {
    displayName: 'Shift start',
    fieldName: fieldNames.startDateTime,
    type: FieldType.DateTime,
    minimumWidth: 170,
    maximumWidth: 190
  },
  {
    displayName: 'Shift end',
    fieldName: fieldNames.endDateTime,
    type: FieldType.DateTime,
    minimumWidth: 170,
    maximumWidth: 190
  },
  {
    displayName: 'Total seconds',
    fieldName: fieldNames.totalSeconds,
    type: FieldType.Number,
    maximumWidth: 120,
    minimumWidth: 120
  },
  {
    displayName: 'Volume',
    fieldName: fieldNames.volume,
    type: FieldType.Number,
    inlineEditingEnabled: true,
    maximumWidth: 90,
    minimumWidth: 90
  },
  {
    displayName: 'Description',
    fieldName: fieldNames.description
  },
  {
    displayName: 'Shop Id',
    fieldName: fieldNames.shopId
  },
  {
    displayName: 'Line',
    fieldName: fieldNames.lineId
  },
  {
    displayName: 'Line order',
    fieldName: fieldNames.displayOrder
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
