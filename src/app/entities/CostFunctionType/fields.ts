import { FieldCollection } from '../entity.types'
import * as fieldNames from './constants'

const fields: FieldCollection = [{
  fieldName: fieldNames.name,
  displayName: 'Cost Function Name',
  isDescriptor: true
}, {
  fieldName: fieldNames.code,
  displayName: 'Cost Function Code',
  editable: false
}]

export default {
  constraints: {},
  fields,
  fieldNames
}
