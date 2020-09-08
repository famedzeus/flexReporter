import entitySpec from './fields'
import { makeResourceService, EntityMeta, ActionUri, Action, EntityName,
         ResourceMethod, IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { UserAuth } from '../../components/Auth/user-auth'
import { HttpHelper } from '../../services/http'
import { IScheduleScope } from './interface'
import { ITask } from '../Task'
const { fieldNames } = entitySpec

const scheduleScopeUri = `scheduleScopes/:${fieldNames.scheduleScopeName}`

@EntityName('ScheduleScope')
@EntityMeta(entitySpec)
@Uri(scheduleScopeUri)
class ScheduleScopeResource extends Resource<IScheduleScope> {
  meta = entitySpec
  @ActionUri(`scheduleScopes`)
  save (r: Response) {
    return super.save(r)
  }

  @Action('PUT')
  @ActionUri(`${scheduleScopeUri}/initialise`)
  initialise (response: Response) {
    return response
  }

  @Action('GET')
  @ActionUri(`${scheduleScopeUri}/tasks`)
  getTasks (r: Response) {
    return r.json()
  }
}

interface IScheduleScopeResource extends IResource<IScheduleScope> {
  initialise: ResourceMethod<Response>
  getTasks: (params) => Promise<Array<ITask>>
}

/**
 * @description
 * Provides a Resource for access to ScheduleScope
 */
@Injectable()
export class ScheduleScopeService extends makeResourceService<ScheduleScopeResource, IScheduleScopeResource>(ScheduleScopeResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
