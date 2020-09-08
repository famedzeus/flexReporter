import { AfterViewInit, Component, Inject, Injectable, Input, Output, OnInit, OnDestroy, Pipe, PipeTransform, EventEmitter, ViewChild, TemplateRef } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs/Observable'
import { cloneDeep } from 'lodash'
import { Router } from '@angular/router'
// import { IFlexReport, IFlexDataSource } from '../../core/FlexReporter'
import { ServerInfo } from '../../../services/ServerInfo'
import { MatDialog, MatDialogClose, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Dialog } from '../dialogues/dialogues.component'
import { GlobalActivityEffectService, ActivityType } from '../../../store/effects'
import { AgGridColumn } from 'ag-grid-angular'
import { AgRendererComponent } from 'ag-grid-angular'


const template = require('./Dashboards.component.html')

require('../Reporting.scss')

export interface IFlexSummary {
  name: String,
  summaryRowFields: Array<any>,
  summaryColumnField: Object,
  summaryColumns: Array<any>,
  summaryRows: Array<any>,
  summaryRowGroups: Object,
  csvSummaryName: String
}
export interface IFlexView {
  name: String,
  active: Boolean,
  selectedFields: Array<any>,
  summaries: Array<IFlexSummary>
}
export interface IFlexReport {
  endpoint: String,
  name: String,
  views: Array<IFlexView>
}

/**
 * @description
 
 */
@Component({
  selector: 'c-super-table',
  template: './Dashboards.component.html',
  styleUrls: ['../Reporting.scss']
})
export class DashboardsComponent implements OnInit, AfterViewInit, OnDestroy {

  // @ViewChild('detailsTmpl') detailsTmpl: TemplateRef<any>
  // @ViewChild('crudTmpl') crudTmpl: TemplateRef<any>
  // @ViewChild('dashboardTmpl') dashboardTmpl: TemplateRef<any>

  currentDataSource
  currentDatasourceIndex
  currentViewIndex
  url = ''
  animal: string;
  name: string;
  currentSummaryIndex
  dashboards
  dashboardColumns
  cellSubscription
  feedCellSubscription
  dashboardName = ''
  gridOptions = {
    onRowClicked: (any) => { }, getRowHeight: (any) => { },
    api: { resetRowHeights: () => { } }, autoHeight: true,
    pagination: true, enableFilter: true,
    enableColResize: true, paginationAutoPageSize: true,
    enableSorting: true, fullWidthCellRenderer: true, rowSelection: 'single', suppressCellSelection: true
  }
  selectedDashboard = { data: [] }
  selectedDashboardName = ""

