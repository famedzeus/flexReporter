import { FieldCollection, FieldType } from '../entity.types'
import * as fieldNames from './constants'
import { constraints } from './constraints'

const fields: FieldCollection = [{
  fieldName: fieldNames.lineMapId,
  displayName: 'Line Map'
}, {
  fieldName: fieldNames.zoneCode,
  displayName: 'Zone',
  isDescriptor: true
}, {
  fieldName: fieldNames.xAxis,
  displayName: 'X Position',
  type: FieldType.Number
}, {
  fieldName: fieldNames.yAxis,
  displayName: 'Y Position',
  type: FieldType.Number
}, {
  fieldName: fieldNames.entryAchievmentPoint,
  displayName: 'Entry Achievment Point'
}, {
  fieldName: fieldNames.exitAchievementPoint,
  displayName: 'Exit Achievment Point'
}, {
  fieldName: fieldNames.zoneException,
  displayName: 'Zone Exception',
  options: fieldNames.zoneExceptionOptions,
  defaultOption: fieldNames.zoneExceptionOptions[0]
}]

export default {
  constraints,
  fields,
  fieldNames
}
