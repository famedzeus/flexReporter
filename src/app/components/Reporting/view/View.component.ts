import { AfterViewInit, Component, Inject, Injectable, Input, Output, OnInit, EventEmitter, ViewChild, ApplicationRef } from '@angular/core'
import { GlobalActivityEffectService, ActivityType } from '../../../store/effects'
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs/Observable'
import { cloneDeep, groupBy, isEqual } from 'lodash'
import { IFlexReport, IFlexDataSource } from '../../core/FlexReporter'
import { ServerInfo } from '../../../services/ServerInfo'
import * as moment from 'moment'
import { MatDialog, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Dialog } from '../dialogues/dialogues.component'

import { FieldConverterComponent } from '../fieldConverters/fieldConverter.component'
import { FieldConverter } from '../fieldConverters/fieldConverter.service'
import { ViewService } from './View.service'

const template = require('./View.component.html')

require('../Reporting.scss')

interface ISearchField {
  prop: string,
  name: string,
  dataChoices: Array<any>,
  type: string
  fromDate?: Date,
  toDate?: Date,
  fromNumber?: number,
  toNumber?: number
  stringExpr?: string,
  customisations?: Object

}

/**
 * @description
 * Simple flex reporter
 */
@Component({
  selector: 'c-view',
  template:'./View.component.html',
  styleUrls: ['../Reporting.scss']
})
export class ViewComponent implements OnInit {

  @Input() view
  @Input() active: boolean
  @Input() init: boolean
  @Input() endpoint
  @Input() archive
  @Input() datasource
  @Input() summaryIndex
  @Input() recordLimit: number


  @Output() addSummary = new EventEmitter()
  @Output() deleteSummary = new EventEmitter()
  @Output() duplicateSummary = new EventEmitter()
  @Output() updateSummaryFeeds = new EventEmitter()
  @Output() onError = new EventEmitter()
  @Output() onChange = new EventEmitter()

  @ViewChild('fieldsControl') fieldsControl
  @ViewChild('resultsTable') resultsTable

  dataSet = []

  // this.selectedFields is the form control dropDown. It displays this.extractedFields array names
  extractedFields: Array<ISearchField>
  selectedFields = new FormControl()

  feedDateField = new FormControl()

  currentSummary
  currentSummaryIndex
  filteredDataChoices
  dataChoices
  loadingIndicator = false
  mode = ""
  csvName = ''
  csvLimit = 0
  useAllFields = false
  sorts: Array<any>
  adjustedColumns = []
  badEndpoint: boolean = false
  noDataInDataSource: boolean = false
  exceedsSafeLimit: boolean = false
  gridOptions = { pagination: false, enableFilter: false, enableColResize: true, paginationAutoPageSize: true, enableSorting: true }
  offerResample = false
  fieldConverters
  actualRecordCount
  differ
  csvProgress = 0
  gettingFinalRecordCount = false

  // SUMMARY
  // summaryColumnField = {name:'',dataChoices:[]}
  // summaryColumns = []
  // summaryRows = []
  // summaryRowFields = []
  // summaryRowGroups
  // csvSummaryName = ''

  constructor(
    private ServerProperties: ServerInfo,
    private globalActivityEffects: GlobalActivityEffectService,
    private dialog: MatDialog,
    private converter: FieldConverter,
    private applicationRef: ApplicationRef,
    private viewService: ViewService

  ) {

  }

  /*
  *
  *
  */
  ngOnInit() {
    // this.toppings.setValue(["Sausage"])
    // // build summaries

    this.fieldConverters = this.converter.getConverters()

    this.view.summaries.forEach(summary => {
      let cntrl = new FormControl()
      Object.assign(summary, { selectedSummaryRowFields: new FormControl(), selectedSummaryColumnFields: new FormControl() })
      Object.assign(summary.feed, { selectedFeedDateField: new FormControl() })
      this.refreshSelectedFieldsControl(summary.summaryRowFields, summary.selectedSummaryRowFields)
      summary.selectedSummaryColumnFields.setValue(summary.summaryColumnField.name)
      summary.feed.selectedFeedDateField.setValue(summary.feed.feedDateField)

      //this.buildSummary(summary)
      // this.gridOptions = { pagination: false, enableFilter: false, enableColResize: true, paginationAutoPageSize: true, enableSorting: true }

    })

  }