  dataSources: Array<IFlexReport> =
  [{ "endpoint": "routeInformation", "name": "routes info", "views": [{ "name": "routes-full", "active": true, "selectedFields": [{ "prop": "schedulePeriod", "name": "schedulePeriod", "filter": "", "dataChoices": [{ "option": "20162103" }], "type": "number", "fromDate": null, "toDate": null, "fromNumber": null, "toNumber": null, "stringExpr": "", "checked": false, "$$id": "ovno", "resizeable": true, "sortable": true, "draggable": true, "canAutoResize": true, "width": 399.5, "$$oldWidth": 150 }, { "prop": "routeNumber", "name": "routeNumber", "filter": "", "dataChoices": [{ "option": "340" }, { "option": "341" }, { "option": "342" }, { "option": "343" }, { "option": "344" }], "type": "number", "fromDate": null, "toDate": null, "fromNumber": 340, "toNumber": 343, "stringExpr": "", "checked": false, "$$id": "pjiu", "resizeable": true, "sortable": true, "draggable": true, "canAutoResize": true, "width": 399.5, "$$oldWidth": 150 }, { "prop": "plantName", "name": "plantName", "filter": "", "dataChoices": [{ "option": "NMUK" }], "type": "string", "fromDate": null, "toDate": null, "fromNumber": null, "toNumber": null, "stringExpr": "NMUK", "checked": false, "$$id": "ji7e", "resizeable": true, "sortable": true, "draggable": true, "canAutoResize": true, "width": 399.5, "$$oldWidth": 150, "filteredDataChoices": [{ "option": "NMUK" }] }, { "prop": "seriesMapName", "name": "seriesMapName", "filter": "", "dataChoices": [{ "option": "J111_1" }, { "option": "F157" }], "type": "string", "fromDate": null, "toDate": null, "fromNumber": null, "toNumber": null, "stringExpr": "J111_1", "checked": false, "$$id": "a57v", "resizeable": true, "sortable": true, "draggable": true, "canAutoResize": true, "width": 399.5, "$$oldWidth": 150, "filteredDataChoices": [{ "option": "J111_1" }] }], "summaries": [{ "name": "summary-0", "summaryRowFields": [{ "prop": "schedulePeriod", "name": "schedulePeriod", "filter": "", "dataChoices": [{ "option": "20162103" }], "type": "number", "fromDate": null, "toDate": null, "fromNumber": null, "toNumber": null, "stringExpr": "", "checked": false, "$$id": "2j2m", "resizeable": true, "sortable": true, "draggable": true, "canAutoResize": true, "width": 399.5, "$$oldWidth": 150, "frozenLeft": true, "category": true }, { "prop": "routeNumber", "name": "routeNumber", "filter": "", "dataChoices": [{ "option": "340" }, { "option": "341" }, { "option": "342" }, { "option": "343" }, { "option": "344" }], "type": "number", "fromDate": null, "toDate": null, "fromNumber": null, "toNumber": null, "stringExpr": "", "checked": false, "$$id": "t8s6", "resizeable": true, "sortable": true, "draggable": true, "canAutoResize": true, "width": 399.5, "$$oldWidth": 150, "frozenLeft": true, "category": true }], "summaryColumnField": { "prop": "seriesMapName", "name": "seriesMapName", "filter": "", "dataChoices": [{ "option": "J111_1" }, { "option": "F157" }], "type": "string", "fromDate": null, "toDate": null, "fromNumber": null, "toNumber": null, "stringExpr": "", "checked": false, "$$id": "y03h", "resizeable": true, "sortable": true, "draggable": true, "canAutoResize": true, "width": 399.5, "$$oldWidth": 150 }, "summaryColumns": [{ "prop": "schedulePeriod", "name": "schedulePeriod", "filter": "", "dataChoices": [{ "option": "20162103" }], "type": "number", "fromDate": null, "toDate": null, "fromNumber": null, "toNumber": null, "stringExpr": "", "checked": false, "$$id": "2j2m", "resizeable": true, "sortable": true, "draggable": true, "canAutoResize": true, "width": 150, "$$oldWidth": 150, "frozenLeft": true, "category": true }, { "prop": "routeNumber", "name": "routeNumber", "filter": "", "dataChoices": [{ "option": "340" }, { "option": "341" }, { "option": "342" }, { "option": "343" }, { "option": "344" }], "type": "number", "fromDate": null, "toDate": null, "fromNumber": null, "toNumber": null, "stringExpr": "", "checked": false, "$$id": "t8s6", "resizeable": true, "sortable": true, "draggable": true, "canAutoResize": true, "width": 150, "$$oldWidth": 150, "frozenLeft": true, "category": true }, { "prop": "J111_1", "name": "J111_1", "$$id": "rk9t", "resizeable": true, "sortable": true, "draggable": true, "canAutoResize": true, "width": 150, "$$oldWidth": 150 }, { "prop": "F157", "name": "F157", "$$id": "s2x2", "resizeable": true, "sortable": true, "draggable": true, "canAutoResize": true, "width": 150, "$$oldWidth": 150 }, { "prop": "total", "name": "TOTAL", "headerClass": "total", "cellClass": "total", "frozenRight": true, "$$id": "vbo6", "resizeable": true, "sortable": true, "draggable": true, "canAutoResize": true, "width": 150, "$$oldWidth": 150 }], "summaryRows": [], "summaryRowGroups": { "schedulePeriod:20162103|routeNumber:340|": { "grandTotal": 0, "groupNames": ["schedulePeriod", "routeNumber"], "columnName": "seriesMapName", "groupValues": [{ "field": ["schedulePeriod"], "value": "20162103" }, { "field": ["routeNumber"], "value": 340 }], "columnValues": { "J111_1": 1, "total": 0, "F157": 0 } }, "schedulePeriod:20162103|routeNumber:341|": { "grandTotal": 0, "groupNames": ["schedulePeriod", "routeNumber"], "columnName": "seriesMapName", "groupValues": [{ "field": ["schedulePeriod"], "value": "20162103" }, { "field": ["routeNumber"], "value": 341 }], "columnValues": { "J111_1": 1, "total": 0, "F157": 0 } }, "schedulePeriod:20162103|routeNumber:342|": { "grandTotal": 0, "groupNames": ["schedulePeriod", "routeNumber"], "columnName": "seriesMapName", "groupValues": [{ "field": ["schedulePeriod"], "value": "20162103" }, { "field": ["routeNumber"], "value": 342 }], "columnValues": { "J111_1": 1, "total": 0, "F157": 0 } }, "schedulePeriod:20162103|routeNumber:343|": { "grandTotal": 0, "groupNames": ["schedulePeriod", "routeNumber"], "columnName": "seriesMapName", "groupValues": [{ "field": ["schedulePeriod"], "value": "20162103" }, { "field": ["routeNumber"], "value": 343 }], "columnValues": { "J111_1": 0, "total": 0, "F157": 1 } }, "schedulePeriod:20162103|routeNumber:344|": { "grandTotal": 0, "groupNames": ["schedulePeriod", "routeNumber"], "columnName": "seriesMapName", "groupValues": [{ "field": ["schedulePeriod"], "value": "20162103" }, { "field": ["routeNumber"], "value": 344 }], "columnValues": { "J111_1": 0, "total": 0, "F157": 1 } } }, "csvSummaryName": "routeInformation-seriesMapName_by_schedulePeriod-routeNumber-summary" }, { "name": "summary-1", "summaryRowFields": [], "summaryColumnField": { "name": "" }, "summaryColumns": [], "summaryRows": [], "summaryRowGroups": {}, "csvSummaryName": "" }] }] }]



