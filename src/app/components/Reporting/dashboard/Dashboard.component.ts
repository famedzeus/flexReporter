import { AfterViewInit, Component, Inject, Injectable, Input, Output, OnInit, Pipe, PipeTransform, EventEmitter, ViewChild, TemplateRef } from '@angular/core'
import { Router } from '@angular/router'
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs/Observable'
import { cloneDeep } from 'lodash'
import { ActivatedRoute } from '@angular/router'
// import { IFlexReport, IFlexDataSource } from '../../core/FlexReporter'
import { ServerInfo } from '../../../services/ServerInfo'
import { MatDialog, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Http, RequestOptions, Headers } from '@angular/http'
import { HttpHelper } from '../../../services/http'
import { Dialog } from '../dialogues/dialogues.component'
const template = require('./Dashboard.component.html')
import config from 'app-config'

/**
 * @description
 
 */
@Component({
  selector: 'c-dashboard',
  template: './Dashboard.component.html',
  styleUrls: ['../Reporting.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  nameObs: Observable<string>
  userIdObs: Observable<string>
  name: string
  userId: string
  datasources
  headers
  options: RequestOptions
  appConfig = config

  currentDataSource
  currentDatasourceIndex
  currentViewIndex
  currentSummaryIndex
  url = ''
  summaryFeeds
  changeMade = false

  constructor(
    private route: ActivatedRoute,
    private ServerProperties: ServerInfo,
    private http: HttpHelper,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.route.params.subscribe(p => {
      this.name = p.name
      this.userId = p.userId
    })
    this.route.queryParams.subscribe(qp => {
      this.datasources = JSON.parse(qp.configuration)
    })

  }

  ngOnInit() {
    // Invoke first datasource and it's first view
    this.currentDataSource = this.datasources[0]
    this.currentDataSource.views[0].init = true

  }

  changesMade() {
    this.changeMade = true
  }

  saveChanges() {
    let x = 1
    let url = this.ServerProperties.URL() + 'reportConfiguration/' + this.name

    let promises = []

    fetch(url, { credentials: 'include', method: 'PUT', body: this.prepareDatasourcesForSave() }).then(response => {
      this.openDialog({ message: 'Saved ' + this.name + ' dashboard.', type: 'notify' })
      this.changeMade = false
    }).catch(e => {
      this.openDialog({ message: e })
    })

    this.summaryFeeds = new Observable(this.updateSummaryFeeds)

    // this.http.put(this.ServerProperties.URL() + 'reportConfiguration',{}).subscribe(response => {
    //   console.log(response)
    // })
  }

  prepareDatasourcesForSave() {
    let dataSources = cloneDeep(this.datasources)
    dataSources.forEach(ds => {
      ds.views.forEach(vw => {
        vw.active = false
        vw.summaries.forEach(summary => {
          // Remove un-needed properties for save
          delete summary.selectedSummaryRowFields
          delete summary.selectedSummaryColumnFields
          delete summary.feed.selectedFeedDateField
          delete summary.summaryRows
          delete summary.summaryColumns
          delete summary.summaryRowGroups
        })
      })
    })
    return JSON.stringify(dataSources)
  }

  ngOnChanges(changes) {
    // console.info(changes)
  }

  ngAfterViewInit() {

  }

  openDialog(config): Observable<any> {
    let dialogRef = this.dialog.open(Dialog, {
      data: config
    });

    return dialogRef.afterClosed()
  }

  setSelectedDataSource(tab) {
    this.currentDataSource = this.datasources[tab.index]
    this.currentDatasourceIndex = tab.index
    this.url = this.ServerProperties.URL() + this.datasources[tab.index].endpoint
    this.activateView({ index: 0 })
  }

  activateView(tab) {
    if (this.currentDataSource.views[tab.index]) {
      this.currentDataSource.views[tab.index].active = !this.currentDataSource.views[tab.index].active
    }
  }

  addDatasource() {
    this.datasources.push({ archive: false, endpoint: '', name: 'datasource-' + this.datasources.length, views: [] })
    this.currentDatasourceIndex = this.datasources.length - 1
    this.url = this.ServerProperties.URL() + this.datasources[this.datasources.length - 1].endpoint
  }

  deleteDatasource(datasource) {
    this.openDialog({
      message: 'Delete ' + datasource.name + ' datasource?',
      icon: 'fa-database',
      type: 'question',
      text: 'You will lose any view and summary reports!'
    }).subscribe(result => {
      if (result == 'true') {
        let ds = this.datasources.findIndex(d => d.name === datasource.name)
        this.datasources.splice(ds, 1)
        if (ds > 0) {
          this.currentDataSource = this.datasources[ds - 1]
          this.currentDatasourceIndex--
          this.url = this.ServerProperties.URL() + this.datasources[ds - 1].endpoint
        }
      }
    })
  }

  duplicateDatasource(datasource) {
    this.datasources.push(cloneDeep(datasource))
    this.currentDatasourceIndex = this.datasources.length - 1
    this.datasources[this.datasources.length - 1].name += '-' + String(this.datasources.length - 1)
    this.url = this.ServerProperties.URL() + this.datasources[this.datasources.length - 1].endpoint
  }

  addView(datasource) {
    datasource.views.push({ name: 'view-' + datasource.views.length, active: true, summaries: [], selectedFields: [], fieldCustomisations: [], recordLimit: 100 })
    this.currentViewIndex = datasource.views.length - 1
    this.currentDataSource = datasource
    this.activateView({ index: this.currentViewIndex })
  }

  duplicateView(datasource, view) {
    datasource.views.push(cloneDeep(view))
    this.currentViewIndex = datasource.views.length - 1
    datasource.views[datasource.views.length - 1].name += '-' + String(datasource.views.length - 1)
  }

  deleteView(datasource, view) {
    this.openDialog({
      message: 'Delete ' + view.name + ' view?',
      icon: 'fa-file',
      type: 'question',
      text: 'You will lose any summary reports!'
    }).subscribe(result => {
      if (result == 'true') {
        let viewIndex = datasource.views.findIndex(v => v.name === view.name)
        datasource.views.splice(viewIndex, 1)
      }
    })
  }

  onError(error) {
    this.openDialog({ message: error.error, type: 'notify' }).subscribe(result => {
      if (result == 'true') {

      }
    })
  }

  addSummary($event) {
    $event.view.summaries.push({
      name: 'summary-' + $event.view.summaries.length,
      summaryRowFields: [],
      summaryColumnField: { name: '' },
      summaryColumns: [],
      summaryRows: [],
      summaryRowGroups: {},
      csvSummaryName: '',
      regenerate: false,
      selectedSummaryRowFields: new FormControl({ value: [] }),
      selectedSummaryColumnFields: new FormControl(""),
      feed: {
        liveFeed: false,
        selectedFeedDateField: new FormControl(""),
        feedDateField: '',
        refreshHours: 24,
        lastRefresh: 0,
        liveFeedObserver: new Observable()
      }
    })

    this.currentSummaryIndex = $event.view.summaries.length - 1
  }

  deleteSummary($event) {
    this.openDialog({
      message: 'Delete ' + $event.summary.name + ' summary?',
      icon: 'fa-signal',
      type: 'question',
      text: 'You will lose your summary report!'
    }).subscribe(result => {
      if (result == 'true') {
        let summaryIndex = $event.view.summaries.findIndex(s => s.name === $event.summary.name)
        $event.view.summaries.splice(summaryIndex, 1)
      }
    })
  }

  duplicateSummary($event) {
    $event.view.summaries.push(cloneDeep($event.summary))
    this.currentSummaryIndex = $event.view.summaries.length - 1
    $event.view.summaries[$event.view.summaries.length - 1].name += '-' + String($event.view.summaries.length - 1)
  }

  updateSummaryFeeds(observer) {
    this.datasources.forEach(ds => {
      ds.views.forEach(vw => {
        vw.active = false
        vw.summaries.forEach(summary => {

        })
      })
    })
  }

}

