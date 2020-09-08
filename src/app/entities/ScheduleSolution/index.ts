import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName, CustomSuccessAlertMessage,
         ResourceMethod, IResource, MockUri, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IScheduleSolution } from './interface'
import { ITask } from '../Task/interface'

const { fieldNames } = entitySpec
const scheduleSolutionUri = `scheduleSolutions/:${fieldNames.scheduleSolutionName}/:${fieldNames.scheduleScopeName}`

@EntityName('ScheduleSolution')
@EntityMeta(entitySpec)
@Uri(scheduleSolutionUri)
class ScheduleSolutionResource extends Resource<IScheduleSolution> {
  meta = entitySpec

  @ActionUri(`${scheduleSolutionUri}/generate`)
  @Action('POST')
  @MockUri()
  generateSolution (response: Response) {
    return response.json()
  }

  @ActionUri(`${scheduleSolutionUri}/tasks`)
  @Action('GET')
  tasks (response: Response) {
    return super.query(response)
  }

  @ActionUri(`scheduleSolutions/summary`)
  @Action('POST')
  @MockUri()
  getSummary (response: Response) {
    return response.json()
  }

  @ActionUri(`fileExports/bb50/:${fieldNames.scheduleScopeName}/:${fieldNames.scheduleSolutionName}`)
  @Action('GET')
  getBB50Blob (response: Response) {
    return response.blob()
  }

  @Action('PUT')
  @CustomSuccessAlertMessage(`starting_solution_generation`)
  @ActionUri(`scheduleScopes/:${fieldNames.scheduleScopeName}/sequence/:${fieldNames.scheduleSolutionName}`)
  sequenceSolution (response: Response) {
    return response
  }
}

interface IScheduleSolutionResource extends IResource<IScheduleSolution> {
  tasks: (params) => Promise<{ data: Array<ITask>, headers: Function }>
  getBB50Blob: (params) => Promise<Blob>
  getSummary: (any) => any
  sequenceSolution: ResourceMethod<Response>
}

/**
 * @description
 * Provides a Resource Service class for access to ScheduleSolutionSet (for a schedule scope).
 */
@Injectable()
export class ScheduleSolutionService extends makeResourceService<ScheduleSolutionResource, IScheduleSolutionResource>(ScheduleSolutionResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
