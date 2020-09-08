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

import { ActivatedRoute } from '@angular/router'

import * as Chart from 'chart.js'

const template = require('./YourFeeds.component.html')

@Component({
  selector: 'your-feeds-component',
  template: './YourFeeds.component.html'
})

export class YourFeedsComponent implements OnInit, AfterViewInit {


  selectedDashboardName: String
  selectedDashboard
  name
  userId

  constructor(
    private route: ActivatedRoute,
    private serverInfo: ServerInfo,
    private dialog: MatDialog,
    private globalActivityEffects: GlobalActivityEffectService
  ) {
    this.route.params.subscribe(p => {
      this.selectedDashboardName = p.selectedDashboardName
    })
    this.route.queryParams.subscribe(qp => {
      this.selectedDashboard = JSON.parse(qp.configuration)
      this.userId = qp.userId
    })

  }

  ngOnInit() {


  }

  ngAfterViewInit() {

  }



}