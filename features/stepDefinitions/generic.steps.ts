import { expect } from 'chai'
declare var module
class GenericSteps {
  Then
  Given
  When
  static component
  static validInputData
  static inputData
  static fields
  static filterFieldName
  static inputDataModify
  constructor() {

    this.Then(/^I should see the (.*) list$/, (arg) => GenericSteps.component.isComponentDisplayed())

    /**
     * Create
     */

    const assertComponentDisplayed = async (arg) => {
      GenericSteps.component.formComponent.initialiseElements()
      const isDisplayed = await GenericSteps.component.formComponent.isDisplayed()
      expect(isDisplayed).to.be.true
    }
    this.Given(/^that I am on the (.*) page$/, (arg) => GenericSteps.component.navigate())
    this.When(/^I click the add button$/, () => GenericSteps.component.clickCreateButton())
    this.Then(/^I should see the create (.*) form$/, assertComponentDisplayed)

    this.Then(/^I can see the record in the list$/, async () => {
      const item = !!await GenericSteps.component.findListItem(
        GenericSteps.filterFieldName,
        GenericSteps.validInputData[GenericSteps.filterFieldName]
      )

      expect(item).to.be.true
    })

    this.Then(/^I can not see the record in the list$/, async () => {
      const item = !!await GenericSteps.component.findListItem(
        GenericSteps.filterFieldName,
        GenericSteps.validInputData[GenericSteps.filterFieldName]
      )

      expect(item).to.be.false
    })


    this.Given(/^I can see the create (.*) form$/, assertComponentDisplayed)
    this.When(/^I enter valid (.*) values$/,
      (arg) => GenericSteps.component.formComponent.enterFieldData(GenericSteps.inputData))
    this.Then(/^I am not able to save$/, async () => {
      const isButtonDisabled = await GenericSteps.component.formComponent.isCommitButtonDisabled()
      expect(isButtonDisabled).to.be.true
    })

    this.Given(/^that I have entered all required fields$/, () =>
      GenericSteps.component.formComponent.enterFieldData(GenericSteps.validInputData))

    this.When(/^I click cancel button$/, () =>
      GenericSteps.component.formComponent.clickCancelButton()
    )

    const getRowCount = async () => {
      await GenericSteps.component.enterFilterValue(
        GenericSteps.filterFieldName, GenericSteps.validInputData[GenericSteps.filterFieldName])
      return GenericSteps.component.currentPageItems()
    }

    this.Then(/^it should not persist changes$/, async () => {
      const matchingRows = await getRowCount()
      expect(matchingRows).to.equal(0)
    })
    let expectedResource
    this.When(/^I click save resource button$/, () => {
      expectedResource = GenericSteps.component.formComponent.formValues
      GenericSteps.component.formComponent.clickCommitButton()
    })

    const assertResourceExists = async () => {
      const matchingRows = await getRowCount()
      expect(matchingRows).to.equal(1)
    }

    const assertResourceNotExists = async () => {
      const matchingRows = await getRowCount()
      expect(matchingRows).to.equal(0)
    }

    this.Then(/^it should create the new resource$/, assertResourceExists)
    this.Given(/^that the resource exists$/, assertResourceExists)
    this.When(/^I click the edit button for the resource$/, () => GenericSteps.component.clickEditButton())
    this.Then(/^I should see the (.*) edit form$/, assertComponentDisplayed)
    this.Then(/^all primary key fields should be disabled$/, async () => {
      const disabledFieldNames = GenericSteps.fields
        .filter(field => field.editable === false)
        .map(field => field.fieldName)

      const isFieldsDisabled = await GenericSteps.component.formComponent.checkInputsDisabled(disabledFieldNames)
      expect(isFieldsDisabled).to.be.true
    })

    this.Given(/^that I have edited the resource$/, () =>
      GenericSteps.component.formComponent.enterFieldData(
        GenericSteps.inputDataModify
      )
    )

    this.Then(/^it should save the resource$/, async () => {
      await GenericSteps.component.enterFilterValue(
        GenericSteps.filterFieldName, GenericSteps.validInputData[GenericSteps.filterFieldName])
      await GenericSteps.component.clickEditButton()
      const isResourceUpdated = await GenericSteps.component.formComponent.checkInputsMatch(expectedResource)
      expect(isResourceUpdated).to.be.true
    })

    this.When(/^I click the delete button for the resource$/,  () =>
      GenericSteps.component.clickDeleteButton())

    this.Then(/^I can see the confirmation dialog$/, async () => {
      GenericSteps.component.deleteConfirmationComponent.initialiseElements()
      const isDeleteDisplayed = await GenericSteps.component.deleteConfirmationComponent.isDisplayed()
      expect(isDeleteDisplayed).to.be.true
    })

    this.When(/^I click the cancel delete button$/,
      () => GenericSteps.component.deleteConfirmationComponent.clickCancelButton())

    this.Then(/^The delete operation should not be invoked$/, () => assertResourceExists)

    this.When(/^I click the confirm delete button$/,
    () => GenericSteps.component.deleteConfirmationComponent.clickCommitButton())
    this.Given(/^that I have clicked the delete button for the resource$/, () => GenericSteps.component.clickDeleteButton())

    this.Then(/^The resource should no longer exist$/, assertResourceNotExists)
  }
}

module.exports = GenericSteps