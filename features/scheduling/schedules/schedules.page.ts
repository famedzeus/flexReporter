import { browser, by, element,
  protractor, ElementArrayFinder, ElementFinder } from 'protractor'
import { promise as wdPromise } from 'selenium-webdriver'

const addedScheduleScopes = []

export class SchedulesPage {
  private schedules: ElementFinder
  private newScheduleButton :ElementFinder
  private scheduleComponents: ElementArrayFinder
  private scheduleTitles: ElementArrayFinder

  initialiseElements() {
    browser.ignoreSynchronization = true
    this.schedules = element(by.tagName('c-schedules'))
    this.newScheduleButton = this.schedules.element(by.css('md-toolbar button[md-button]'))
    this.scheduleTitles = this.schedules.all(by.css('c-schedule md-card-title > span'))
    this.scheduleComponents = this.schedules.all(by.css('c-schedule'))
  }

  async navigate() {
    await browser.get('#/scheduling')
    this.initialiseElements()
  }

  async clickNewSchedule() {
    return this.newScheduleButton.click()
  }

  findSchedules(scheduleScopeName): ElementArrayFinder {
    const schedules = this.scheduleComponents.filter((schedule) => {
      const element = schedule.element(by.css('md-card-title > span'))
      return element.getText().then(text => {
        return text === scheduleScopeName
      })
    })

    return schedules
  }

  async scheduleScopeExists(scheduleScopeName) {
    const schedules = this.findSchedules(scheduleScopeName)
    const count = await schedules.count()
    const text = await schedules.getText()

    if (count > 0) {
      addedScheduleScopes.push(scheduleScopeName)
    }

    return count > 0
  }

  get existingScheduleScopeName() {
    return addedScheduleScopes[addedScheduleScopes.length - 1]
  }

  async clickDeleteSchedule(scheduleScopeName) {
    const schedules = this.findSchedules(scheduleScopeName)
    const deleteButton = schedules.all(by.css('button[color="warn"]')).first()

    return deleteButton.click()
  }

  clickEditSchedule(scheduleScopeName) {
    const schedules = this.findSchedules(scheduleScopeName)
    const editButton = schedules.all(by.css('md-card-title button')).first()

    return editButton.click()
  }
}
