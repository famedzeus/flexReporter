import { Inject, Injectable } from '@angular/core'
import { cloneDeep, orderBy, hasIn } from 'lodash'
import { Observable } from 'rxjs'
import * as moment from 'moment'
import { ServerInfo } from '../../../services/ServerInfo'
import { FieldConverter } from '../fieldConverters/fieldConverter.service'


export interface IView {
  recordLimit: number
}

/**
 * @description
 * Provides view service functions
 * It mostly exposes summary methods for summary feeds
 */
@Injectable()
export class ViewService {

  MAX_SAMPLE_SIZE = 5000
  LARGE_REPORT_THRESHOLD = 50000
  RECORD_LIMIT = 500000 // 1048576


  constructor(
    private ServerProperties: ServerInfo,
    private fieldConverter: FieldConverter
  ) {

  }

  initSummaries() {
  }

  /*
   *
   *
   */
  filterTable(endPoint: string, view: IView, archive: boolean, size?: number, appendFilters?: boolean, allowAnySize?: boolean, returnHeaders?: boolean) {


    let url = this.ServerProperties.URL() + endPoint

    if (!allowAnySize) {
      if (size > this.MAX_SAMPLE_SIZE || !size) {
        view.recordLimit = this.MAX_SAMPLE_SIZE
        size = this.MAX_SAMPLE_SIZE
      }
    }

    if (size > 0)
      url += '?pageSize=' + size
    else
      url += '?pageSize=999999'

    if (archive) {
      url += '&database=arch'
    }

    // Append filter options
    if (appendFilters) {
      url += this.appendFilters(view)
    }

    let promises = []
    // if (returnHeaders) {
    //   return fetch(url, { credentials: 'include' })
    // } else {
    return fetch(url, { credentials: 'include' }).then(response => response.json())
    // }

  }

  /*
    * This method uses the feed back and forward date properties
    *
    */
  filterTableForSummaryFeed(endPoint: string, view: IView, archive: boolean, feed: Object) {
    console.log(feed)
  }

  /*
    *
    *
    */
  getDescription(view) {
    return this.appendFilters(view).replace(/&filter=/gi, '|', )
      .replace(/==/g, '=')
      .replace(/=~/g, ' contains ') +
      this.getClientConvertersDescription(view)
  }

  getClientConvertersDescription(view) {

    return view.selectedFields.reduce((acc, field) => {

      if (field.characterParser) {
        field.characterParser.forEach(segment => {
          if (segment.active) {
            return acc += ` | ${field.name}=${segment.numberOfCharacters} characters at position ${segment.position} matching ${segment.searchTerm}`
          }
        })
      }

      if (field.type == 'Delimited text') {
        let searchPhrase = ''
        field.searchTerms.forEach((segment, index) => {
          if (segment.active) {
            searchPhrase += segment.searchTerm.replace(',', ' OR ')
            if (index < field.searchTerms.length - 1) {
              searchPhrase += ' AND '
            }
          }
        })
        return acc += ` | ${field.name} contain the terms ${searchPhrase}`
      }

      if (field.type == "Zonal entry times") {
        let searchPhrase = ''
        field.entryTimes.forEach((segment, index) => {
          if (segment.active) {
            searchPhrase += ` | Enters zone ${segment.zone} between ${segment.formattedEntryFrom} and ${segment.formattedEntryTo}`

          }
        })
        return acc += searchPhrase
      }

      return acc
    }, '')
  }
  /*
    *
    *
    */
  appendFilters(view) {
    let filters = ''
    view.selectedFields.forEach(field => {

      // converter set?
      if (field.customType != 'default') {
        let converter = this.fieldConverter.getConverters().find(c => c.name == field.customType && !c.clientFilter)
        if (converter) {
          filters += converter.convertFn(field)
        }
        return
      }

      switch (field.type) {
        case 'boolean':
          if (field.checked != null) {
            filters += '&filter=' + field.prop + '==' + field.checked
          }
          break;
        case 'string':
          if (field.stringExpr != '' && field.stringExpr != null) {
            let terms = field.stringExpr.split(',')
            terms.forEach(term => {
              filters += '&filter=' + field.prop + '=~' + term
            })
          }
          break;
        case 'number':
          if (field.fromNumber != null && field.toNumber != null) {
            filters += '&filter=' + field.prop + '>=' + field.fromNumber
            filters += '&filter=' + field.prop + '<=' + field.toNumber
          }
          break;
        case 'utcdate':
          if (field.useAsFeed) {
            filters += this.fieldConverter.toFeed(field, 'YYYY-MM-DDTHH:mm:ss')
            break
          }
          if (field.fromDate != null && field.toDate != null) {
            filters += '&filter=' + field.prop + '>=' + moment(field.fromDate).format("YYYY-MM-DD") + 'T00:00:00'
            filters += '&filter=' + field.prop + '<=' + moment(field.toDate).format("YYYY-MM-DD") + 'T23:59:59'
          }
          break;
        case 'date':
          if (field.useAsFeed) {
            filters += this.fieldConverter.toFeed(field, 'YYYY-MM-DD')
            break
          }
          if (field.fromDate != null && field.toDate != null) {
            filters += '&filter=' + field.prop + '>=' + moment(field.fromDate).format("YYYY-MM-DD")
            filters += '&filter=' + field.prop + '<=' + moment(field.toDate).format("YYYY-MM-DD")
          }
          break;
      }

    })
    return filters
  }


