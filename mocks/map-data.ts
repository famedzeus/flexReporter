import { FieldCollection, FieldType } from '../src/app/entities'
const fs = require('fs')
const parseIntTypes: Array<FieldType> = ['number', 'date', 'date-shift']
const transformData = (type, value) => {
  switch (type) {
    case 'number': return parseInt(value, 10)
    case 'date-shift': return parseInt(value, 10)
    case 'date': return value
    case 'boolean': {
      if (value === 'y' || value === 'Y' || value === '!') {
        return true
      }
      return false
    }
    default: return value
  }
}
const isParseIntType = (type: FieldType) => parseIntTypes.some(t => t === type)
export default (filePath: string, fieldFormats: FieldCollection, limit = 100000): Array<any> => {
  // Load test data text file
  const fileId = fs.openSync(filePath, 'r')
  const fileLines = fs
    .readFileSync(fileId, {
      encoding: 'utf8'
    })
    // split into lines and remove bumf
    .split('\n')
    .map(line => line.replace('\r', ''))

  fs.closeSync(fileId)

  // convert lines into data objects
  return fileLines
    .slice(2, fileLines.length > limit ? limit : fileLines.length)
    // data row is | delimeted
    .map(line => line.split('|'))
    // Remove lines which don't match field count
    .filter(line => line.length === fieldFormats.length)
    .map(line =>
      // Convert array of fields to field objects
      fieldFormats.reduce((acc, field, index) =>
        Object.assign(acc, {
          [field.fieldName]: transformData(field.type, line[index])
        }), {})
    )
}