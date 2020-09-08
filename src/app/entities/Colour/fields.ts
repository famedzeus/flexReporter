import { FieldCollection } from '../entity.types'
import * as fieldNames from './constants'
import { constraints } from './constraints'

const fields: FieldCollection = [{
  fieldName: fieldNames.colourCode,
  displayName: 'Colour Code',
  editable: false,
  isDescriptor: true
}, {
  fieldName: fieldNames.colourTypeCode,
  displayName: 'Colour Type',
  editable: false
}, {
  fieldName: fieldNames.description,
  displayName: 'Description'
}]

export default {
  constraints,
  fields,
  fieldNames
}
