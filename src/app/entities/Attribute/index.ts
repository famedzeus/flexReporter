import entitySpec from './fields'
import { makeResourceService, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IAttribute } from './interface'

const { fieldNames } = entitySpec

@EntityName( 'Attribute')
@EntityMeta(entitySpec)
@Uri(`scheduleScopes/:${fieldNames.scheduleScopeName}/attributes/:${fieldNames.attributeName}`)
class AttributeResource extends Resource<IAttribute> {
  meta = entitySpec
}

interface IAttributeResource extends IResource<IAttribute> {}

/**
 * @description
 * Provides a service for access to Attribute (for a schedule scope).
 */
@Injectable()
export class AttributeService extends makeResourceService<AttributeResource, IAttributeResource>(AttributeResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