  constructor(
    private ServerProperties: ServerInfo,
    private dialog: MatDialog,
    private globalActivityEffects: GlobalActivityEffectService
  ) {

  }

  ngOnDestroy() {
    this.cellSubscription.unsubscribe()
  }

  ngOnInit() {
    this.currentDataSource = this.dataSources[0]
    this.currentDatasourceIndex = 0
    this.currentViewIndex = 0
    this.dashboardColumns = [
      { headerName: "Name", field: "name", minWidth: 30 },
      { headerName: "User Id", field: "userId", minWidth: 30 },
      { field: "actions", cellRendererFramework: ActionsCellComponent, supressFilter: true, cellStyle: { 'border': '0' } }
      // { field: "Live summaries", cellRendererFramework: FeedsCellComponent, supressFilter: true, cellStyle: { 'border': '0' }, width: 800 }
    ]

    this.cellSubscription = ActionsCellComponent.onAction
      .subscribe((data) => {
        console.log(data)
        if (data.action === 'delete') {
          this.deleteDashboard(data)
        }

      })

    // this.feedCellSubscription = FeedsCellComponent.onUpdate
    //   .subscribe((data) => {
    //     console.log(data)
    //   })

    this.getDashboards()

    this.gridOptions.getRowHeight = (params) => {
      return 50 // + (params.data.liveSummaryCount * 300)
    }

    this.gridOptions.onRowClicked = (params) => {
      this.selectedDashboard = JSON.parse(params.data.configuration)
      this.selectedDashboardName = params.data.name
    }

    // Execute update on first entry
    this.globalActivityEffects.setActivity(ActivityType.Progress, 'Getting latest data..')
    let url = fetch(this.ServerProperties.URL() + 'update', { credentials: 'include', method: 'POST', body: "[]" }).then(response => response.json()).then(response => {
      this.globalActivityEffects.setNoActivity()
      if(response.error){
        throw(response.error)
      }
    }).catch(e => {
      // Unable to update
      this.openDialog({ icon: 'fa-warning', message: 'Unable to update to latest data', text: e, type: 'notify' })
      this.globalActivityEffects.setNoActivity()
    })

  }

