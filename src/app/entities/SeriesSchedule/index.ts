import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName, ResourceMethod, ResourceMethodQuery, SuppressErrors,
         SuppressSuccessAlert, IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { ISeriesSchedule } from './interface'

const { fieldNames } = entitySpec

const seriesSchedulesUrl = 'seriesSchedules'
const seriesScheduleUrl = `${seriesSchedulesUrl}/:${fieldNames.shiftCode}/:${fieldNames.seriesMapName}`
const allocateSeriesUrl = `${seriesSchedulesUrl}/:${fieldNames.shiftCode}/allocateSeries`

@EntityName('SeriesSchedule')
@EntityMeta(entitySpec)
@Uri(seriesScheduleUrl)
class SeriesScheduleResource extends Resource<ISeriesSchedule> {
  meta = entitySpec

  @ActionUri(seriesSchedulesUrl)
  @Action('POST')
  save (response: Response) {
    return super.save(response)
  }

  @ActionUri(`${allocateSeriesUrl}/lineVolumes`)
  @Action('GET')
  getOfflineVolumeCounts (response: Response) {
    return response.json()
  }

  @SuppressErrors([409])
  @ActionUri(`${allocateSeriesUrl}/byBatch/preCheck`)
  @Action('GET')
  precheckAllocateSeriesByBatch (response: Response) {
    return response
  }

  @SuppressSuccessAlert()
  @ActionUri(`${allocateSeriesUrl}/byBatch`)
  @Action('POST')
  allocateSeriesByBatch (response) {
    return response
  }

  @SuppressSuccessAlert()
  @ActionUri(`${allocateSeriesUrl}/byBatch/allocateElt`)
  @Action('POST')
  allocateSeriesByBatchAndELT (response) {
    return response
  }

  @SuppressErrors([409])
  @ActionUri(`${allocateSeriesUrl}/byGroupRatio/preCheck`)
  @Action('GET')
  precheckAllocateSeriesByGroupRatio (response: Response) {
    return response
  }

  @SuppressSuccessAlert()
  @ActionUri(`${allocateSeriesUrl}/byGroupRatio/:seriesMapGroupPatternName`)
  @Action('POST')
  allocateSeriesByGroupRatio (response) {
    return response
  }

  @SuppressSuccessAlert()
  @ActionUri(`${allocateSeriesUrl}/byGroupRatio/:seriesMapGroupPatternName/allocateElt`)
  @Action('POST')
  allocateSeriesByGroupRatioAndELT (response) {
    return response
  }

  @SuppressErrors([409])
  @ActionUri(`${allocateSeriesUrl}/byRatio/preCheck`)
  @Action('GET')
  precheckAllocateSeries (response: Response) {
    return response
  }

  @SuppressSuccessAlert()
  @ActionUri(`${allocateSeriesUrl}/byRatio`)
  @Action('POST')
  allocateSeriesByRatio (response) {
    return response
  }

  @SuppressSuccessAlert()
  @ActionUri(`${allocateSeriesUrl}/byRatio/allocateElt`)
  @Action('POST')
  allocateSeriesByRatioAndELT (response) {
    return response
  }

  @SuppressSuccessAlert()
  @ActionUri(`${allocateSeriesUrl}/reset`)
  @Action('PUT')
  resetSeriesAllocation (response: Response) {
    return super.update(response)
  }
}

interface ISeriesScheduleResource extends IResource<ISeriesSchedule> {
  precheckAllocateSeries: ResourceMethod<void>
  precheckAllocateSeriesByBatch: ResourceMethod<void>
  precheckAllocateSeriesByGroupRatio: ResourceMethod<void>
  allocateSeriesByRatio: ResourceMethod<void>
  allocateSeriesByBatch: ResourceMethod<void>
  allocateSeriesByGroupRatio: ResourceMethod<void>
  allocateSeriesByRatioAndELT: ResourceMethod<void>
  allocateSeriesByBatchAndELT: ResourceMethod<void>
  allocateSeriesByGroupRatioAndELT: ResourceMethod<void>
  resetSeriesAllocation: ResourceMethod<void>
  getOfflineVolumeCounts: ResourceMethod<Array<{ lineId: string, count: number }>>
}

/**
 * @description
 * Provides a ResourceService for access to SeriesSchedule.
 */
@Injectable()
export class SeriesScheduleService extends makeResourceService<SeriesScheduleResource, ISeriesScheduleResource>(SeriesScheduleResource) {
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
