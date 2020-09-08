import { expect } from 'chai'
import { AttributesComponent} from '../attributes.page'
import spec from '../../../../src/app/entities/Attribute/fields'
const GenericSteps = require('../../../stepDefinitions/generic.steps')

const { fieldNames, fields } = spec
const inputData = {
  [fieldNames.attributeName]: ''
}

const validInputData = {
  [fieldNames.attributeName]: 'vattr' + (new Date()).getTime().toString()
}

const inputDataModify = {}

module.exports = function() {

  this.Given(/^that I navigate to a url that should map to attributes$/, () => {
    GenericSteps.component = new AttributesComponent()
    GenericSteps.validInputData = validInputData
    GenericSteps.inputData = inputData
    GenericSteps.fields = fields
    GenericSteps.filterFieldName = fieldNames.attributeName
    GenericSteps.inputDataModify = inputDataModify
    return GenericSteps.component.navigate()
  })
}