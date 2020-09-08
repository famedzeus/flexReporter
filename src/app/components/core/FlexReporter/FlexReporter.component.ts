import { Component, Inject, Injectable, Input, Output, OnInit, Pipe, PipeTransform, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core'
import { FlexReporter, IFlexDataSource, IFlexReport } from './FlexReporter.service'

const template = require('./FlexReporter.component.html')
require('./FlexReporter.scss')

/**
 * @description
 * Simple flex reporter
 */
@Component({
  selector: 'c-flex-reporter',
  template: './FlexReporter.component.html'
})
export class FlexReporterComponent implements OnInit {
  @Input() name
  @Input() flexReport:IFlexReport
  // @Input() flexDataSources:Array<IFlexDataSource>

  @ViewChild('container', {
    read: ViewContainerRef
   }) container

  constructor (
      private FlexReporter : FlexReporter
    ) {
  }

  ngOnInit () {
  }

  ngOnChanges (changes) {
    console.info(changes)
    // if (this.flexReport && this.container && changes.flexReport && this.flexReport.template ) {
    //   this.container.createEmbeddedView(this.flexReport.template, { $implicit: { dataSets: this.flexDataSources } })
    // }
  }

  ngAfterViewInit () {
    let x = 1
    this.FlexReporter.querydataSources(this.flexReport, this.flexReport.flexDataSources).then(() => {
      
      if (this.flexReport && this.flexReport.template) {
        this.container.createEmbeddedView(this.flexReport.template, { $implicit: { reportName:this.flexReport.name, 
                                                                                   keydataSourceIndex:this.flexReport.keydataSourceIndex, 
                                                                                   fields:this.flexReport.fields, 
                                                                                   flexDataSources:this.flexReport.flexDataSources } })
      }
    })

    console.info(this.container)
  }


}
