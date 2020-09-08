import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, MockUri, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IScheduleSolutionSlot, ISolutionSlotSummary } from './interface'

const { fieldNames } = entitySpec
const scheduleSolutionUri = `scheduleSolutionSlots/:${fieldNames.slotId}/:${fieldNames.scheduleSolutionName}/:${fieldNames.scheduleScopeName}/:${fieldNames.schedulePeriod}/:${fieldNames.routeNumber}`

@EntityName('ScheduleSolutionSlot')
@EntityMeta(entitySpec)
@Uri(scheduleSolutionUri)
class ScheduleSolutionSlotResource extends Resource<IScheduleSolutionSlot> {
  meta = entitySpec

  @ActionUri(`scheduleSolutionSlots`)
  @Action('POST')
  save (response) {
    return super.save(response)
  }

  @ActionUri(`results/:zoneCode`)
  @MockUri()
  @Action('GET')
  getSolutionSlotDetails (response) {
    return response.json()
  }

  @ActionUri(`scheduleSolutions/:${fieldNames.scheduleSolutionName}/:${fieldNames.scheduleScopeName}/zoneSummary/:zoneCode`)
  @Action('GET')
  getSummary (response) {
    return response.json()
  }
}

interface IScheduleSolutionSlotResource extends IResource<IScheduleSolutionSlot> {
  getSolutionSlotDetails
  getSummary: (params: any) => Promise<Array<ISolutionSlotSummary>>
}

/**
 * @description
 * Provides a Resource Service class for access to ScheduleSolutionRoute (for a schedule scope).
 */
@Injectable()
export class ScheduleSolutionSlotService extends makeResourceService<ScheduleSolutionSlotResource, IScheduleSolutionSlotResource>(ScheduleSolutionSlotResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
