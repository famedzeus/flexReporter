import { FieldCollection, FieldType } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [{
  displayName: 'Penalty Name',
  fieldName: fieldNames.penaltyFunctionName,
  isDescriptor: true
}, {
  displayName: 'Cost Function Type',
  fieldName: fieldNames.costFunctionTypeCode
}, {
  displayName: 'Cost Function Param',
  fieldName: fieldNames.costFunctionParameter,
  type: FieldType.Number
}]

export default {
  constraints,
  fields,
  fieldNames
}
