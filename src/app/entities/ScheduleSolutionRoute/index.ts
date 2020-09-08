import entitySpec from './fields'
import { makeResourceService, EntityMeta, EntityName, IResource, Resource, Uri, ActionUri, Action } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IScheduleSolutionRoute } from './interface'

const { fieldNames } = entitySpec
const scheduleSolutionUri = `scheduleSolutionRoutes/:${fieldNames.scheduleSolutionName}/:${fieldNames.scheduleScopeName}/:${fieldNames.schedulePeriod}/:${fieldNames.routeNumber}`

@EntityName('ScheduleSolutionRoute')
@EntityMeta(entitySpec)
@Uri(scheduleSolutionUri)
class ScheduleSolutionRouteResource extends Resource<IScheduleSolutionRoute> {
  meta = entitySpec

  @ActionUri(`scheduleScopes/:${fieldNames.scheduleScopeName}/:${fieldNames.schedulePeriod}/reset/:${fieldNames.routeNumber}`)
  @Action('PUT')
  resetRoute (response: Response) {
    return response
  }
}

interface IScheduleSolutionRouteResource extends IResource<IScheduleSolutionRoute> {
  /**
   * Resets schedule solution route and slots
   */
  resetRoute: (solutionRoute: IScheduleSolutionRoute) => Promise<Response>
}

/**
 * @description
 * Provides a Resource Service class for access to ScheduleSolutionRoute (for a schedule scope).
 */
@Injectable()
export class ScheduleSolutionRouteService extends makeResourceService<ScheduleSolutionRouteResource, IScheduleSolutionRouteResource>(ScheduleSolutionRouteResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
