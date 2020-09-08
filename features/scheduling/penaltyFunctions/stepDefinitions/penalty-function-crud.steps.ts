import { expect } from 'chai'
import { PenaltyFunctionsComponent } from '../penalty-functions.page'
import spec from '../../../../src/app/entities/PenaltyFunction/fields'
const GenericSteps = require('../../../stepDefinitions/generic.steps')

const { fieldNames, fields } = spec
const inputData = {
  [fieldNames.penaltyFunctionName]: 'PF' + (new Date()).getTime().toString(),
  [fieldNames.costFunctionParameter]: '2'
}

const validInputData = {
  [fieldNames.penaltyFunctionName]: 'PF' + (new Date()).getTime().toString(),
  [fieldNames.costFunctionTypeCode]: 'dynamic-select',
  [fieldNames.costFunctionParameter]: '2'
}

const inputDataModify = {
  [fieldNames.costFunctionParameter]: '11'
}

module.exports = function() {

  this.Given(/^that I navigate to a url that should map to penalty functions$/, () => {
    GenericSteps.component = new PenaltyFunctionsComponent()
    GenericSteps.validInputData = validInputData
    GenericSteps.inputData = inputData
    GenericSteps.fields = fields
    GenericSteps.filterFieldName = fieldNames.penaltyFunctionName
    GenericSteps.inputDataModify = inputDataModify
    return GenericSteps.component.navigate()
  })
}