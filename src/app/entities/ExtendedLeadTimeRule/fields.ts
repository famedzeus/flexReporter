import { FieldCollection, FieldType } from '../entity.types'
import * as fieldNames from './constants'
import constraints from './constraints'

const fields: FieldCollection = []

export default {
  constraints,
  fieldNames,
  fields
}
