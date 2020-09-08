import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IShopLine } from './interface'

const { fieldNames } = entitySpec

@EntityName('ShopLine')
@EntityMeta(entitySpec)
@Uri(`shopLines/:${fieldNames.calendarCode}`)
class ShopLineResource extends Resource<IShopLine> {
  meta = entitySpec

  @ActionUri('shopLines')
  @Action('POST')
  save (response) {
    return super.save(response)
  }
}

interface IShopLineResource extends IResource<IShopLine> {}

/**
 * @description
 * Provides a ResourceService for access to ShopLineSet.
 */
@Injectable()
export class ShopLineService extends makeResourceService<ShopLineResource, IShopLineResource>(ShopLineResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
