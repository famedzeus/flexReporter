import { AfterViewInit, Component, Inject, Injectable, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, TemplateRef } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Observable, TimeInterval } from 'rxjs'
import { cloneDeep } from 'lodash'
import { Router } from '@angular/router'
// import { IFlexReport, IFlexDataSource } from '../../core/FlexReporter'
import { ServerInfo } from '../../../services/ServerInfo'
import { MatDialog, MatDialogClose, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Dialog } from '../dialogues/dialogues.component'
import { GlobalActivityEffectService, ActivityType } from '../../../store/effects'

import { AgGridColumn } from 'ag-grid-angular'
import { AgRendererComponent } from 'ag-grid-angular'

import { ViewService } from '../view/View.service'
import * as Chart from 'chart.js'

const template = require('./Feeds.component.html')

// <mat-form-field>
//     <mat-select #summaryRowFieldsControl placeholder="Groupings" (change)="updateCategoryData(summary)" [formControl]="summary.categorisedSummary.selectedGroupings"
//         multiple>
//         <mat-option *ngFor="let field of summary.categorisedSummary.categories" [value]="field">{{field}}</mat-option>
//     </mat-select>
// </mat-form-field>

@Component({
  selector: 'feeds-component',
  template: './Feeds.component.html'
})

export class FeedsComponent implements OnInit, AfterViewInit {

  @Input() datasources
  @ViewChild('canv') canvas
  @ViewChild('test') test

  params: any;

  categorisedSummary
  chosenCategory
  chartTitle
  requestingSummaries = false


  categories = []
  data: Array<Chart.ChartDataSets>

  static onUpdate = new EventEmitter()

  constructor(
    private serverInfo: ServerInfo,
    private dialog: MatDialog,
    private viewService: ViewService,
    private globalActivityEffects: GlobalActivityEffectService
  ) {
    // this.testData = [{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], label: 'Attribute Value Total' }]
    let x = 1
  }

  ngOnInit() {


  }

  ngAfterViewInit() {

  }

  agInit(params: any): void {
    try {
      this.params = params
      this.datasources = JSON.parse(this.params.data.configuration)
    } catch (e) { }
  }

  toggleAllCategories($event, summary) {

    if ($event.source.checked) {
      let vals = []
      summary.categorisedSummary.categories.forEach(cat => {
        vals.push(cat)
      })
      summary.categorisedSummary.selectedGroupings.setValue(vals)
    } else {
      summary.categorisedSummary.selectedGroupings.setValue([])
    }
    this.updateCategoryData(summary)
  }

  requestFeeds(datasource, view) {

    // this.globalActivityEffects.setActivity(ActivityType.Progress, 'Requesting summary data..')
    view.requestingSummaries = true

    view.summaries.forEach((summary, index) => {
      if (summary.feed.liveFeed == true) {
        // request data
        // update last updated
        console.log("Refresh " + summary.name)

        this.viewService.filterTable(datasource.endpoint, view, datasource.archive, datasource.limit, true).then((response) => {
          let x = 1
          this.viewService.buildSummary(response, datasource.endPoint, summary, true, true).then(categorisedSummary => {
            summary.categorisedSummary = categorisedSummary
            // We have to copy in summaryRowFields as they come from view component
            Object.assign(summary.categorisedSummary, { chartTitle: '', xAxisLabels: [], data: [], summaryRowFields: summary.summaryRowFields, categories: [], chosenCategory: "", selectedGroupings: new FormControl() })
            console.info(summary.categorisedSummary)
            Object.keys(summary.categorisedSummary.summaryRowGroups).forEach(k => summary.categorisedSummary.categories.push(k))
            this.updateCategoryData(summary)
            summary.feed.lastRefresh = new Date().getTime()

            if (index == view.summaries.length - 1) {
              view.requestingSummaries = false
              // this.globalActivityEffects.setNoActivity()
            }

          })
        })

      }
    })
  }

  updateCategoryData(summary) {

    let dataSet = []
    summary.categorisedSummary.data = []
    summary.categorisedSummary.xAxisLabels = []
    summary.categorisedSummary.colours = []

    summary.categorisedSummary.summaryColumns.forEach((col, index) => {
      if (!col.category && col.headerName != 'TOTAL') {
        summary.categorisedSummary.xAxisLabels.push(col.field)
        summary.categorisedSummary.colours.push('rgba(' + Math.random() * 255 + ',' + + Math.random() * 255 + ',' + Math.random() * 255 + ',1)')
      }
    })

    summary.categorisedSummary.selectedGroupings.value.forEach((selectedGrouping, index) => {
      dataSet = []

      Object.keys(summary.categorisedSummary.summaryRowGroups[selectedGrouping].columnValues).forEach((col) => {
        let nonZeroValue = false
        let val = summary.categorisedSummary.summaryRowGroups[selectedGrouping].columnValues[col]
        if (col != 'total') {
          dataSet.push(val)
        }
      })
      summary.categorisedSummary.data.push({ data: dataSet, label: selectedGrouping })
      summary.categorisedSummary.chartTitle = '' //this.chosenCategory
    })
  }

  refresh() {
    return false
  }

  getTitle(view, summary) {
    let x = 1
    
    return "Summary totals for " + summary.categorisedSummary.summaryColumnField.name + " categorised by " + summary.summaryRowFields.reduce((acc, v) => {
      return acc + v.name + ','
    },'')
      
  }

  getField(view, name) {
    return view.selectedFields.find(field => field.name == name)
  }

}