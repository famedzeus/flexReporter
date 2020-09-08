import entitySpec from './fields'
import { makeResourceService, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { ICarSeriesColourGroup } from './interface'

const { fieldNames } = entitySpec

@EntityName('CarSeriesColourGroup')
@EntityMeta(entitySpec)
@Uri(`carSeriesColourGroups/:${fieldNames.carSeriesCode}/:${fieldNames.colourGroupCode}`)
class CarSeriesColourGroupResource extends Resource<ICarSeriesColourGroup> {
  meta = entitySpec

  @ActionUri(`carSeriesColourGroups`)
  save (response) {
    return super.save(response)
  }
}

interface ICarSeriesColourGroupResource extends IResource<ICarSeriesColourGroup> {}

/**
 * @description
 * Provides a service for access to CarSeriesColourGroup entity
 */
@Injectable()
export class CarSeriesColourGroupService extends makeResourceService<CarSeriesColourGroupResource, ICarSeriesColourGroupResource>(CarSeriesColourGroupResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}
export * from './interface'
