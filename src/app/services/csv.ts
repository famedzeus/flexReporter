import { Injectable } from '@angular/core'
import { unparse } from 'papaparse'
import { FieldCollection } from 'entities'

const EXTENSION = '.csv'
/**
 * Parses an array of objects into a CSV string.  Objects should be flat.
 */
export const collectionToCSV = (
  collection: Array<any>,
  fieldList: FieldCollection
) => {
  const fields = fieldList.map(field => field.displayName)

  return unparse({
    fields,
    data: collection.map(item => fieldList.map(field => item[field.fieldName]))
  })
}

export const exportBlob = (blob: Blob, fileName = 'filename') => {
  if (window.navigator.msSaveOrOpenBlob) { // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
    window.navigator.msSaveBlob(blob, fileName)
  } else {
    const a = window.document.createElement('a')
    a.href = window.URL.createObjectURL(blob, {type: 'text/plain'} as any)
    a.download = fileName
    document.body.appendChild(a)
    a.click()  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
    document.body.removeChild(a)
  }
}

/**
 * Exports a CSV file either via adding a link and clicking it or msSaveBlob available in IE
 */
export const exportCSV = (csvString, fileName = 'filename') => {
  const blob = new Blob([csvString])
  const fullFileName = `${fileName}${EXTENSION}`
  exportBlob(blob, fullFileName)
}

@Injectable()
export class CSVService {
  collectionToCSV = collectionToCSV
  exportCSV = exportCSV
}
