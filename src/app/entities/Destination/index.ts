import entitySpec from './fields'
import { makeResourceService, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IDestination } from './interface'

const { fieldNames } = entitySpec

@EntityName('Destination')
@EntityMeta(entitySpec)
@Uri(`destinations/:${fieldNames.destinationCode}`)
class DestinationResource extends Resource<IDestination> {
  meta = entitySpec
}

interface IDestinationResource extends IResource<IDestination> {}

/**
 * @description
 * Provides a service for access to Destination (for a schedule scope).
 */
@Injectable()
export class DestinationService extends makeResourceService<DestinationResource, IDestinationResource>(DestinationResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
