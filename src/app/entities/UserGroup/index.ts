import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IUserGroup } from './interface'

const { fieldNames } = entitySpec

@EntityName('UserGroup')
@EntityMeta(entitySpec)
@Uri(`userGroups/:${fieldNames.groupName}`)
class UserGroupResource extends Resource<IUserGroup> {
  meta = entitySpec

  @ActionUri('userGroups')
  @Action('POST')
  save (response) {
    return super.save(response)
  }
}

interface IUserGroupResource extends IResource<IUserGroup> {}
/**
 * @description
 * Provides a ResourceService for access to UserGroup.
 */
@Injectable()
export class UserGroupService extends makeResourceService<UserGroupResource, IUserGroupResource>(UserGroupResource) {
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
