import { expect } from 'chai'
import { AttributeFeaturesComponent } from '../attributeFeatures.page'
import spec from '../../../../src/app/entities/AttributeFeature/fields'
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

  this.Given(/^that I navigate to a url that should map to attribute features$/, () => {
    GenericSteps.component = new AttributeFeaturesComponent()
    GenericSteps.validInputData = validInputData
    GenericSteps.inputData = inputData
    GenericSteps.fields = fields
    GenericSteps.filterFieldName = fieldNames.featureCode
    GenericSteps.inputDataModify = inputDataModify
    return GenericSteps.component.navigate()
  })
}