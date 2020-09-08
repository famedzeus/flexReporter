import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IAttributeSet } from './interface'

const { fieldNames } = entitySpec

@EntityName('AttributeSet')
@EntityMeta(entitySpec)
@Uri(`scheduleScopes/:${fieldNames.scheduleScopeName}/attributeSets/:${fieldNames.setName}`)
class AttributeSetResource extends Resource<IAttributeSet> {

  @ActionUri(`scheduleScopes/:${fieldNames.scheduleScopeName}/attributeSets`)
  @Action('POST')
  save (response) {
    return super.save(response)
  }
}

interface IAttributeSetResource extends IResource<IAttributeSet> {}

/**
 * @description
 * Provides a resource service for access to AttributeSetSet (for a schedule scope).
 */
@Injectable()
export class AttributeSetService extends makeResourceService<AttributeSetResource, IAttributeSetResource>(AttributeSetResource) {
  static meta = entitySpec
  meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