  /*
  *
  *
  */
  ngOnChanges(changes) {
    // console.info(changes)
    try {
      // Invoked by requirement to be initialised immediately
      if (changes.init) {
        if (changes.init.currentValue === true) {
          this.getData(true)
        }
      }
      // Invoked by outside selection to get data (lazy load)
      if (changes.active && !changes.active.firstChange) {
        this.getData(true)
      }
    }
    catch (e) {
    }
  }

  /*
  *
  *
  */
  openDialog(config): Observable<any> {
    let dialogRef = this.dialog.open(Dialog, {
      data: config
    });

    return dialogRef.afterClosed()
  }

  /*
  *
  * This is initial getData on activating view
  */
  getData(init?: boolean) {
    if (this.dataSet.length === 0) {

      this.globalActivityEffects.setActivity(ActivityType.Progress, 'Extracting fields..')
      this.exceedsSafeLimit = false

      // Get only first record to extract the fields - no filters
      this.viewService.filterTable(this.endpoint, this.view, this.archive, 1, false, false, false).then(response => {

        if (response) {
          if (response.length) {
            this.dataSet = response
            this.extractedFields = this.converter.extractFields(this.dataSet)
            // this.converter.flattenLookupListsIntoAdditionalFields(this.dataSet, this.extractedFields)            
            this.refreshSelectedFieldsControl(this.view.selectedFields, this.selectedFields)

            this.globalActivityEffects.setActivity(ActivityType.Progress, 'Getting initial view data..')

            // Now get initial view of data with the filters
            this.viewService.filterTable(this.endpoint, this.view, this.archive, this.view.recordLimit, true, false, true).then((response) => {

              this.dataSet = response
              this.dataSet = this.applyClientConverters(this.dataSet)
              this.csvName = this.endpoint
              this.csvLimit = 100
              this.resultsTable.sorts = this.sorts
              this.globalActivityEffects.setNoActivity()
              this.badEndpoint = false
              this.noDataInDataSource = false
              this.getFinalRecordCount()
              //this.syncAllFields()

            }).catch(e => {
              throw (e)
            })
          } else {
            // No data
            this.noDataInDataSource = true
            this.globalActivityEffects.setNoActivity()
          }
        } else {
          // No response
          this.globalActivityEffects.setNoActivity()
          this.badEndpoint = true
        }
      }).catch(e => {
        this.globalActivityEffects.setNoActivity()
        this.badEndpoint = true
        throw (e)
      })
    }
  }

  /*
  *   have to do this silly syncronization for the control
  *
  */
  refreshSelectedFieldsControl(data, control) {
    let vals = []
    if (data) {
      data.forEach(field => {
        vals.push(field.prop)
      })
    }
    control.setValue(vals)
  }

  updateSummary(dataSet, endpoint, summary) {

  }

  /*
  *
  *
  */
  hasFilter(field) {

    let converterActive = false
    const { converter = { clientFilter: false, isActive: (field) => { return false } } } = { converter: this.fieldConverters.find(c => c.name == field.customType) }

    return field.fromNumber != null && field.fromNumber != '' ||
      field.toNumber != null && field.toNumber != '' ||
      field.toDate != null && field.toDate != '' ||
      field.fromDate != null && field.fromDate != '' ||
      field.stringExpr != null && field.stringExpr != '' ||
      converter.isActive(field) == true
  }

  /*
  *
  *
  */
  filtersApplied() {
    let filtersApplied = false
    if (this.view.selectedFields) {
      this.view.selectedFields.forEach(field => {
        if (this.hasFilter(field)) {
          filtersApplied = true
        }
      })
    }
    return filtersApplied
  }

