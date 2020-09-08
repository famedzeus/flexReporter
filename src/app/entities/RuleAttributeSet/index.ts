import entitySpec from './fields'
import { makeResourceService, ActionUri, EntityMeta, EntityName, ResourceMethodQuery,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IRuleAttributeSet } from './interface'

const { fieldNames } = entitySpec

@EntityName('RuleAttributeSet')
@EntityMeta(entitySpec)
@Uri(`ruleAttributeSets/:${fieldNames.scheduleScopeName}/:${fieldNames.ruleId}/:${fieldNames.relationshipCode}/:${fieldNames.setName}`)
class RuleAttributeSetResource extends Resource<IRuleAttributeSet> {
  meta = entitySpec

  @ActionUri(`ruleAttributeSets/:${fieldNames.scheduleScopeName}`)
  query (response: Response) {
    return super.query(response)
  }

  @ActionUri(`ruleAttributeSets`)
  save (r: Response) {
    return super.save(r)
  }
}

interface IRuleAttributeSetResource extends IResource<IRuleAttributeSet> {
  query: ResourceMethodQuery<IRuleAttributeSet>
}

/**
 * @description
 * Provides a Resource Service for access to RuleAttributeSetSet
 */
@Injectable()
export class RuleAttributeSetService extends makeResourceService<RuleAttributeSetResource, IRuleAttributeSetResource>(RuleAttributeSetResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
