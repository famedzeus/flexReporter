import entitySpec from './fields'
import { makeResourceService, EntityMeta, EntityName, IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { ISystemEvent } from './interface'

const { fieldNames } = entitySpec

@EntityName('SystemEvent')
@EntityMeta(entitySpec)
@Uri(`systemEvents/:${fieldNames.id}`)
class SystemEventResource extends Resource<ISystemEvent> {
  meta = entitySpec
}

interface ISystemEventResource extends IResource<ISystemEvent> {}

/**
 * @description
 * Provides a ResourceService for access to SystemEvent.
 */
@Injectable()
export class SystemEventService extends makeResourceService<SystemEventResource, ISystemEventResource>(SystemEventResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
