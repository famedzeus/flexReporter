import entitySpec from './fields'
import { makeResourceService, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IRule } from './interface'

const { fieldNames } = entitySpec

@EntityName('Rule')
@EntityMeta(entitySpec)
@Uri(`rules/:${fieldNames.scheduleScopeName}/:${fieldNames.ruleId}`)
class RuleResource extends Resource<IRule> {
  meta = entitySpec

  @ActionUri('rules')
  query (response) {
    return super.query(response)
  }

  @ActionUri('rules')
  save (response) {
    return super.save(response)
  }

}

interface IRuleResource extends IResource<IRule> {}

/**
 * @description
 * Provides a $resource for access to Rule (for a schedule scope).
 */
@Injectable()
export class RuleService extends makeResourceService<RuleResource, IRuleResource>(RuleResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
