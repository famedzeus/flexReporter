import { FieldCollection, FieldType } from '../entity.types'
import * as fieldNames from './constants'
import { constraints } from './constraints'

const fields: FieldCollection = [{
  fieldName: fieldNames.carSeries,
  displayName: 'Car Series',
  editable: false
}, {
  fieldName: fieldNames.colourCode,
  displayName: 'Colour Code',
  editable: false
}, {
  fieldName: fieldNames.colourGroupCode,
  displayName: 'Colour Group'
}, {
  fieldName: fieldNames.colourPaintSeq,
  displayName: 'Paint Sequence',
  type: FieldType.Number
}, {
  fieldName: fieldNames.colourTypeCode,
  displayName: 'Colour Type',
  editable: false
}]

export default {
  constraints,
  fields,
  fieldNames
}
