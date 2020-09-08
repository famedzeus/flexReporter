import { browser, element, by, ElementFinder, ElementArrayFinder } from 'protractor'
import { scheduleScope } from '../stepDefinitions/config'
import { GenericEntityCrud } from '../../generic-crud.page'
import { FormComponent } from '../../form.component'
import { DeleteConfirmationComponent } from '../../delete-confirmation.component'
const COMPONENT_SELECTOR = 'c-features'

export class FeaturesComponent extends GenericEntityCrud {

  private elementContainer: ElementFinder
  formComponent: FormComponent
  deleteConfirmationComponent: DeleteConfirmationComponent
  genericCRUD: GenericEntityCrud

  constructor() {
    super(COMPONENT_SELECTOR)
    this.formComponent = new FormComponent('edit-generic')
    this.deleteConfirmationComponent = new DeleteConfirmationComponent()
  }

  initialiseElements() {
    this.elementContainer = element(by.css(COMPONENT_SELECTOR))
  }

  async navigate() {
    await browser.get(`#/scheduling/schedules/${scheduleScope.scheduleScopeName}/attributes`)
    this.initialiseElements()
    super.initialiseElements()
  }

  isComponentDisplayed() {
    return this.elementContainer.isDisplayed()
  }

  enterFilterValue(fieldName: string, value: string) {
    return this.filter.enterFilterValue(fieldName, value)
  }

}