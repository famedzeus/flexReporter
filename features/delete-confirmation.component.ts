import { browser, by, element, protractor, ElementFinder } from 'protractor'
import { promise as wdPromise } from 'selenium-webdriver'

export class DeleteConfirmationComponent {
  private formComponent: ElementFinder
  private formActions: ElementFinder
  private commitButton: ElementFinder
  private cancelButton: ElementFinder
  private inputs: Array<{
    name: string,
    input: ElementFinder
  }> = []

  /**
   * Create ElementFinder references for form container components
   */
  initialiseElements() {
    this.formComponent = element(by.css('delete-confirmation'))
    this.formActions = this.formComponent.element(by.css('md-dialog-actions'))
    this.commitButton = this.formActions.element(by.css('button[color="warn"]'))
    this.cancelButton = this.formActions.element(by.css('button[color="accent"]'))
  }

  async isCommitButtonDisabled() {
    return !(await this.commitButton.isEnabled())
  }

  isDisplayed() {
    return this.formComponent.isDisplayed()
  }

  clickCommitButton() {
    return this.commitButton.click()
  }

  clickCancelButton() {
    return this.cancelButton.click()
  }

}
