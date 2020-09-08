import { SchedulesPage } from '../schedules.page'
import { assertTagDisplayed } from '../../../step-helpers'
import { FormComponent } from '../../../form.component'
import { DeleteConfirmationComponent } from '../../../delete-confirmation.component'
import { expect } from 'chai'
import spec from '../../../../src/app/entities/ScheduleScope/fields'
const { fields } = spec

const data = {
  scheduleScopeName: '',
  scheduleStartPeriod: '20163201',
  scheduleEndPeriod: '20163202',
  offlineStartShift: '2016-09-01::ds', // Date entry
  offlineEndShift: '2016-09-25::ds',
  lineMapVersion: 'dynamic-select'
}

const formattedData = {
  scheduleScopeName: '',
  scheduleStartPeriod: '20163201',
  scheduleEndPeriod: '20163202',
  offlineStartShift: '201609011', // Date shift format
  offlineEndShift: '201609251'
}

let scheduleScopeName: string
module.exports = function() {
  let schedules = new SchedulesPage()
  let formComponent: FormComponent
  let deleteConfirmationComponent = new DeleteConfirmationComponent()

  async function navigate() {
    formComponent = new FormComponent(`edit-generic form`)
    schedules = new SchedulesPage()
    return await schedules.navigate()
  }

  const assertConfirmationDisplayed = async () => {
    deleteConfirmationComponent.initialiseElements()
    const isConfirmationDisplayed = await deleteConfirmationComponent.isDisplayed()
    expect(isConfirmationDisplayed).to.be.true
  }

  const scheduleChecker = (scheduleScopeName, expectedOutcome = true) => async () => {
    const scheduleExists = await schedules.scheduleScopeExists(scheduleScopeName)
    if (expectedOutcome) {
      expect(scheduleExists).to.be.true
    } else {
      expect(scheduleExists).to.be.false
    }
  }

  /**
   * General schedule - step definitions
   */

  this.Given(/^I am on the schedules page$/, navigate)

  this.When(/^I click the new schedule button$/, () => {
    return schedules.clickNewSchedule()
  })

  this.Then(
    /^I should see the schedule creation dialog$/,
    assertTagDisplayed('edit-generic'))

  /**
   * Schedule Creation - step definitions
   */

  this.Given(/^I have clicked the new schedule button/, () => schedules.clickNewSchedule())
  this.Given(/^I haved entered all required fields$/, async () => {
    data.scheduleScopeName = scheduleScopeName = (new Date).getTime().toString()

    formComponent.initialiseElements()
    return formComponent.enterFieldData(data)
  })


  this.When(/^I enter "(.*)" as "(.*)"$/, async (fieldName, value) => {
    formComponent.initialiseElements()
    await formComponent.enterFieldData({ [fieldName]: value })
  })
  this.When(/^I click save$/, () => formComponent.clickCommitButton())

  this.Then(/^I should see indication that the value is valid$/, async () => {
    const allValid = await formComponent.checkInputsValid()
    expect(allValid).to.be.true
  })
  this.Then(/^I can not apply the save button because required fields are missing/, async () => {
    const isDisabled = await formComponent.isCommitButtonDisabled()
    expect(isDisabled).to.be.true
  })
  this.Then(/^I can apply the save button because all required fields are entered$/, async () => {
    const isDisabled = await formComponent.isCommitButtonDisabled()
    expect(isDisabled).to.be.false
  })
  this.Then(/^I should see the new schedule listed in the schedules page$/, () => { return scheduleChecker(scheduleScopeName)() })

  /**
   * Schedule update - step definitions
   */
  const iClickEdit = /^I click the edit schedule button$/
  const clickEdit = () => schedules.clickEditSchedule(scheduleScopeName)
  this.When(iClickEdit, clickEdit)

  this.Then(/^I should see the edit schedule form$/, () => assertTagDisplayed('edit-generic'))
  this.Given(/^I see the edit schedule form$/,  () => assertTagDisplayed('edit-generic'))
  const assertFieldsPopulated = data => async () => {
    formComponent.initialiseElements()
    const nData = Object.assign({}, data, { scheduleScopeName })
    const fieldsMatch = await formComponent.checkInputsMatch(nData)
    expect(fieldsMatch).to.be.true
  }

  const iSeeModel = /^I see all fields populated with current model values$/
  this.Then(iSeeModel, assertFieldsPopulated(formattedData))
  this.Then(/^I should not be able to edit primary fields$/, () => {
    const disabledFieldNames = fields
      .filter(field => field.editable === false)
      .map(field => field.fieldName)

    return formComponent.checkInputsDisabled(disabledFieldNames)
  })

  this.Given(/^I have edited a field$/, () => formComponent.enterInputText('previousSolutionName', '10'))
  this.When(/^I click close button$/, () => formComponent.clickCancelButton())

  this.Then(/^My changes will be lost$/, async () => {
    await schedules.clickEditSchedule(scheduleScopeName)
    formComponent.initialiseElements()
    return assertFieldsPopulated(formattedData)()
  })

  this.Then(/^My changes will be persisted$/, async () => {
    await schedules.clickEditSchedule(scheduleScopeName)
    formComponent.initialiseElements()
    return assertFieldsPopulated(
      Object.assign({}, formattedData, { previousSolutionName: '10' }))()
  })
  /**
   * Schedule deletion - step definitions
   */
  const clickDelete = () => schedules.clickDeleteSchedule(scheduleScopeName)

  this.Given(/^A test generated schedule exists$/, () => {
    schedules.initialiseElements()
    return scheduleChecker(scheduleScopeName)()
  })
  this.Given(/^I click delete schedule^/, clickDelete)
  this.Given(/^I can see the delete confirmation dialog$/, assertConfirmationDisplayed)

  this.When(/^I click delete schedule$/, clickDelete)
  this.When(/^I click cancel$/, () => deleteConfirmationComponent.clickCancelButton())
  this.When(/^I click confirm$/, () => deleteConfirmationComponent.clickCommitButton())

  this.Then(/^I should see a confirmation dialog to confirm my decision$/, assertConfirmationDisplayed)
  this.Then(/^The schedule should be deleted and I should see it removed from the list$/,
    () => { return scheduleChecker(scheduleScopeName, false)() })
}
