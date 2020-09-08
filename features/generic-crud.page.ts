import { element, by, ElementFinder, ElementArrayFinder } from 'protractor'

export class FilterComponent {
  private container: ElementFinder
  private filterFields: ElementArrayFinder

  constructor(
    private parentElement: string = ''
  ) {}

  initialiseElements() {
    this.container = element(by.css(`${this.parentElement} filter-form`))
  }

  setFields(fieldNames: Array<string>) {
    const selector = fieldNames.map(fieldName =>
      `input[name="${fieldName}"],
      md-select[ng-reflect-name="${fieldName}"]`).join(', ')
  }

  enterFilterValue(fieldName: string, value: string) {
    const selector = `input[name="${fieldName}"],
      md-select[ng-reflect-name="${fieldName}"]`
    const el = this.container.element(by.css(selector))
    el.clear()
    return el.sendKeys(value)
  }
}

export class GenericEntityCrud {
  private readonly LIST_COMPONENT_NAME = 'filtered-table'
  private dataContainer: ElementFinder
  private createButton: ElementFinder
  private itemList: ElementFinder
  fieldList: ElementArrayFinder
  private _filter: FilterComponent
  constructor(
    private parentElement: string = ''
  ) {}

  initialiseElements() {
    this.dataContainer = element(by.css(`${this.parentElement} ${this.LIST_COMPONENT_NAME}`))
    this.createButton = this.dataContainer.element(by.css('tfoot button[md-mini-fab]'))
    this.itemList = this.dataContainer.element(by.css('tbody'))
    this.fieldList = this.dataContainer.all(by.css('thead tr:first-child th'))

    this._filter = new FilterComponent(this.LIST_COMPONENT_NAME)
    this._filter.initialiseElements()
  }

  get filter(): FilterComponent {
    return this._filter
  }

  clickCreateButton() {
    return this.createButton.click()
  }

  currentPageItems() {
    return this.itemList.all(by.css('tr')).count()
  }

  clickDeleteButton() {
    return this.itemList.element(by.css('.fa-trash-o')).click()
  }

  clickEditButton() {
    return this.itemList.element(by.css('.fa-pencil')).click()
  }

  /**
   * Finds fieldValue with matching value and returns the corresponding resource container (eg a table row)
   * @param fieldName Name of field
   * @param fieldValue Value expected to be displayed for field
   */
  async findListItem(fieldName: string, fieldValue: string) {
    const fieldIndex = await this.fieldIndex(fieldName)

    if (fieldIndex === null) return null

    const allValues = this.itemList.all(by.css(`tr td:nth-child(${fieldIndex + 1})`))
    const matchedRows: Array<ElementFinder> = await allValues.reduce(async (acc, el, index) => {
      const txt = await el.getText()
      const isMatch = !!txt.match(new RegExp(fieldValue, 'ig'))
      return isMatch ? acc.concat(this.itemList.element(by.css(`tr:nth-child(${index + 1})`))) : acc
    }, [])

    return matchedRows.length > 0 ? matchedRows[0] : null
  }

  async selectItem(fieldName: string, fieldValue: string) {
    const item = await this.findListItem(fieldName, fieldValue)

    const hasClass = (await item.getAttribute('class')).match(/selected/ig)

    if (!hasClass) {
      return item.click()
    }
  }

  async fieldIndex(fieldName: string) {
    const fieldColumn = this.fieldList.reduce(async (acc, th: ElementFinder, index) => {
      if (acc === null) {
        const reg = new RegExp(fieldName)
        const classMatch = (await th.getAttribute('class')).match(reg)
        return classMatch ? index : null
      }

      return acc
    }, null)

    return fieldColumn
  }
}