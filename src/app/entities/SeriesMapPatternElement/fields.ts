import { FieldCollection, FieldType } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Pattern',
    fieldName: fieldNames.patternName,
    editable: false,
    isDescriptor: true,
    autoPrimaryKey: true
  },
  {
    displayName: 'Sequence',
    fieldName: fieldNames.sequence,
    type: FieldType.Number,
    isDescriptor: true,
    editable: false
  },
  {
    displayName: 'Series Map',
    fieldName: fieldNames.seriesMapName,
    isDescriptor: true,
    iconClass: 'fa fa-map-signs',
    inlineEditingEnabled: false
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
