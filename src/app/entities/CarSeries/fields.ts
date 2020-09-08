import { FieldCollection, FieldType } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Series code',
    fieldName: fieldNames.carSeriesCode,
    editable: false
  },{
    displayName: 'Description',
    fieldName: fieldNames.description,
    isDescriptor: true
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
