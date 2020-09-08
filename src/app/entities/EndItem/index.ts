import entitySpec from './fields'
import { makeResourceService, EntityMeta, Action, ActionUri, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IEndItem } from './interface'

const { fieldNames } = entitySpec

@EntityName('EndItem')
@EntityMeta(entitySpec)
@Uri(`endItems/:${fieldNames.modelVariant}/:${fieldNames.carSeriesCode}/:${fieldNames.destinationCode}/:${fieldNames.adoptShift}`)
class EndItemResource extends Resource<IEndItem> {
  meta = entitySpec

  @Action('POST')
  @ActionUri('endItems')
  save (response) { return super.save(response) }
}

interface IEndItemResource extends IResource<IEndItem> {}

/**
 * @description
 * Provides a resource service for access to EndItem (for a schedule scope).
 */
@Injectable()
export class EndItemService extends makeResourceService<EndItemResource, IEndItemResource>(EndItemResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
