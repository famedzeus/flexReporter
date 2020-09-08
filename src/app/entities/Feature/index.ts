import entitySpec from './fields'
import { makeResourceService, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IFeature } from './interface'

const { fieldNames } = entitySpec

@EntityName('Feature')
@EntityMeta(entitySpec)
@Uri(`features/:${fieldNames.carSeries}/:${fieldNames.featureCode}/:${fieldNames.adoptShift}`)
class FeatureResource extends Resource<IFeature> {
  meta = entitySpec

  @ActionUri(`features`)
  save (r) {
    return super.save(r)
  }
}

interface IFeatureResource extends IResource<IFeature> {}

/**
 * @description
 * Provides a $resource for access to Features.
 */
@Injectable()
export class FeatureService extends makeResourceService<FeatureResource, IFeatureResource>(FeatureResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
