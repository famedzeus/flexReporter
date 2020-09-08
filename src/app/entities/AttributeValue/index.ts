import entitySpec from './fields'
import { makeResourceService, EntityMeta, EntityName,
         IResource, Resource, Uri, ActionUri, MockUri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IAttributeValue } from './interface'

const { fieldNames } = entitySpec
const attributeUri = `scheduleScopes/:${fieldNames.scheduleScopeName}/attributes/:${fieldNames.attributeName}`

@EntityName('AttributeValue')
@EntityMeta(entitySpec)
@Uri(`${attributeUri}/attributeValues/:${fieldNames.attributeValue}`)
class AttributeValueResource extends Resource<IAttributeValue> {
  meta = entitySpec

  @ActionUri(`vehicles/:vehicleId/attributeValues`)
  queryByVehicle (response) {
    return super.query(response)
  }
}

interface IAttributeValueResource extends IResource<IAttributeValue> {
  queryByVehicle (params): Promise<{ data: Array<IAttributeValue>, headers: Function }>
}

/**
 * @description
 * Provides a service for access to AttributeValue (for a schedule scope).
 * Replaces decorated handlers with methods which implement API calls
 */
@Injectable()
export class AttributeValueService
extends makeResourceService<AttributeValueResource, IAttributeValueResource>(AttributeValueResource) {
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'