  /*
  *
  *
  */
  buildSummary(data: Array<any>, endPoint: string, summary: Object, fullData?: boolean, feed?: boolean) {

    return new Promise((resolve, reject) => {

      // Use a copy of the summary so that it does not reflect in the table if it is for a full dataSet CSV export (not a sample for the table)
      let categorisedSummary
      if (fullData) {
        categorisedSummary = cloneDeep(summary)
      } else {
        categorisedSummary = summary
      }

      // this.globalActivityEffects.setActivity(ActivityType.Progress, 'Building summary..')
      // this.loadingIndicator = true

      if (!feed) {
        categorisedSummary.summaryRowFields = []
        categorisedSummary.selectedSummaryRowFields.value.forEach(field => {
          categorisedSummary.summaryRowFields.push({ name: field, prop: field, headerName: field, field: field })
        })
        categorisedSummary.summaryColumnField = { headerName: categorisedSummary.selectedSummaryColumnFields.value, field: categorisedSummary.selectedSummaryColumnFields.value, name: categorisedSummary.selectedSummaryColumnFields.value, prop: categorisedSummary.selectedSummaryColumnFields.value }
        // categorisedSummary.feed.feedDateField = { name: categorisedSummary.feed.selectedFeedDateField.value }
      }

      this.buildSummaryTotals(data, categorisedSummary, fullData).then(processedSummary => {

        // this.loadingIndicator = false
        categorisedSummary.csvSummaryName = `${endPoint}-${categorisedSummary.summaryColumnField.name}_by_`
        categorisedSummary.summaryRowFields.forEach(field => {
          categorisedSummary.csvSummaryName += `${field.name}-`
        })
        categorisedSummary.csvSummaryName += 'summary'
        // this.globalActivityEffects.setNoActivity()
        resolve(categorisedSummary)

      }).catch(e => {
        // this.globalActivityEffects.setNoActivity()
      })

    })
  }

