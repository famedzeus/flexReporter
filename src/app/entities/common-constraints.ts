import { merge } from 'lodash'
import { IConstraint } from './entity.types'
const validate = require('validate.js')
const { validators } = validate

// NOTE: Not sure if the config of validate should occur here
validators.readOnly = () => null
validators.presence.message = 'validation_not_present'

export const combine = (...args: Array<IConstraint>): Object => merge({}, ...args)

export const isReadOnly: IConstraint = {
  readOnly: true
}
export const isPresent: IConstraint = {
  presence: true
}
export const isPresentDatetime = combine(isPresent, { datetime: true })
export const isString = (maximum: number): IConstraint => ({
  length: {
    maximum,
    tooLong: 'validation_too_long::%{count}'
  }
})

export const isStringMin = (minimum: number): IConstraint => ({
  length: {
    minimum,
    tooShort: 'validation_too_short::%{count}'
  }
})

export const isPresentString =
  (maximum: number): IConstraint => combine(isString(maximum), isPresent)

export const isInteger: IConstraint = {
  numericality: {
    onlyInteger: true,
    notInteger: 'validation_not_integer'
  }
}
export const isPresentInteger: IConstraint = {
  numericality: {
    onlyInteger: true,
    notInteger: 'validation_not_present_integer'
  },
  presence: true
}
export const isInRange = (greaterThanOrEqualTo: number, lessThanOrEqualTo: number): IConstraint => ({
  numericality: {
    lessThanOrEqualTo,
    greaterThanOrEqualTo,
    notGreaterThanOrEqualTo: 'validation_not_gtet::%{count}',
    notLessThanOrEqualTo: 'validation_not_ltet::%{count}'
  }
})

export const isBoolean: IConstraint = {
  inclusion: [true, false],
  presence: true
}
export const isIncluded = (within: [string]): IConstraint => ({
  inclusion: {
    within
  },
  presence: true
})
