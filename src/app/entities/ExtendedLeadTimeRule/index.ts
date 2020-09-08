import entitySpec from './fields'
import { makeResourceService, EntityMeta, Action, ActionUri, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { ExtendedLeadTimeRule } from './interface'

const { fieldNames } = entitySpec
const eltUri = `extendedLeadTimeRules`

@EntityName('ExtendedLeadTimeRule')
@EntityMeta(entitySpec)
@Uri(`${eltUri}/:${fieldNames.id}`)
class ExtendedLeadTimeRuleResource extends Resource<ExtendedLeadTimeRule> {
  meta = entitySpec

  @Action('POST')
  @ActionUri(eltUri)
  save (response) { return super.save(response) }
}

interface IExtendedLeadTimeRuleResource extends IResource<ExtendedLeadTimeRule> {}

/**
 * @description
 * Provides a resource for access to ExtendedLeadTimeRule
 */
@Injectable()
export class ExtendedLeadTimeRuleService extends makeResourceService<ExtendedLeadTimeRuleResource, IExtendedLeadTimeRuleResource>(ExtendedLeadTimeRuleResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
