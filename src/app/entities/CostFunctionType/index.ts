import entitySpec from './fields'
import { makeResourceService, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { ICostFunctionType } from './interface'

const { fieldNames } = entitySpec

@EntityName('CostFunctionType')
@EntityMeta(entitySpec)
@Uri(`costFunctionTypes/:${fieldNames.code}`)
class CostFunctionTypeResource extends Resource<ICostFunctionType> {
  meta = entitySpec
}

interface ICostFunctionTypeResource extends IResource<ICostFunctionType> {}

/**
 * @description
 * Provides a $resource for access to CostFunctionType (for a schedule scope).
 */
@Injectable()
export class CostFunctionTypeService extends makeResourceService<CostFunctionTypeResource, ICostFunctionTypeResource>(CostFunctionTypeResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
