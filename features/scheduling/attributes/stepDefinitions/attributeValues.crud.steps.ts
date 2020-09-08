import { expect } from 'chai'
import { attribute } from '../../stepDefinitions/config'
import { AttributesComponent } from '../attributes.page'
import { AttributeValuesComponent } from '../attributeValues.page'
import spec from '../../../../src/app/entities/AttributeValue/fields'
const GenericSteps = require('../../../stepDefinitions/generic.steps')

const { fieldNames, fields } = spec
const inputData = {
  [fieldNames.attributeValue]: ''
}

const validInputData = {
  [fieldNames.attributeValue]: 'vAt' + (new Date()).getTime().toString()
}

const inputDataModify = {}

module.exports = function() {
  const attributes = new AttributesComponent()

  this.Given(/^that I navigate to a url that should map to attribute values$/, () => {
    GenericSteps.component = new AttributeValuesComponent()
    GenericSteps.validInputData = validInputData
    GenericSteps.inputData = inputData
    GenericSteps.fields = fields
    GenericSteps.filterFieldName = fieldNames.attributeValue
    GenericSteps.inputDataModify = inputDataModify
    return GenericSteps.component.navigate()
  })

  this.Given(/^that I have selected an attribute$/, async () => {
    attributes.initAll()

    await attributes.selectItem(fieldNames.attributeName, attribute.attributeName)
  })
}