import { FieldCollection } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Volume',
    fieldName: fieldNames.volume
  },
  {
    displayName: 'Series map',
    fieldName: fieldNames.seriesMapName
  },
  {
    displayName: 'Schedule sequence',
    fieldName: fieldNames.scheduleSequence
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
