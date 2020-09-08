import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName, ResourceMethod,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IWorkingPeriod } from './interface'

const { fieldNames } = entitySpec

@EntityName('WorkingPeriod')
@EntityMeta(entitySpec)
@Uri(`workingPeriods/:${fieldNames.id}`)
class WorkingPeriodResource extends Resource<IWorkingPeriod> {
  meta = entitySpec

  @ActionUri(`schedules/:${fieldNames.shiftCode}/:${fieldNames.calendarCode}/workingPeriods`)
  @Action('GET')
  getBySchedule (response: Response) {
    return response.json()
  }

}

interface IWorkingPeriodResource extends IResource<IWorkingPeriod> {
  getBySchedule: ResourceMethod<Array<IWorkingPeriod>>
}

/**
 * @description
 * Provides a ResourceService for access to WorkingPeriod.
 */
@Injectable()
export class WorkingPeriodService extends makeResourceService<WorkingPeriodResource, IWorkingPeriodResource>(WorkingPeriodResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
