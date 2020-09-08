import { FieldCollection, FieldType } from '../entity.types'
import { constraints } from './constraints'
import * as fieldNames from './constants'

const fields: FieldCollection = [
  {
    displayName: 'Series Map name',
    fieldName: fieldNames.seriesMapName,
    foreignKey: true,
    primaryKey: true,
    isDescriptor: true,
    editable: false
  },
  {
    displayName: 'Zone code',
    isDescriptor: true,
    fieldName: fieldNames.zoneCode,
    foreignKey: true,
    minimumWidth: 70,
    width: 70
  },
  {
    displayName: 'Actual Zone',
    fieldName: fieldNames.actualZoneCode,
    minimumWidth: 80,
    width: 80
  },
  {
    displayName: 'Position',
    isDescriptor: true,
    fieldName: fieldNames.position,
    type: FieldType.Number,
    primaryKey: true,
    editable: false,
    minimumWidth: 80,
    width: 80
  },
  {
    displayName: 'Pull forward by',
    fieldName: fieldNames.pullForwardBy,
    type: FieldType.Number,
    minimumWidth: 140,
    width: 140,
    inlineEditingEnabled: true
  },
  {
    displayName: 'Additional seconds',
    fieldName: fieldNames.additionalSeconds,
    type: FieldType.Number,
    minimumWidth: 140,
    width: 140,
    inlineEditingEnabled: true
  },
  {
    displayName: 'Ignore pattern',
    fieldName: fieldNames.ignorePattern,
    type: FieldType.Boolean,
    inlineEditingEnabled: true,
    minimumWidth: 120,
    width: 120,
    fieldHintLocale: 'series_map_zone_ignore_pattern_hint'
  },
  {
    displayName: 'Minimum spacing',
    fieldName: fieldNames.minimumSpacing,
    type: FieldType.Number,
    minimumWidth: 120,
    width: 120,
    inlineEditingEnabled: true
  }
]

export default {
  constraints,
  fields,
  fieldNames
}
