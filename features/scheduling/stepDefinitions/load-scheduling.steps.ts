import { SchedulingPage } from '../scheduling.page'
import { assertTagDisplayed } from '../../step-helpers'

module.exports = function() {
  const scheduling = new SchedulingPage()

  async function navigate() {
    return await scheduling.navigate()
  }

  this.setDefaultTimeout(1000 * 20)

  this.Given(/^I enter the scheduling route in the browser$/, navigate)
  this.Then(
    /^I should see the scheduling section$/,
    assertTagDisplayed('c-scheduling'))
  this.Then(
    /^I should see the schedules page/,
    assertTagDisplayed('c-schedules'))
}
