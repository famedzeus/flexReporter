import { FieldCollection } from '../entity.types'
import * as fieldNames from './constants'
import { constraints } from './constraints'

const fields: FieldCollection = [{
  fieldName: fieldNames.value,
  displayName: ''
}, {
  fieldName: fieldNames.parameter,
  displayName: ''
}, {
  fieldName: fieldNames.parameterType,
  displayName: ''
}, {
  fieldName: fieldNames.userId,
  displayName: ''
}]
export default {
  constraints,
  fields,
  fieldNames
}
