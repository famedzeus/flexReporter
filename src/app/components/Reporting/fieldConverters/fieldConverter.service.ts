import { Inject, Injectable } from '@angular/core'
import { cloneDeep, orderBy, hasIn } from 'lodash'
import { Observable } from 'rxjs'
import * as moment from 'moment'


interface IFieldConverter {
  name: string,
  initFn?: Function,
  convertFn: Function,
  resetFn: Function,
  addFn?: Function,
  deleteFn?: Function,
  clientFilter?: boolean,
  isActive: Function
  description?: string
}

interface segment {
  active: boolean,
  name: string,
  position: number,
  numberOfCharacters: number,
  searchTerm: string
}

/**
 * @description
 * Provides converter functions
 */
@Injectable()
export class FieldConverter {

  private fieldConverters: Array<IFieldConverter>

  constructor(

  ) {
    this.fieldConverters = [
      { name: "default", description: "No converter applied.", convertFn: null, resetFn: (field) => this.resetAll(field), isActive: () => false },
      {
        name: "Enter milliseconds as a date range",
        description: "When you have a date in milliseconds since 1970, use this to enter a normal date range. It will be converted to the correct milliseconds range to filter.",
        convertFn: this.millisecondsToDate,
        resetFn: this.resetMillisecondsToDate,
        isActive: this.activeDate
      },
      {
        name: "Enter shiftcode as a date and shift range",
        description: "Use this to enter a more readable date and shift range that will be converted to a shiftcode range filter.",
        convertFn: this.shiftCodeToShift,
        resetFn: this.resetshiftCodeToShift,
        isActive: this.activeShift
      },
      {
        name: "Enter schedulePeriod as text",
        description: "Schedule periods are in the format YYYYWWDD - use this to enter as text representation.",
        convertFn: this.singleSchedulePeriod,
        resetFn: this.resetSingleSchedulePeriod,
        isActive: this.activeString
      },
      {
        name: "Enter date within a schedulePeriod",
        description: "Schedule periods are in the format YYYYWWDD - use this to enter a normal date that lies within the period to filter.",
        convertFn: this.schedulePeriodToSingleDate,
        resetFn: this.resetSchedulePeriodToSingleDate,
        isActive: this.activeString
      },
      // { name: "schedulePeriod to date range", convertFn: this.schedulePeriodToDate, resetFn: this.resetSchedulePeriodToDate, isActive: this.activeDate },
      // { name: "schedulePeriod to feed range", initFn: (field) => this.initFeed(field), convertFn: (field) => { return this.schedulePeriodToFeed(field) }, resetFn: this.resetFeed, isActive: this.activeFeed },
      {
        name: "Search through text for certain characters", clientFilter: true,
        description: "Use this to find multiple combinations of characters within text. It is particulalry useful for model variants but can be used for any text data.",
        initFn: this.initParser,
        convertFn: this.stringParser,
        resetFn: this.resetParser,
        addFn: this.addSegment,
        deleteFn: this.deleteSegment,
        isActive: this.parserActive
      },
      {
        name: "Delimited text", clientFilter: true,
        description: "Use this to find multiple terms within text that is separated by specific characters.",
        initFn: this.initMultiList,
        convertFn: this.multiListParser,
        resetFn: this.resetMultiList,
        addFn: this.addSearchTerm,
        deleteFn: this.deleteSearchTerm,
        isActive: this.multiListActive
      },
      {
        name: "Zonal entry times", clientFilter: true,
        description: "Use this to do searches through zone entry times. Data should contain a delimited list in format 'zone=entryTime' e.g. A3=2017-12-07T13:23:21,C3=2017-12-07T17:04:24 ",
        initFn: this.initEntryTimes,
        convertFn: this.entryTimesParser,
        resetFn: this.resetEntryTimes,
        addFn: this.addEntryRange,
        deleteFn: this.deleteEntryRange,
        isActive: this.entryTimesActive
      }
    ]



  }

