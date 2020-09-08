import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IAttributeSetHierarchy } from './interface'

const { fieldNames } = entitySpec

const params = [
  fieldNames.parentScheduleScopeName,
  fieldNames.parentSetName,
  fieldNames.childScheduleScopeName,
  fieldNames.childSetName
].join('/:')
const attributeSetHierarchys = 'attributeSetHierarchys'

@EntityName('AttributeSetHierarchy')
@EntityMeta(entitySpec)
@Uri(`${attributeSetHierarchys}/:${params}`)
class AttributeSetHierarchyResource extends Resource<IAttributeSetHierarchy> {
  meta = entitySpec

  @ActionUri(attributeSetHierarchys)
  @Action('POST')
  save (response) {
    return super.save(response)
  }

  @ActionUri(attributeSetHierarchys)
  query (response) {
    return super.query(response)
  }

}

interface IAttributeSetHierarchyResource extends IResource<IAttributeSetHierarchy> {}

/**
 * @description
 * Provides a resource service for access to AttributeSetHierarchySet (for a schedule scope).
 */
@Injectable()
export class AttributeSetHierarchyService extends makeResourceService<AttributeSetHierarchyResource, IAttributeSetHierarchyResource>(AttributeSetHierarchyResource) {
  constructor (
    public HttpHelper: HttpHelper
  ) { super( HttpHelper) }
}

export * from './interface'