  createDashboard() {
    let url = this.ServerProperties.URL() + 'reportConfiguration/' + this.dashboardName
    fetch(url, { credentials: 'include', method: 'POST', body: "[]" }).then(response => response.json()).then(response => {
      this.getDashboards()
    }).catch(e => {

    })
  }

  getDashboards() {

    this.globalActivityEffects.setActivity(ActivityType.Progress, 'Loading dashboards..')

    let promises = []
    let url = this.ServerProperties.URL() + 'reportConfiguration'
    fetch(url, { credentials: 'include' }).then(response => response.json()).then(response => {

      this.dashboards = response
      // this.dashboards[0].configuration = this.dataSources

      // Process configuration column

      let views = ''
      let summaries = ''
      this.dashboards.forEach((report, index) => {
        let x = 1
        let datasources = []
        let json
        try {
          report.liveSummaryCount = this.getLiveSummaryCount(report)
          report.crud = report
        } catch (e) {
          //Bad JSON
          this.openDialog({ icon: 'fa-warning', message: 'Dashboard cannot load', text: 'Dashboard ' + report.name + ' is not valid!', type: 'notify' })
          report.details = { datasources: [], views: [], summaries: [] }
          report.configuration = '[]'
          report.crud = report
        }
      })

      this.gridOptions.api.resetRowHeights();
      this.globalActivityEffects.setNoActivity()

    }).catch(e => {
      this.openDialog({ icon: 'fa-warning', message: 'Dashboards cannot load', text: e.message, type: 'notify' })
      this.globalActivityEffects.setNoActivity()
    })
  }

  getLiveSummaryCount(report) {
    let liveSummaries = 0
    JSON.parse(report.configuration).forEach(datasource => {
      datasource.views.forEach(view => {
        liveSummaries += view.summaries.filter(summ => summ.feed.liveFeed == true).length
      })
    })
    return liveSummaries
  }

  detailHeight(row) {
    return 3 * 30
  }

  canDelete(dashboard) {
    // return dashboard.details.datasources.length === 0 && dashboard.details.views.length === 0 && dashboard.details.summaries.length === 0
  }

  deleteDashboard(dashboard) {
    this.openDialog({
      type: 'question',
      message: 'Delete ' + dashboard.params.name + ' dashboard?',
      icon: 'fa-warning',
      text: 'You will lose all datasources, views and summary reports!'
    }).subscribe(result => {
      if (result == 'true') {
        let x = 1
        fetch(this.ServerProperties.URL() + 'reportConfiguration/' + dashboard.params.name,
          { method: 'DELETE', credentials: 'include' }).then(response => this.getDashboards())
      }
    })
  }

  openDialog(config): Observable<any> {
    let dialogRef = this.dialog.open(Dialog, {
      data: config
    });

    return dialogRef.afterClosed()
  }

  ngOnChanges(changes) {
    console.info(changes)
  }

  ngAfterViewInit() {

  }
}
// [disabled]="!canDelete(params.data)" 
@Component({
  selector: 'actions-cell-component',
  template: `
    <button mat-mini-fab [matTooltip]="'Edit ' + params.data.name" [queryParams]="params.data.crud" [routerLink]="'/dashboard/' + params.data.name + '/' + params.data.userId">
        <span class="fa fa-pencil"></span>
    </button>
    <button mat-mini-fab matTooltip="Delete" (click)="deleteDashboard(params.data.name)">
        <span class="fa fa-trash"></span>
    </button>
    <button mat-mini-fab matTooltip="Your feeds" [routerLink]="'/yourFeeds/' + params.data.name" [queryParams]="params.data.crud">
        <span class="fa fa-feed"></span>
    </button>
  `
})
export class ActionsCellComponent implements AgRendererComponent {
  params: any;
  dashboard

  static onAction = new EventEmitter()

  constructor(
    private serverInfo: ServerInfo,
    private dialog: MatDialog
  ) {

  }

  agInit(params: any): void {
    try {
      this.params = params
      this.dashboard = JSON.parse(this.params.data.configuration)
    } catch (e) { }
  }
  canDelete() {
    // return !this.params.data.details.dashboard.datasources.length
  }

  deleteDashboard() {
    ActionsCellComponent.onAction.emit({ action: 'delete', params: this.params.data })
  }

  refresh() {
    return false
  }

}