  getConverters() {
    return this.fieldConverters
  }

  getConverter(name) {
    return this.fieldConverters.find(c => c.name === name)
  }

  activeDate(field) {
    return field.fromDate != null && field.toDate != null
  }
  activeShift(field) {
    return field.fromShiftDate != null && field.toShiftDate != null
  }
  activeString(field) {
    return field.string != null && field.string != ''
  }
  activeFeed(field) {
    return field.feedBackDays != null && field.feedForwardDays != null
  }
  activeList(field) {
    return field.string != null && field.string != ''
  }
  initFeed(field) {
    field.useAsFeed = true
  }
  resetAll(field) {
    this.resetFeed(field)
  }
  millisecondsToDate(field) {
    let filter = ''
    if (field.fromDate != null && field.toDate != null) {
      filter += '&filter=' + field.prop + '>=' + new Date(field.fromDate).getTime()
      filter += '&filter=' + field.prop + '<=' + new Date(field.toDate).getTime()
    }
    return filter
  }

  resetMillisecondsToDate(field) {
    field.fromDate = field.toDate = null
  }

  shiftCodeToShift(field) {
    let filter = ''
    if (field.fromShiftDate != null && field.toShiftDate != null && field.fromShiftNumber != null && field.toShiftNumber != null) {
      filter += '&filter=' + field.prop + '>=' + moment(new Date(field.fromShiftDate)).format('YYYYMMDD') + field.fromShiftNumber
      filter += '&filter=' + field.prop + '<=' + moment(new Date(field.toShiftDate)).format('YYYYMMDD') + field.toShiftNumber
    }
    return filter
  }

  schedulePeriodToSingleDate(field) {
    let filter = ''
    if (field.fromDate != null) {
      filter += '&filter=' + field.prop + '==' + moment(new Date(field.fromDate)).format('YYYYWW0E')
    }
    return filter
  }

  singleSchedulePeriod(field) {
    let filter = ''
    if (field.string != null && field.string != '') {
      filter += '&filter=' + field.prop + '==' + field.string

    }
    return filter
  }

  resetSingleSchedulePeriod(field) {
    field.string = null
  }

  toFeed(field, format) {
    let filter = ''
    let today = new Date()
    if (field.feedBackDays != null && field.feedForwardDays != null) {
      let backDateMills = today.getTime() - (field.feedBackDays * 86400000)
      let forwardDateMills = today.getTime() + (field.feedForwardDays * 86400000)
      filter += '&filter=' + field.prop + '>=' + moment(new Date(backDateMills)).format(format)
      filter += '&filter=' + field.prop + '<=' + moment(new Date(forwardDateMills)).format(format)
    }
    return filter
  }

  dateToFeed(field) {
    return this.toFeed(field, 'YYYY-MM-DD')
  }

  resetFeed(field) {
    field.feedBackDays = null
    field.feedForwardDays = null
    field.useAsFeed = false
  }

  schedulePeriodToFeed(field) {
    return this.toFeed(field, 'YYYYWW0E')
  }

  resetSchedulePeriodToFeed(field) {
    field.feedBackDays = null
    field.feedForwardDays = null
  }

  resetSchedulePeriodToSingleDate(field) {
    field.fromDate =
      field.toDate = null
  }

  resetshiftCodeToShift(field) {
    field.fromShiftNumber =
      field.toShiftNumber =
      field.fromShiftDate =
      field.toShiftDate = null
  }

  initParser(field, dataSet?) {
    field.characterParser = []
    // field.characterParser = [{ active: true, name: "RHD", position: 0, numberOfCharacters: 1, searchTerm: 'F' },
    // { active: true, name: "Sunroof", position: 1, numberOfCharacters: 1, searchTerm: 'S' },
    // { active: true, name: "Leaf", position: 7, numberOfCharacters: 4, searchTerm: 'ZE' }]
  }

