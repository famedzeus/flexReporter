import * as fieldNames from './constants'
import { constraints } from './constraints'
import appConfig from 'app-config'
import { FieldCollection } from '../entity.types'

const languageOptions = Object.keys(appConfig.languages).map(key => {
  const lang = appConfig.languages[key]
  return {
    description: lang.name,
    value: lang.code
  }
})

const fields: FieldCollection = [{
  fieldName: fieldNames.emailAddress,
  displayName: 'Email',
  editable: false
}, {
  fieldName: fieldNames.language,
  displayName: 'Language',
  options: languageOptions
}, {
  fieldName: fieldNames.userId,
  displayName: 'Id',
  isDescriptor: true,
  editable: false
}, {
  fieldName: fieldNames.userName,
  displayName: 'Name',
  editable: false
}]

export default {
  constraints,
  fields,
  fieldNames
}
