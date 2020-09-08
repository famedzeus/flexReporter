import { FieldCollection, FieldType } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Calendar code',
    fieldName: fieldNames.calendarCode,
    isDescriptor: true,
    editable: false
  },
  {
    displayName: 'Shop Id',
    fieldName: fieldNames.shopId,
    editable: false,
    foreignKey: true,
    type: FieldType.Number
  },
  {
    displayName: 'Line Id',
    fieldName: fieldNames.lineId,
    editable: false,
    foreignKey: true,
    type: FieldType.Number
  },
  {
    displayName: 'Build order',
    fieldName: fieldNames.buildOrder,
    type: FieldType.Number
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