  stringParser(field, dataSet) {

    // if (field.characterParser) {
    //   if (!field.characterParser.length) {
    //     return []
    //   }
    // }
    let newDataSet = []
    dataSet.forEach(record => {
      let allowRecord = true
      field.characterParser.forEach(segment => {
        if (segment.active == true) {
          let chars = record[field.prop].substr(segment.position - 1, segment.numberOfCharacters)
          let terms = segment.searchTerm.split(',')
          let foundTerm = false
          terms.forEach(term => {
            if (chars.indexOf(term) != -1) {
              foundTerm = true
            }
          })
          if (foundTerm) {
            segment.found = true
          } else {
            segment.found = false
          }
        } else {
          segment.found = true
        }
      })

      let allSegmentsSatisfied = true
      field.characterParser.forEach(segment => {
        if (!segment.found) {
          allSegmentsSatisfied = false
        }
      })

      if (allSegmentsSatisfied) {
        newDataSet.push(record)
      }

    })

    return newDataSet
  }


  initMultiList(field) {
    field.searchTerms = []
    field.separator = ','
  }
  resetMultiList(field) {
    field.searchTerms = []
  }

  addSearchTerm(field) {
    field.searchTerms.push({ active: false, name: "search-" + field.searchTerms.length, searchTerm: '' })
  }

  deleteSearchTerm(field, segmentIndex) {
    field.searchTerms.splice(segmentIndex, 1)
  }

  multiListActive(field) {
    return field.searchTerms.find(c => c.active == true) ? true : false
  }

  multiListParser(field, dataSet) {
    let newDataSet = []
    dataSet.forEach(record => {
      let allowRecord = true
      field.searchTerms.forEach(segment => {
        if (segment.active == true) {
          let listItems = record[field.prop].split(field.separator)
          let terms = segment.searchTerm.split(',')
          let foundTerm = false
          terms.forEach(term => {
            listItems.forEach(item => {
              if (item.indexOf(term) != -1) {
                foundTerm = true
              }
            })
          })
          if (foundTerm) {
            segment.found = true
          } else {
            segment.found = false
          }
        } else {
          segment.found = true
        }
      })

      let allSegmentsSatisfied = true
      field.searchTerms.forEach(segment => {
        if (!segment.found) {
          allSegmentsSatisfied = false
        }
      })

      if (allSegmentsSatisfied) {
        newDataSet.push(record)
      }

    })

    return newDataSet
  }

  initEntryTimes(field) {
    field.entryTimes = []
    field.separator = ','
  }

  entryTimesParser(field, dataSet) {
    let newDataSet = []
    dataSet.forEach(record => {
      let allowRecord = true
      field.entryTimes.forEach(segment => {
        if (segment.active == true) {
          let entryRanges = record[field.prop].split(field.separator)
          let entryDateFrom = moment(segment.entryDateFrom).format('YYYY-MM-DD') + 'T' + segment.entryTimeFrom
          let entryDateFromMills = new Date(entryDateFrom).getTime()
          let entryDateTo = moment(segment.entryDateTo).format('YYYY-MM-DD') + 'T' + segment.entryTimeTo
          let entryDateToMills = new Date(entryDateTo).getTime()
          segment.formattedEntryFrom = new Date(entryDateFrom).toUTCString()
          segment.formattedEntryTo = new Date(entryDateTo).toUTCString()
          let foundTerm = false
          entryRanges.forEach(entryRange => {
            let parts = entryRange.split('=')
            let zone = parts[0]
            let entryTime = new Date(parts[1]).getTime()
            if ((entryTime >= entryDateFromMills && entryTime <= entryDateToMills) && zone === segment.zone) {
              foundTerm = true
            }
          })

          if (foundTerm) {
            segment.found = true
          } else {
            segment.found = false
          }
        } else {
          segment.found = true
        }
      })

      let allSegmentsSatisfied = true
      field.entryTimes.forEach(segment => {
        if (!segment.found) {
          allSegmentsSatisfied = false
        }
      })

      if (allSegmentsSatisfied) {
        newDataSet.push(record)
      }

    })

    return newDataSet
  }
  resetEntryTimes() {

  }

