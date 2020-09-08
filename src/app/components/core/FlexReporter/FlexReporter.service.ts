import { Component, Inject, Injectable, Input, Output, OnInit, Pipe, PipeTransform, EventEmitter } from '@angular/core'
import { ServerInfo  } from '../../../services/ServerInfo'

export interface IFlexDataSource {
  name:string,
  service:string,
  fields:Array<string>,
  limit:number,
  dataSet:Array<any>
}
export interface IFlexReport {
  name:string,
  keydataSourceIndex:number,
  flexDataSources:Array<IFlexDataSource>,
  template:string
  fields:Array<any>,
  summary:IFlexSummary
}
export interface IFlexSummary {
  columns:Array<any>,
  rows:Array<any>,
  rowTotal:number,
  columnTotal:number
}

/* Service */
@Injectable()
export class FlexReporter {
  
  constructor (
    private ServerProperties: ServerInfo,
  ) { 

  }

  querydataSources(flexReport:IFlexReport, dataSources:Array<IFlexDataSource>){
    let promises = []
    let resultsList = []
    return new Promise((resolve, reject) => {

      // Get data for each dataSource
      dataSources.forEach(dataSource => {
        let url = this.ServerProperties.URL() + dataSource.service + '?size=' + dataSource.limit
        promises.push(fetch(url).then(response => response.json()))
      })
      
      Promise.all(promises).then(responses => {

        dataSources.forEach((dataSource,index) => {
          dataSource.dataSet = responses[index]
        })

        // Carry out flex report join instruction

        resolve(responses)
      })
    })
  }

}
