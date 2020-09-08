import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName, MockUri,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IUser, IVehicleSchedulingUser } from './interface'

const { fieldNames } = entitySpec

@EntityName('User')
@EntityMeta(entitySpec)
@Uri(`users/:${fieldNames.userId}`)
class UserResource extends Resource<IUser> {
  meta = entitySpec

  @ActionUri('users')
  @Action('POST')
  save (response) {
    return super.save(response)
  }

  @ActionUri('users/userGroup/:groupName')
  @Action('GET')
  queryByUserGroupName (response): Promise<Array<IUser>> {
    return response.json()
  }

  //@MockUri()
  @ActionUri('loggedonuser')
  @Action('GET')
  getCurrentUser (response): Promise<IVehicleSchedulingUser> {
    return response.json()
  }

  //@MockUri()
  @ActionUri('loggedonuser/logout')
  @Action('GET')
  logoutCurrentUser (response: Response): Promise<string> {
    return response.text()
  }

  @ActionUri('activeDirectoryUser/byLastName/:lastName')
  @Action('GET')
  queryByLastName (response): Promise<Array<IVehicleSchedulingUser>> {
    return response.json()
  }

  @ActionUri('activeDirectoryUser/byUserId/:userId')
  @Action('GET')
  queryById (response): Promise<Array<IVehicleSchedulingUser>> {
    return response.json()
  }
}

interface IUserResource extends IResource<IUser> {
  getCurrentUser (): Promise<IVehicleSchedulingUser>
  logoutCurrentUser (): Promise<string>
  queryByLastName (params): Promise<Array<IVehicleSchedulingUser>>
  queryById (params): Promise<Array<IVehicleSchedulingUser>>
  queryByUserGroupName (params): Promise<Array<IUser>>
}

/**
 * @description
 * Provides a ResourceService for access to User resources.
 */
@Injectable()
export class UserService extends makeResourceService<UserResource, IUserResource>(UserResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
