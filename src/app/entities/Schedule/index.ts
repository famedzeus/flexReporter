import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, ResourceMethodQuery, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IWorkingPeriod } from '../WorkingPeriod/interface'
import { ISchedule } from './interface'

const { fieldNames } = entitySpec
const schedulesUri = 'schedules'
const queryUri = `${schedulesUri}/:${fieldNames.shiftCode}/:${fieldNames.calendarCode}`

@EntityName('Schedule')
@EntityMeta(entitySpec)
@Uri(queryUri)
class ScheduleResource extends Resource<ISchedule> {
  meta = entitySpec

  @ActionUri(schedulesUri)
  @Action('POST')
  save (response) {
    return super.save(response)
  }

  @Action('GET')
  @ActionUri(`${schedulesUri}/:${fieldNames.shiftCode}`)
  queryByShift (response) {
    return super.query(response)
  }

  @ActionUri(`${queryUri}/workingPeriods`)
  @Action('GET')
  getWorkingPeriods (response) {
    return super.query(response)
  }
}

interface IScheduleResource extends IResource<ISchedule> {
  getWorkingPeriods: ResourceMethodQuery<IWorkingPeriod>
}

/**
 * @description
 * Provides a ResourceService for access to Schedule.
 */
@Injectable()
export class ScheduleService extends makeResourceService<ScheduleResource, IScheduleResource>(ScheduleResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
