import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IUserGroupUser } from './interface'

const { fieldNames } = entitySpec

@EntityName('UserGroupUser')
@EntityMeta(entitySpec)
@Uri(`userGroupUsers/:${fieldNames.userId}/:${fieldNames.groupName}`)
class UserGroupUserResource extends Resource<IUserGroupUser> {
  meta = entitySpec

  @ActionUri('userGroupUsers')
  @Action('POST')
  save (response) {
    return super.save(response)
  }
}

interface IUserGroupUserResource extends IResource<IUserGroupUser> {}

/**
 * @description
 * Provides a ResourceService for access to UserGroupUser.
 */
@Injectable()
export class UserGroupUserService extends makeResourceService<UserGroupUserResource, IUserGroupUserResource>(UserGroupUserResource) {
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
