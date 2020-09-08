import { browser, by, element, protractor } from 'protractor'
import { promise as wdPromise } from 'selenium-webdriver'

export class SchedulingPage {
  constructor() {
    browser.ignoreSynchronization = true
  }

  navigate() {
    return browser.get('#/scheduling')
  }
}
