import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IShop } from './interface'

const { fieldNames } = entitySpec

@EntityName('Shop')
@EntityMeta(entitySpec)
@Uri(`shops/:${fieldNames.id}`)
class ShopResource extends Resource<IShop> {
  meta = entitySpec

  @ActionUri('shops')
  @Action('POST')
  save (response) {
    return super.save(response)
  }
}

interface IShopResource extends IResource<IShop> {
  queryByLine (params): Promise<{ data: Array<IShop>, headers: Function }>
}

/**
 * @description
 * Provides a ResourceService for access to ShopSet.
 */
@Injectable()
export class ShopService extends makeResourceService<ShopResource, IShopResource>(ShopResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
