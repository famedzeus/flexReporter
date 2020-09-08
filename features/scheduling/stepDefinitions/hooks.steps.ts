import 'isomorphic-fetch'
import { once } from 'lodash'
import { ScheduleScopeService } from '../../../src/app/entities/ScheduleScope'
import { AttributeService } from '../../../src/app/entities/Attribute'
import { FeatureService } from '../../../src/app/entities/Feature'
import { CarSeriesService } from '../../../src/app/entities/CarSeries'
import { LineMapService } from '../../../src/app/entities/LineMap'
import { HttpHelper } from '../../../src/app/services/http'
import { ServerInfo } from '../../../src/app/services/ServerInfo'
import { attribute, scheduleScope, lineMap,
  carSeries, feature } from './config'

declare var module

const http = new HttpHelper(null, new ServerInfo())
const ScheduleScope: any = new ScheduleScopeService(http)
const Attribute: any = new AttributeService(http)
const CarSeries: any = new CarSeriesService(http)
const Feature: any = new FeatureService(http)
const LineMap: any = new LineMapService(http)

module.exports = function() {

  const logAsyncCall = async (entityName, method, key, cb) => {
    console.info(`Attempting to ${method} ${entityName} ${key}`)
    await cb()
    console.info(`${entityName} ${key} ${method}d successfully`)
  }
  let newLineMap // Storing lineMap for auto id reference
  this.registerHandler('BeforeFeatures', async () => {
    try {
      await logAsyncCall('Line Map', 'create', '<generated key>', () => LineMap.save({}, lineMap).then(lineMap => newLineMap = lineMap))
      await logAsyncCall('Schedule Scope', 'create', scheduleScope.scheduleScopeName, () => ScheduleScope.save({}, scheduleScope))
      await logAsyncCall('Attribute', 'create', attribute.attributeName, () => Attribute.save(scheduleScope, attribute))
      await logAsyncCall('Car Series', 'create', carSeries.carSeriesCode, () => CarSeries.save({}, carSeries))
      await logAsyncCall('Feature', 'create', feature.featureCode, () => Feature.save(feature, feature))

    } catch (e) {
      console.info(e)
      throw new Error(e)
    }
  })

  this.registerHandler('AfterFeatures', async () => {
    try {
      await logAsyncCall('Attribute', 'delete', attribute.attributeName, () => Attribute.delete(attribute))
      await logAsyncCall('Schedule Scope', 'delete', scheduleScope.scheduleScopeName, () => ScheduleScope.delete(scheduleScope))
      await logAsyncCall('Feature', 'delete', feature.featureCode, () => Feature.delete(feature))
      await logAsyncCall('Car Series', 'delete', carSeries.carSeriesCode, () => CarSeries.delete(carSeries))
      await logAsyncCall('Line Map', 'delete', newLineMap.lineMapVersion, () => LineMap.delete(newLineMap))
    } catch (e) {
      console.info(e)
      throw new Error(e)
    }

  })
}