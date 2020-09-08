import { FieldCollection, FieldType } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [{
  fieldName: fieldNames.scheduleScopeName,
  editable: false,
  displayName: 'Schedule Scope'
}, {
  displayName: 'Rule Id',
  fieldName: fieldNames.ruleId,
  editable: false,
  type: FieldType.Number,
  isDescriptor: true
}, {
  displayName: 'Rule Description',
  fieldName: fieldNames.ruleDescription,
  maximumWidth: 200,
  minimumWidth: 150
}, {
  displayName: 'Display Position',
  fieldName: fieldNames.displayPosition,
  type: FieldType.Number
},
{
  displayName: 'Rule Type',
  maximumWidth: 200,
  minimumWidth: 150,
  fieldName: fieldNames.ruleType
},
{
  displayName: 'Zone',
  maximumWidth: 70,
  fieldName: fieldNames.zoneCode
},
{
  displayName: 'Param 1',
  fieldName: fieldNames.parameter1,
  type: FieldType.Number
},
{
  displayName: 'Param 2',
  fieldName: fieldNames.parameter2,
  type: FieldType.Number
},
{
  displayName: 'Range',
  fieldName: fieldNames.range,
  type: FieldType.Number
},
{
  displayName: 'Pattern',
  fieldName: fieldNames.pattern
},
{
  displayName: 'Penalty Function',
  fieldName: fieldNames.penaltyFunctionName
},
{
  displayName: 'Priority',
  fieldName: fieldNames.priority,
  maximumWidth: 85,
  minimumWidth: 85,
  inlineEditingEnabled: true,
  type: FieldType.Number
},
{
  displayName: 'Rule Active',
  fieldName: fieldNames.active,
  maximumWidth: 115,
  minimumWidth: 80,
  inlineEditingEnabled: true,
  type: FieldType.Boolean
}]

export default {
  fieldNames,
  fields,
  constraints
}
