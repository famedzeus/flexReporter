import { FieldCollection, FieldType } from '../entity.types'
import * as fieldNames from './constants'
import { constraints } from './constraints'

const fields: FieldCollection = [{
  fieldName: fieldNames.id,
  displayName: 'Line Map Id',
  autoPrimaryKey: true,
  editable: false
}, {
  fieldName: fieldNames.adoptShift,
  displayName: 'Adopt Shift',
  type: FieldType.DateShift
}, {
  fieldName: fieldNames.abolishShift,
  displayName: 'Abolish Shift',
  type: FieldType.DateShift
}, {
  fieldName: fieldNames.description,
  displayName: 'Description',
  isDescriptor: true
}, {
  fieldName: fieldNames.mapPurpose,
  displayName: 'Purpose',
  options: [{
    value: 'MODELLING',
    description: 'Modelling'
  }, {
    value: 'PRODUCTION',
    description: 'Production'
  }]
}]

export default {
  constraints,
  fieldNames,
  fields
}