  // SUMMARY
  /*
  *
  *
  */
  buildSummaryTotals(data, categorisedSummary, fullData?) {

    return new Promise((resolve, reject) => {

      categorisedSummary.summaryColumns = []
      let dataSet = data

      // Build fixed category columns
      categorisedSummary.summaryRowFields.forEach(field => {
        Object.assign(field, { pinned: 'left', cellStyle: { 'font-weight': 'bold', 'background-color': 'white' }, category: true })
        categorisedSummary.summaryColumns.push(field)
      })

      // Build repeating dynamic column field data titles
      let dataChoices = this.fieldConverter.extractDataChoices(dataSet, categorisedSummary.summaryColumnField.name)

      dataChoices.forEach(field => {
        categorisedSummary.summaryColumns.push({ headerName: field.option, field: field.option, prop: field.option, name: field.option })
      })
      categorisedSummary.summaryColumns.push({ cellStyle: { 'font-weight': 'bold', 'background-color': 'white' }, headerName: 'TOTAL', field: 'total', prop: 'total', name: 'TOTAL', headerClass: 'total', cellClass: 'total', pinned: 'right' })

      // Build summary dataset groups
      categorisedSummary.summaryRowGroups = {}

      dataSet.forEach(record => {
        // Encode unique groupings
        let groupName = ''
        let groupNames = []
        let groupValues = []
        let columnValues = {}
        let columnNames = []
        categorisedSummary.summaryRowFields.forEach(row => {
          groupName += row.name + ':' + record[row.name] + '|'
          groupValues.push({ field: [row.name], value: record[row.name] })
          groupNames.push(row.name)
        })
        categorisedSummary.summaryColumns.forEach(column => {
          if (!column.category) {
            Object.assign(columnValues, { [column.prop]: 0, total: 0 })
          }
        })

        //column.key = groupName + this.summaryColumnField.name + ':' + column.name
        Object.assign(categorisedSummary.summaryRowGroups, {
          [groupName]: {
            grandTotal: 0,
            groupNames: groupNames,
            columnName: categorisedSummary.summaryColumnField.name,
            groupValues: groupValues,
            columnValues: columnValues
          }
        })
      })

      this.getMatchingRecordCount(categorisedSummary.summaryRowGroups, dataSet)

      //Final flat table
      categorisedSummary.summaryRows = this.buildSummaryRows(categorisedSummary)
      categorisedSummary.regenerate = false
      resolve(categorisedSummary)

    })
  }

  /*
  *
  *
  */
  getMatchingRecordCount(summaryRowGroups, dataSet) {

    // Iterate through groups
    let keys = Object.keys(summaryRowGroups)
    keys.forEach((key, index) => {
      // Check for matching group fields      
      dataSet.forEach(record => {
        let found = true
        let x = 1
        summaryRowGroups[key].groupValues.forEach(val => {
          if (record[val.field[0]] !== val.value) {
            found = false
          }
        })
        // if found, update column total
        if (found) {
          // Iterate column names and see if we have a matching field name
          let colVals = Object.keys(summaryRowGroups[key].columnValues)
          colVals.forEach(val => {
            if (record[summaryRowGroups[key].columnName] == val) {
              summaryRowGroups[key].columnValues[val]++
            }
          })
        }
      })
    })
  }

  /*
  *
  *
  */
  buildSummaryRows(categorisedSummary) {

    // this.summaryColumns = summaryColumns
    let summaryRows = []
    let rows = []
    let colTotals = {}

    // Build rows
    let keys = Object.keys(categorisedSummary.summaryRowGroups)
    keys.forEach((key, index) => {
      let k = {}
      categorisedSummary.summaryRowGroups[key].groupValues.forEach(val => {
        Object.assign(k, { [val.field]: val.value })
      })
      let x = 1
      let rowTotal = 0
      let colVals = Object.keys(categorisedSummary.summaryRowGroups[key].columnValues)
      colVals.forEach(val => {
        Object.assign(k, { [val]: categorisedSummary.summaryRowGroups[key].columnValues[val] })
        rowTotal += categorisedSummary.summaryRowGroups[key].columnValues[val]
        Object.assign(colTotals, { [val]: 0 })
      })
      // Get row total
      Object.assign(k, { total: rowTotal })
      rows.push(k)
    })
    // calculate column totals
    let rowKeys = Object.keys(rows[0])
    rows.forEach((row, key) => {
      rowKeys.forEach(rk => {
        if (colTotals[rk] != undefined) {
          colTotals[rk] += row[rk]
        }
      })
    })

    Object.assign(colTotals, { grandTotal: true, cellStyle: { 'font-weight': 'bold', 'background-color': 'white' } })
    rows.push(colTotals)

    // summary.summaryRows = rows
    // this.summaryRowGroups = summaryRowGroups
    return rows
  }

}
