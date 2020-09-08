import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName, ResourceMethod, ResourceMethodQuery,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IRoute } from './interface'

const { fieldNames } = entitySpec

@EntityName('Route')
@EntityMeta(entitySpec)
@Uri(`routes/:${fieldNames.schedulePeriod}/:${fieldNames.routeNumber}`)
class RouteResource extends Resource<IRoute> {
  meta = entitySpec

  @ActionUri('routes')
  @Action('POST')
  save (response) {
    return super.save(response)
  }

  @ActionUri('routes')
  @Action('PUT')
  updateList (response) {
    return super.update(response)
  }

  @ActionUri('routes/statuses')
  getStatuses (response) {
    return super.query(response)
  }

}

interface IRouteResource extends IResource<IRoute> {
  getStatuses: ResourceMethodQuery<string>
  updateList: (params, routes: Array<IRoute>) => Promise<void>
}

/**
 * @description
 * Provides a $resource for access to Route (for a schedule scope).
 */
@Injectable()
export class RouteService extends makeResourceService<RouteResource, IRouteResource>(RouteResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
