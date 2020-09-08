import entitySpec from './fields'
import { makeResourceService, EntityMeta, ActionUri, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IAttributeFeature } from './interface'
import { IRule } from '../Rule'

const { fieldNames } = entitySpec
const attributeUri = `scheduleScopes/:${fieldNames.scheduleScopeName}/attributes/:${fieldNames.attributeName}`
const attributeValueUri = `${attributeUri}/attributeValues/:${fieldNames.attributeValue}`
const attributeFeatureUri = `${attributeValueUri}/attributeValueFeatures/:${fieldNames.carSeries}/:${fieldNames.featureCode}`

@EntityName('AttributeFeature')
@EntityMeta(entitySpec)
@Uri(attributeFeatureUri)
class AttributeFeatureResource extends Resource<IAttributeFeature> {
  meta = entitySpec

  @ActionUri(`${attributeFeatureUri}/activeRules`)
  getActiveAssociatedRules (response: Response) {
    return response.json()
  }
}

interface IAttributeFeatureResource extends IResource<IAttributeFeature> {
  getActiveAssociatedRules: (feature: IAttributeFeature) => Promise<Array<IRule>>
}

/**
 * @description
 * Provides a service for access to AttributeFeature (for a schedule scope).
 * Replace decorated handlers with methods which implement API calls
 */
@Injectable()
export class AttributeFeatureService
extends makeResourceService<AttributeFeatureResource, IAttributeFeatureResource>(AttributeFeatureResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
