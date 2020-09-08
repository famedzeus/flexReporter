import entitySpec from './fields'
import { makeResourceService, EntityMeta, EntityName, Action, ActionUri, SuppressErrors,
  IResource, Resource, ResourceMethod, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { ITask } from './interface'

const { fieldNames } = entitySpec
const tasksUri = `tasks/:${fieldNames.taskId}`
@EntityName('Task')
@EntityMeta(entitySpec)
@Uri(tasksUri)
class TaskResource extends Resource<ITask> {
  meta = entitySpec

  @Action('PUT')
  @ActionUri(`${tasksUri}/cancel`)
  @SuppressErrors([409])
  cancelTask (response: Response) {
    return response
  }
}

interface ITaskResource extends IResource<ITask> {
  cancelTask: ResourceMethod<Response>
}

/**
 * @description
 * Provides a ResourceService for access to Task.
 */
@Injectable()
export class TaskService extends makeResourceService<TaskResource, ITaskResource>(TaskResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