  resetParser(field) {
    field.characterParser = []
  }

  addEntryRange(field) {
    field.entryTimes.push({ zone: '', entryDateFrom: '', entryTimeFrom: '00:00:00', entryDateTo: '', entryTimeTo: '23:59:59', active: false })
  }

  deleteEntryRange(field, segmentIndex) {
    field.entryTimes.splice(segmentIndex, 1)
  }

  entryTimesActive(field) {
    return field.entryTimes.find(c => c.active == true) ? true : false
  }
  parserActive(field) {
    return field.characterParser.find(c => c.active == true) ? true : false
  }

  addSegment(field) {
    field.characterParser.push({ active: false, name: "search-" + field.characterParser.length, position: 1, numberOfCharacters: 1, searchTerm: '' })
  }

  deleteSegment(field, segmentIndex) {
    field.characterParser.splice(segmentIndex, 1)
  }

  addLookupSegment(field) {
    field.lookupSegments.push(cloneDeep(field.lookupFields))
  }

  deleteLookupSegment(field, segmentIndex) {
    field.lookSegments.splice(segmentIndex, 1)
  }

  /*
  *
  *
  */
  extractDataChoices(dataSet, fieldName) {
    let options = {}
    dataSet.forEach(row => {
      options[row[fieldName]] = true
    })
    // convert to array for template
    return Object.keys(options).map(key => {
      return { option: key }
    })

  }

  /*
    *
    *
    */
  senseFieldType(dataSet, fieldName) {

    let fieldType

    // We need data in order to detect type
    if (dataSet) {

      let value = dataSet[fieldName]

      // Boolean?
      if (value === true || value === false) {
        return "boolean"
      }
      // Number?
      if (Number(value) || value === "0") {
        value = Number(value)
      }

      fieldType = String(typeof value)

      // String?
      if (fieldType === "string") {
        if (value.substr(4, 1) == '-' && value.substr(7, 1) == '-') {
          // UTC Date?
          if (value.substr(10, 1) == 'T' && value.substr(13, 1) == ':' && value.substr(16, 1) == ':') {
            fieldType = "utcdate"
          } else {
            // None UTC Date
            fieldType = "date"
            value = new Date(value)
          }
        } else {
          // Comma delimited list?
          // if (value.indexOf(',') != -1) {
          //   this.useConverter("Delimited text")
          // }
        }



      }

      // Object - objects are treated as lookup data and flattened into column fields in the record
      if (fieldType == 'object') {
        if (value) {
          if (value.length) {
            fieldType = 'Additional data?'
          }
        }
      }

    } else {
      fieldType = "remove and re-add field to detect type"
    }

    return fieldType
  }

  /*
  *
  *
  */
  extractFields(dataSet) {
    let keys = Object.keys(dataSet[0])

    return keys.map(key => {

      // Get all data choices from table for typeahead
      let dataChoices = this.extractDataChoices(dataSet, key)

      let field = {
        headerName: key, field: key, prop: key, name: key, filter: '', dataChoices: dataChoices,
        fromDate: null, toDate: null, type: '',
        fromNumber: null, toNumber: null, stringExpr: '', checked: false, customType: 'default'
      }

      // Sense basic field types
      let fieldType = this.senseFieldType(dataSet[0], key)

      Object.assign(field, { type: fieldType })


      return field

    })
  }

  flattenLookupListsIntoAdditionalFields(dataSet, extractedFields) {

    // Add additional keys for any lookup fields 
    // extractedFields.filter(f => f.type == 'Additional reference data').forEach(f => {
    //   // Pull the field names
    //   let lookupKeys = Object.keys(f)

    // })

  }


}
