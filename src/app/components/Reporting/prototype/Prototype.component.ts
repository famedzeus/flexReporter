import { AfterViewInit, Component, Inject, Injectable, Input, Output, OnInit, Pipe, PipeTransform, EventEmitter, ViewChild } from '@angular/core'
import { FormControl} from '@angular/forms'
import { cloneDeep } from 'lodash'
import { IFlexReport, IFlexDataSource, IFlexSummary } from '../../core/FlexReporter'


const template = require('./Prototype.component.html')
require('../Reporting.scss')



/**
 * @description
 * Simple flex reporter
 */
@Component({
  selector: 'c-reporting',
  template: './Prototype.component.html'
})
export class PrototypeComponent implements OnInit, AfterViewInit {
  
  @ViewChild('shopLines') reportTemplate

  selecteddataSource:IFlexDataSource
  selecteddataSourceFields:Array<any>
  selecteddataSourceField:String
  selectedDisplayName:String
  selectedSourceField:String
  selectedDestField:String
  joinRequired:boolean = false

  toppings
  toppingsList
  limit = 10
    
  // A few default flex dataSources
  // flexDataSources:Array<IFlexDataSource> = [
  //   {name:'Shop Lines',service:'shopLines',limit:10,dataSet:[]},
  //   {name:'Lines',service:'lines',limit:10,dataSet:[]}
  //   // {name:'Shops',service:'shops',limit:50,dataSet:[]},
  //   // {name:'Destinations',service:'destinations',limit:500,dataSet:[]}
  // ]
  schedulesdataSource = {name:"Schedules",service:"schedules",fields:['shiftCode','weekCode','scheduleDate'],limit:500,dataSet:[]}
  scheduleFields = [
  ]
  workingPeriodsdataSource = {name:"Working periods",service:"workingPeriods",fields:['shiftCode','weekCode','totalSeconds'],limit:500,dataSet:[]}
  workingPeriodsFields = [
  ]

  flexReports:Array<IFlexReport> = []
  
  constructor () {

  }

  ngOnInit () {
    // // Define a flex report
    let fields = [{fieldName:'calendarCode',displayName:'Calendar code'},
                  {fieldName:'lineId',displayName:'Line id'},
                  {fieldName:'name',displayName:'Line Name',join:{sourceField:'lineId',destdataSourceIndex:1,destField:'id'}},
                  {fieldName:'buildOrder',displayName:'Build order'},
    ]
    

    this.flexReports.push({name:'Shop lines',
                           keydataSourceIndex:0,
                           flexDataSources:[{name:'Shop Lines',service:'shopLines',fields:['calendarCode','buildOrder','lineId'],limit:10,dataSet:[]},
                                       {name:'Lines',service:'lines',fields:['id','name'],limit:10,dataSet:[]}],
                           template: this.reportTemplate, fields:fields, summary:{columns:[],rows:[],rowTotal:0,columnTotal:0} })
    
    this.flexReports.push({name:'Schedules',keydataSourceIndex:0,flexDataSources:[this.schedulesdataSource,this.workingPeriodsdataSource],
                          template:this.reportTemplate,fields:this.scheduleFields, summary:{columns:[],rows:[],rowTotal:0,columnTotal:0}})

    this.toppings = new FormControl();

    this.toppingsList = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  }

  ngOnChanges (changes) {
    console.info(changes)
  }

  ngAfterViewInit () {

  }

  dataSource(name){
    //  return this.flexDataSources.findIndex(dataSource => dataSource.name === name)
  }

  getdataSourceNameByIndex(reportName,index){
    let report = this.flexReports.find(report => report.name === reportName)
    return report.flexDataSources[index].name
  }

  getData(dataSet,key,fieldName,displayName){
    let data = dataSet.find(rec => rec[fieldName] == key)
    return data[displayName]
  }

  deleteDisplayField(reportName,reportField){
    let report = this.flexReports.find(report => report.name === reportName)
    let index = report.fields.findIndex(field => field.fieldName == reportField.fieldName)
    report.fields.splice(index,1)
  }

  addDisplayField(reportName){
    let report = this.flexReports.find(report => report.name === reportName)
    let field = {fieldName:this.selecteddataSourceField,displayName:this.selectedDisplayName}
    if(this.joinRequired){
      Object.assign(field,{join:{sourceField:this.selectedSourceField,destdataSourceIndex:1,destField:this.selectedDestField}})
    }
    report.fields.push(field)
  }

  updatedataSourceFields(flexReport){
    this.selecteddataSourceFields = this.selecteddataSource.fields
    this.selecteddataSourceField = this.selecteddataSourceFields[0]
    this.joinRequired = this.selecteddataSource.name != this.getdataSourceNameByIndex(flexReport.name,flexReport.keydataSourceIndex)
  }

}

