import entitySpec from './fields'
import { makeResourceService, EntityMeta, Action, ActionUri, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IEndItemFeature } from './interface'

const { fieldNames } = entitySpec

@EntityName('EndItemFeature')
@EntityMeta(entitySpec)
@Uri(`endItemFeatures/:${fieldNames.modelVariant}/:${fieldNames.carSeriesCode}/:${fieldNames.destinationCode}/:${fieldNames.adoptShift}/:${fieldNames.featureCode}`)
class EndItemFeatureResource extends Resource<IEndItemFeature> {
  meta = entitySpec

  @Action('POST')
  @ActionUri('endItemFeatures')
  save (response) { return super.save(response) }
}

interface IEndItemFeatureResource extends IResource<IEndItemFeature> {}

/**
 * @description
 * Provides a resource service for access to EndItemFeature
 */
@Injectable()
export class EndItemFeatureService extends makeResourceService<EndItemFeatureResource, IEndItemFeatureResource>(EndItemFeatureResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