  /*
  *
  *
  */
  syncAllFields() {

    // Refresh selected fields model from multi select control
    let newFields = []
    this.selectedFields.value.forEach(v => {
      // We have to concatenate existing fields and their settings with any newly selected fields from the control (crazy)
      let extractedField = this.extractedFields.find(f => f.name === v)
      let selectedField = this.view.selectedFields.find(f => f.name === v)
      if (selectedField) {
        newFields.push(selectedField)
      } else {
        if (extractedField) {
          newFields.push(extractedField)
        }
      }
    })
    this.view.selectedFields = newFields
    this.useAllFields = this.view.selectedFields.length === this.extractedFields.length
    this.onChange.emit()
  }


  /*
  * 
  * This toggles are selected fields on/off
  */
  toggleSelectedFields($event) {
    let vals = []
    if ($event.source.checked) {
      this.extractedFields.forEach(f => {
        vals.push(f.name)
      })
      this.selectedFields.setValue(vals)
      this.view.selectedFields = cloneDeep(this.extractedFields)
      this.view.selectedFields.forEach(f => f.checked = true)
    } else {
      this.view.selectedFields = []
      this.selectedFields.setValue([])
    }

  }

  /*
  *
  *
  */
  filter(limit: number, appendFilters?: boolean) {
    let x = 1
    this.globalActivityEffects.setActivity(ActivityType.Progress, 'Extracting data..')
    this.viewService.filterTable(this.endpoint, this.view, this.archive, limit, true, true, true).then((response) => {
      
      this.dataSet = response
      this.rebuildSummaries()
      this.dataSet = this.applyClientConverters(this.dataSet)
      this.offerResample = false
      this.globalActivityEffects.setNoActivity()
      this.getFinalRecordCount()
    })

      
    
}

/*
*
*
*/
rebuildSummaries() {
  this.view.summaries.forEach(summary => {
    this.viewService.buildSummary(this.dataSet, this.endpoint, summary)
  })
}

/*
*
*
*/
resetFilters() {
  this.onChange.emit()
  this.view.selectedFields.forEach(field => {
    field.toNumber =
      field.fromNumber =
      field.stringExpr =
      field.fromDate =
      field.toDate =
      field.checked =
      null

    if (field.customType != 'default') {
      let converter = this.fieldConverters.find(c => c.name == field.customType)
      if (converter) {
        converter.resetFn(field)
      }
    }

  })
  this.viewService.filterTable(this.endpoint, this.view, this.archive, this.view.recordLimit, true)
}

/*
*
* After the dataset has returned via server filtering apply any client side filter converters that have been specified
*/
applyClientConverters(dataSet) {
  let convertedDataSet = dataSet
  let converted = false
  this.view.selectedFields.forEach(field => {
    let converter = this.fieldConverters.find(c => c.name == field.customType && c.clientFilter == true)
    if (converter) {
      convertedDataSet = converter.convertFn(field, convertedDataSet)
      converted = true
    }
  })
  return convertedDataSet
}

getDescription(view) {
  return this.viewService.getDescription(view)
}

getFeedFields() {
  return this.view.selectedFields.filter(field => field.useAsFeed == true)
}
hasFeedFields() {
  let feeds = this.view.selectedFields.filter(field => field.useAsFeed == true)
  return feeds.length
}

/*
*
*
*/
addField(field) {
  this.view.selectedFields.push(field)
}

/*
*
*
*/
overrideFieldType(field) {

  // Has field been set by user to a type?
  if (field.customType != 'default') {
    // field.type = this.fieldConverters.find(c => c.name === field.customType).name
    field.type = field.customType
    // has converter got an init function?
    let converter = this.fieldConverters.find(c => c.name === field.customType)
    if (converter) {
      if (converter.initFn) {
        converter.initFn(field, this.dataSet)
      }
    }
  } else {
    // Run default sensing function
    if (this.dataSet[0]) {
      field.type = this.converter.senseFieldType(this.dataSet[0], field.name)
    } else {
      // Get only first record to extract the fields - no filters
      // This is if the filters have caused no data in the dataset to use to detect the field type again
      this.viewService.filterTable(this.endpoint, this.view, this.archive, 1, false).then(response => {
        if (response) {
          if (response.length) {
            field.type = this.converter.senseFieldType(response[0], field.name)
          }
        }
      })
    }
  }

}

/*
*
*
*/
getFieldCustomisations(field) {
  let selectedField = this.view.selectedFields.find(f => f.prop === field.prop)
  if (selectedField) {
    Object.keys(field.customisations).forEach(key => {
      // field.customisations[key] = selectedField.customisations[key]
      if (key === 'alias') {
        selectedField.name = selectedField.customisations[key]
      }
    })
  }
}

test() {
  console.log("test")
}

/*
*
*
*/
setSort($event) {
  this.sorts = $event.sorts
}

/*
*
*
*/
setColumnOrder($event) {
  // adjust column order in both extractedFields and selectedFields to keep them synced
  let dst = this.extractedFields[$event.newValue].prop
  let src = this.extractedFields[$event.prevValue].prop

  let dstIndex = this.extractedFields.findIndex(field => field.prop === dst)
  let srcIndex = this.extractedFields.findIndex(field => field.prop === src)
  // this.extractedFields[$event.newValue] = src
  // this.extractedFields[$event.prevValue] = dst
}



/*
*
*
*/
stringExprTypeAhead(field) {
  field.filteredDataChoices = field.dataChoices.filter(data =>
    data.option.toLowerCase().indexOf(field.stringExpr.toLowerCase()) === 0);
}

/*
*
*
*/
fieldSelected(prop) {
  return this.view.selectedFields.find(field => field.prop === prop)
}

/*
*
*
*/
fetchData() {
}

/*
*
*
*/
selectedField() {
  // console.info("!")
}

/*
*
*
*/
deselectField(field) {
  let i = this.view.selectedFields.findIndex(f => f.prop === field.prop)
  this.view.selectedFields.splice(i, 1)
  // this.fieldsControl.options._results[i]._selected = false
  this.refreshSelectedFieldsControl(this.view.selectedFields, this.selectedFields)
  this.syncAllFields() 
}

getFinalRecordCount() {

 

  this.gettingFinalRecordCount = true

  this.viewService.filterTable(this.endpoint, this.view, this.archive, 100, true, true).then((response) => {

    // Test with lots of records
    // for (let i = 0; i < 2000000; i++) {
    //   response.push({ "schedulePeriod": "20174905", "routeNumber": 22, "plantName": "NMUK", "allocatedByELTRule": 0, "seriesMapName": null, "offlineDateTime": "2017-12-08T07:26:48", "scheduleDate": "2017-12-08", "scheduleScopeName": "20174905", "vehicleId": 1, "chassisNumber": null, "modelVariant": "FSDALG9ZE03GDFACFE", "vin": null, "customerFlag": null, "buyerCode": "6-BNL-10", "colourGroupCode": "KAD", "nenvOrderType": "0", "productionOrderReceiver": "02", "scheduleSolutionName": "Imported Solution", "destinationCode": "BNL", "carSeriesCode": "ZE06", "lineId": 1, "routeStatus": 0, "shiftCode": 201712081, "vehicleOrderId": 1, "trimColour": "G", "kiteFlyerFlag": null, "lineName": "Line 1", "priorityIndicator": "N", "userAllocated": 0, "colourGroupDescription": "KAD" })
    // }

    if (response.length > this.viewService.RECORD_LIMIT) {
      this.globalActivityEffects.setNoActivity()
      this.openDialog({ icon: 'fa-warning', message: 'Report exceeds limit', text: 'Report exceeds row limit. Reduce search or do multiple exports.', type: 'notify' })
      return
    }

    response = this.applyClientConverters(response)

    this.actualRecordCount = response.length
    this.gettingFinalRecordCount = false
  })

}

/*
*
*
*/
exportCSV(resultsTable, name) {

  let csvData = []

  this.globalActivityEffects.setActivity(ActivityType.Progress, 'Getting requested data.....')

  // Get record set again with csv limit
  this.viewService.filterTable(this.endpoint, this.view, this.archive, this.csvLimit, true, true).then((response) => {

    this.globalActivityEffects.setActivity(ActivityType.Progress, 'Checking data limit..')
    // Test with lots of records
    // for (let i = 0; i < 2000000; i++) {
    //   response.push({ "schedulePeriod": "20174905", "routeNumber": 22, "plantName": "NMUK", "allocatedByELTRule": 0, "seriesMapName": null, "offlineDateTime": "2017-12-08T07:26:48", "scheduleDate": "2017-12-08", "scheduleScopeName": "20174905", "vehicleId": 1, "chassisNumber": null, "modelVariant": "FSDALG9ZE03GDFACFE", "vin": null, "customerFlag": null, "buyerCode": "6-BNL-10", "colourGroupCode": "KAD", "nenvOrderType": "0", "productionOrderReceiver": "02", "scheduleSolutionName": "Imported Solution", "destinationCode": "BNL", "carSeriesCode": "ZE06", "lineId": 1, "routeStatus": 0, "shiftCode": 201712081, "vehicleOrderId": 1, "trimColour": "G", "kiteFlyerFlag": null, "lineName": "Line 1", "priorityIndicator": "N", "userAllocated": 0, "colourGroupDescription": "KAD" })
    // }

    if (response.length > this.viewService.RECORD_LIMIT) {
      this.globalActivityEffects.setNoActivity()
      this.openDialog({ icon: 'fa-warning', message: 'Report exceeds limit', text: 'Report exceeds row limit. Reduce search or do multiple exports.', type: 'notify' })
      return
    }

    this.globalActivityEffects.setActivity(ActivityType.Progress, 'Applying converters...')
    response = this.applyClientConverters(response)

    if (response.length > this.viewService.LARGE_REPORT_THRESHOLD) {

      this.openDialog({
        type: 'question',
        message: 'Report size warning',
        text: 'There are ' + response.length + ' records to export for this report!. Continue?',
        icon: 'fa-warning'
      }).subscribe(result => {

        if (result == 'true') {
          this.proceedWithCSV(resultsTable, response, name).then(response => {
            this.globalActivityEffects.setNoActivity()
          })
        } else {
          this.globalActivityEffects.setNoActivity()
        }
      })
    } else {
      this.proceedWithCSV(resultsTable, response, name).then(response => {
        this.globalActivityEffects.setNoActivity()
      })
    }

  })
}

/*
*
*
*/
proceedWithCSV(resultsTable, response, name) {

  return new Promise((resolve, reject) => {

    this.globalActivityEffects.setActivity(ActivityType.Progress, 'Exporting report..')

    let csv = ''

    // let rows = csvData
    let columns = resultsTable.columnDefs
    columns.forEach((column, index) => {
      csv += column.field
      if (index < columns.length) {
        csv += ','
      }
    })
    csv += '\r\n'

    response.forEach(row => {
      columns.forEach((column, index) => {
        csv += row[column.field]
        if (index < columns.length) {
          csv += ','
        }
      })
      csv += '\r\n'
      // console.log(csv.length)
    })
    this.csvName = name === '' ? this.endpoint : name
    // console.log(csv.length)
    this.downloadCSV(csv, this.csvName + ".csv")
    resolve()

  })

}


/* *****************************************************************
* SUMMARIES METHODS
*
*/

/*
*
*
*/
add(view) {
  this.addSummary.emit({ view: view })
}
/*
*
*
*/
remove(view, summary) {
  this.deleteSummary.emit({ view: view, summary: summary })
}

/*
 *
 *
 */
duplicate(view, summary) {
  this.duplicateSummary.emit({ view: view, summary: summary })
}

/*
*
*
*/
canBuildSummary(summary) {
  return !summary.selectedSummaryRowFields.value.length || summary.selectedSummaryColumnFields.value == ''
}


/*
*
*
*/
getRowClass(row) {
  return { 'total': row.grandTotal === true }
}


/*
*
*
*/
exportSummaryCSV(summary) {

  this.globalActivityEffects.setActivity(ActivityType.Progress, 'Checking data limit..')

  // Get record set again with csv limit
  this.viewService.filterTable(this.endpoint, this.view, this.archive, this.csvLimit, true, true).then((response) => {

    response = this.applyClientConverters(response)

    // Test with lots of records
    // for (let i = 0; i < 2500000; i++) {
    //   response.push({ "schedulePeriod": "20174905", "routeNumber": 22, "plantName": "NMUK", "allocatedByELTRule": 0, "seriesMapName": null, "offlineDateTime": "2017-12-08T07:26:48", "scheduleDate": "2017-12-08", "scheduleScopeName": "20174905", "vehicleId": 1, "chassisNumber": null, "modelVariant": "FSDALG9ZE03GDFACFE", "vin": null, "customerFlag": null, "buyerCode": "6-BNL-10", "colourGroupCode": "KAD", "nenvOrderType": "0", "productionOrderReceiver": "02", "scheduleSolutionName": "Imported Solution", "destinationCode": "BNL", "carSeriesCode": "ZE06", "lineId": 1, "routeStatus": 0, "shiftCode": 201712081, "vehicleOrderId": 1, "trimColour": "G", "kiteFlyerFlag": null, "lineName": "Line 1", "priorityIndicator": "N", "userAllocated": 0, "colourGroupDescription": "KAD" })
    // }

    if (response.length > this.viewService.RECORD_LIMIT) {
      this.globalActivityEffects.setNoActivity()
      this.openDialog({ icon: 'fa-warning', message: 'Report exceeds limit', text: 'Report exceeds row limit. Reduce search or do multiple exports.', type: 'notify' })
      return
    }

    if (response.length > this.viewService.LARGE_REPORT_THRESHOLD) {

      this.openDialog({
        type: 'question',
        message: 'Report size warning',
        text: 'There are ' + response.length + ' records to process for this summary!. Continue?',
        icon: 'fa-warning'
      }).subscribe(result => {

        if (result == 'true') {

          this.proceedWithCSVSummary(summary, response)

        } else {
          this.globalActivityEffects.setNoActivity()
        }

      })
    } else {
      this.proceedWithCSVSummary(summary, response)
    }

  })
}

/*
*
*
*/
proceedWithCSVSummary(summary, response) {

  let csvData = []
  let csvName = summary.csvSummaryName

  this.globalActivityEffects.setActivity(ActivityType.Progress, 'Building report..')

  this.viewService.buildSummary(response, this.endpoint, summary).then(processedSummary => {
    let csv = ''

    let rows = csvData

    // Get columns
    processedSummary['summaryColumns'].forEach((column, index) => {
      csv += column.prop
      if (index < processedSummary['summaryColumns'].length) {
        csv += ','
      }
    })
    csv += '\r\n'

    processedSummary['summaryRows'].forEach(row => {
      processedSummary['summaryColumns'].forEach((column, index) => {
        csv += row[column.prop]
        if (index < processedSummary['summaryColumns'].length) {
          csv += ','
        }
      })
      csv += '\r\n'
    })
    csvName = csvName === '' ? this.endpoint : csvName

    this.downloadCSV(csv, csvName + ".csv")
    this.globalActivityEffects.setNoActivity()
  })

}

/*
*
*
*/
downloadCSV(csv, filename) {
  var csvFile;
  var downloadLink;

  // CSV file
  csvFile = new Blob([csv], { type: "text/csv" });

  // Download link
  downloadLink = document.createElement("a");

  // File name
  downloadLink.download = filename;

  // Create a link to the file
  downloadLink.href = window.URL.createObjectURL(csvFile);

  // Hide download link
  downloadLink.style.display = "none";

  // Add the link to DOM
  document.body.appendChild(downloadLink);

  // Click download link
  downloadLink.click();
}

}
