import { FieldCollection, FieldType } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Name',
    fieldName: fieldNames.seriesMapName,
    isDescriptor: true,
    editable: false
  },
  {
    displayName: 'Car series',
    fieldName: fieldNames.carSeriesCode,
    editable: false,
    foreignKey: true
  },
  {
    displayName: 'Active',
    fieldName: fieldNames.active,
    type: FieldType.Boolean
  },
  {
    displayName: 'Line Map',
    fieldName: fieldNames.lineMapId,
    autoPrimaryKey: true,
    editable: false
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
