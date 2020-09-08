import { browser, by, element, protractor, ElementFinder } from 'protractor'
import { promise as wdPromise } from 'selenium-webdriver'

export class FormComponent {
  private formComponent: ElementFinder
  private formActions: ElementFinder
  private cancelButton: ElementFinder
  private commitButton: ElementFinder
  private currentFormValues = {}
  private inputs: Array<{
    name: string,
    input: ElementFinder
  }> = []

  constructor(
    private containerSelector: string
  ) {}

  /**
   * Create ElementFinder references for form container components
   */
  initialiseElements(): void {
    this.currentFormValues = {}
    this.formComponent = element(by.css(this.containerSelector))
    this.formActions = this.formComponent.element(by.css('md-dialog-actions'))
    this.commitButton = this.formActions.element(by.css('button[color="primary"]'))
    this.cancelButton =  this.formActions.element(by.css('button:not([colour])'))
  }

  isDisplayed() {
    return this.formComponent.isDisplayed()
  }

  getInputSelector(inputType: string, fieldName: string): string {
    switch (inputType) {
      case 'ds': return `c-dateshift-input[ng-reflect-name="${fieldName}"] md-input-container input`
      default: return `input[name="${fieldName}"], md-select[ng-reflect-name="${fieldName}"]`
    }
  }

  get formValues() {
    return this.currentFormValues
  }

  async clickSelectOption(fieldName: string) {
    const selectEl = this.formComponent.element(by.css(`md-select[ng-reflect-name="${fieldName}"]`))
    await selectEl.click()
    const el = element(by.css('md-option'))
    const value = await el.getAttribute('ng-reflect-value')
    await el.click()
    return value
  }

  async enterFieldData(inputData) {
    const fieldNames = Object.keys(inputData)
    // Chain all inputs with a reduce to a final promise
    const finalPromise = fieldNames.reduce(async (previousPromise, fieldName) => {
      await previousPromise
      const value = inputData[fieldName]
      if (value.includes('dynamic-select')) {
        const promise = this.clickSelectOption(fieldName)
        const val = await promise
        this.currentFormValues[fieldName] = val
        return val
      } else {
        this.currentFormValues[fieldName] = value
        return this.enterInputText(fieldName, value)
      }
    }, null)
    return finalPromise
  }

  getInput(fieldName: string, inputType: string): ElementFinder {
    const inputContainer = this.inputs.find((input) => input.name === fieldName)

    if (inputContainer) {
      return inputContainer.input
    } else {
      const selector = this.getInputSelector('input', fieldName)
      const input = this.formComponent.element(by.css(selector))
      this.inputs.push({
        name: fieldName,
        input
      })
      return this.formComponent.element(by.css(
        this.getInputSelector(inputType, fieldName)))
    }
  }

  /**
   * Enters text value in selected form input
   * @async
   */
  async enterInputText(fieldName: string, value: string): Promise<void> {
    const [val, inputType = 'input'] = value.split('::')
    const inputField = this.getInput(fieldName, inputType)
    await inputField.isPresent()
    await inputField.clear()
    await inputField.sendKeys(val)
  }

  /**
   * Checks if all currently accessed inputs are valid
   * @async
   */
  async checkInputsValid(): Promise<boolean> {
    const results = this.inputs.map(async (input) => {
      const classString = await input.input.getAttribute('class')
      return (classString.includes('ng-dirty') || classString.includes('ng-touched')) && classString.includes('ng-valid')
    })

    const vals = await Promise.all(results)

    return vals.every(val => val === true)
  }

  /**
   * Compares the values of a model with the current form inputs
   * @param fields An object with fieldName->fieldValue mapping
   */
  async checkInputsMatch(fields): Promise<boolean> {
    const fieldNames = Object.keys(fields)

    const promises = fieldNames.map(async (fieldName) => {
      const selector = this.getInputSelector('input', fieldName)
      const input = this.formComponent.element(by.css(selector))
      const value = await input.getAttribute('value')

      return value === fields[fieldName]
    })
    const arr = await Promise.all(promises)
    return arr.every(match => match === true)
  }

  async checkInputsDisabled(fieldNames: Array<string>) {
    const promises = fieldNames.map(async (fieldName) => {
      const selector = this.getInputSelector('input', fieldName)
      const field = this.formComponent.element(by.css(selector))

      return await field.isEnabled()
    })
    const fieldsEnabled = await Promise.all(promises)
    return fieldsEnabled.every(val => val === false)
  }

  async isCommitButtonDisabled(): Promise<boolean> {
    return !(await this.commitButton.isEnabled())
  }

  async clickCommitButton(): Promise<void> {
    return this.commitButton.click()
  }

  async clickCancelButton(): Promise<void> {
    return this.cancelButton.click()
  }
}
