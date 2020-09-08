import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IAttributeSetAttributeValue } from './interface'

const { fieldNames } = entitySpec

@EntityName('AttributeSetAttributeValue')
@EntityMeta(entitySpec)
@Uri(`attributeSetAttributeValues/:${fieldNames.scheduleScopeName}/:${fieldNames.setName}/:${fieldNames.attributeName}/:${fieldNames.attributeValue}`)
class AttributeSetAttributeValueResource extends Resource<IAttributeSetAttributeValue> {
  meta = entitySpec

  @ActionUri('attributeSetAttributeValues')
  @Action('POST')
  save (response) {
    return super.save(response)
  }

  @ActionUri(`attributeSetAttributeValues`)
  query (response) {
    return super.query(response)
  }
}

interface IAttributeSetAttributeValueResource extends IResource<IAttributeSetAttributeValue> {}

/**
 * @description
 * Provides a resource service for access to AttributeSetAttributeValueSet (for a schedule scope).
 */
@Injectable()
export class AttributeSetAttributeValueService
  extends makeResourceService<AttributeSetAttributeValueResource, IAttributeSetAttributeValueResource>(AttributeSetAttributeValueResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
