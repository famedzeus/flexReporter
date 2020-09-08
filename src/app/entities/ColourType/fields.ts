import { FieldCollection } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [{
  fieldName: fieldNames.colourTypeCode,
  displayName: 'Colour Type Code',
  editable: false
}, {
  fieldName: fieldNames.name,
  displayName: 'Colour Type Name',
  isDescriptor: true
}]

export default {
  constraints,
  fields,
  fieldNames
}
