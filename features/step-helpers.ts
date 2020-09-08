import { browser, by, element, protractor } from 'protractor'
import { expect } from 'chai'

export const assertTagDisplayed = (tagName: string) =>
  async function () {
    const el = element(by.tagName(tagName))
    await el.isPresent()
    const isDisplayed = await el.isDisplayed()
    expect(isDisplayed).to.equal(true)
  }