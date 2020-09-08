import entitySpec from './fields'
import { makeResourceService, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IArtificialFeature } from './interface'

const fn = entitySpec.fieldNames

@EntityName('ArtificialFeature')
@EntityMeta(entitySpec)
@Uri(`artificialFeatures/:${fn.featureCode}`)
class ArtificialFeatureResource extends Resource<IArtificialFeature> {
  meta = entitySpec
}

interface IArtificialFeatureResource extends IResource<IArtificialFeature> {}

/**
 * @description
 * Provides a $resource for access to ArtificialFeature (for a schedule scope).
 */
@Injectable()
export class ArtificialFeatureService extends makeResourceService<ArtificialFeatureResource, IArtificialFeatureResource>(ArtificialFeatureResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
