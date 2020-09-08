import entitySpec from './fields'
import { makeResourceService, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { ICarSeries } from './interface'

const { fieldNames } = entitySpec

@EntityName('CarSeries')
@EntityMeta(entitySpec)
@Uri(`carSeries/:${fieldNames.carSeriesCode}`)
class CarSeriesResource extends Resource<ICarSeries> {
  meta = entitySpec
}

interface ICarSeriesResource extends IResource<ICarSeries> {}

/**
 * @description
 * Provides a resource service for access to CarSeries entity
 */
@Injectable()
export class CarSeriesService extends makeResourceService<CarSeriesResource, ICarSeriesResource>(CarSeriesResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
