import { AfterViewInit, Component, Inject, Injectable, Input, Output, OnInit, Pipe, PipeTransform, EventEmitter, ViewChild } from '@angular/core'
import { FormControl} from '@angular/forms'
import { cloneDeep } from 'lodash'
import { IFlexReport, IFlexDataSource } from '../../core/FlexReporter'

const template = require('./Generate.component.html')
require('../Reporting.scss')

/**
 * @description
 * Simple flex reporter
 */
@Component({
  selector: 'c-generate-report',
  template: './Generate.component.html'
})
export class GenerateComponent implements OnInit, AfterViewInit {
  
  
  constructor () {
  }

  ngOnInit () {

  }

  ngOnChanges (changes) {
    console.info(changes)
  }

  ngAfterViewInit () {

  }



}
