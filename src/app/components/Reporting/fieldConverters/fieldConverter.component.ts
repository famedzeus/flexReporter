import { AfterViewInit, Component, Inject, Injectable, Input, Output, OnInit, Pipe, PipeTransform, EventEmitter, ViewChild, TemplateRef } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs/Observable'
import { cloneDeep } from 'lodash'
import { ActivatedRoute } from '@angular/router'
import { MaterialModule } from '../../app/Material.module'
import { FieldConverter } from './fieldConverter.service'

// import { IFlexReport, IFlexDataSource } from '../../core/FlexReporter'

const template = require('./fieldConverter.component.html')

require('../Reporting.scss')

interface IFieldConverter {
  name: string,
  convertFn: Function
}

/**
 * @description
 
 */
@Component({
  selector: 'c-field-converter',
  template: './fieldConverter.component.html'
})
export class FieldConverterComponent implements OnInit, AfterViewInit {

  @Input() field
  @Output() overrideField = new EventEmitter()
  @Output() converterChanged = new EventEmitter()


  fieldConverters
  private hours = []
  private mins = []
  private secs = []

  constructor(
    private converter: FieldConverter
  ) {

    for (let h = 0; h < 24; h++) {
      this.hours.push(h)
    }
    for (let ms = 0; ms < 59; ms++) {
      this.mins.push(ms)
      this.secs.push(ms)
    }
  }

  ngOnInit() {

    this.fieldConverters = this.converter.getConverters()

  }

  override() {
    if (this.field.customType == 'default') {
      this.converter.getConverter('default').resetFn(this.field)
    }
    this.overrideField.emit({ customType: this.field.customType })
    this.converterChanged.emit()
  }

  ngOnChanges(changes) {
    // console.info(changes)
  }

  ngAfterViewInit() {

  }

  addLookupSegment() {
    this.converter.getConverter(this.field.customType).addFn(this.field)
  }

  deleteLookupSegment(segmentIndex) {
    this.converter.getConverter(this.field.customType).deleteFn(this.field, segmentIndex)
  }

  addSegment() {
    this.converter.getConverter(this.field.customType).addFn(this.field)
  }

  deleteSegment(segmentIndex) {
    this.converter.getConverter(this.field.customType).deleteFn(this.field, segmentIndex)
  }

  addSearchTerm() {
    this.converter.getConverter(this.field.customType).addFn(this.field)
  }

  deleteSearchTerm(segmentIndex) {
    this.converter.getConverter(this.field.customType).deleteFn(this.field, segmentIndex)
  }

  addEntryTime() {
    this.converter.getConverter(this.field.customType).addFn(this.field)
  }

  deleteEntryTime(segmentIndex) {
    this.converter.getConverter(this.field.customType).deleteFn(this.field, segmentIndex)
  }

  changeMade() {
    // this.onChange.emit()
  }

  getConverterDescription(fieldType) {
    let converter = this.converter.getConverters().find(c => c.name == fieldType)
    if (converter) {
      return converter.description
    }
  }

}

