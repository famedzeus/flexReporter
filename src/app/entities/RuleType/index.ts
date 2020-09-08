import entitySpec from './fields'
import { makeResourceService, EntityMeta, EntityName,
         IResource, Mock, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IRuleType } from './interface'

const { fieldNames } = entitySpec

@EntityName('RuleType')
@EntityMeta(entitySpec)
@Mock()
@Uri(`ruleTypes/:${fieldNames.ruleType}`)
class RuleTypeResource extends Resource<IRuleType> {
  meta = entitySpec

}

interface IRuleTypeResource extends IResource<IRuleType> {}

/**
 * @description
 * Provides a Resource Service for access to RuleType
 *
 * NOTE: Not acuually an endpoint
 */
@Injectable()
export class RuleTypeService extends makeResourceService<RuleTypeResource, IRuleTypeResource>(RuleTypeResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
