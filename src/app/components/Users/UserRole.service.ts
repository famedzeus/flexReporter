import { Injectable } from '@angular/core'
import {
  UserGroupUserService,
  EqualityOperator,
  IResourceFilters,
  IUserGroup,
  IUserGroupUser
} from 'entities'
import { UserAuth } from '../Auth/user-auth'
import { UserGroupUserEffectService } from 'effects'

/**
 * Some utility logic for helping manage user groups
 */
export interface IExtendedUserGroup extends IUserGroup {
  section: string
  displayName: string
  access: string
}

interface IUpdateOps {
  deletable: Array<IUserGroupUser>
  creatable: Array<IUserGroupUser>
}

@Injectable()
export class UserRoleService {
  roleOptions = [{
    value: 'user',
    description: 'User'
  }, {
    value: 'admin',
    description: 'Admin'
  }]

  constructor (
    private UserAuth: UserAuth,
    private UserGroupUser: UserGroupUserService,
    private userGroupUserEffects: UserGroupUserEffectService
  ) {}

  get userGroups () {
    return this.UserAuth
      .userGroups$
      .map(userGroups => userGroups.map(ug => this.extendedGroupInfo(ug)))
  }

  get currentUserGroups () {
    return this.UserAuth
      .currentUsersGroups$
      .map(ugs => ugs.map(ug => this.extendedGroupInfo(ug)))
  }

  setRoles (userId: string) {
    return this.userGroupUserEffects
      .getCollection(null, {
        userId: {
          name: this.UserGroupUser.meta.fieldNames.userId,
          value: userId,
          type: EqualityOperator.Equal
        }
      })
  }

  updateUserGroupUsers (
    currentUserGroupUsers: Array<IUserGroupUser>,
    userGroups: Array<IExtendedUserGroup>,
    userId: string
  ) {
    const {deletable, creatable} = this.getOperations(currentUserGroupUsers, userGroups, userId)
    const deletePromises = deletable.map(ugu => this.UserGroupUser.delete(ugu))
    const createPromises = creatable.map(ugu => this.UserGroupUser.save(ugu, ugu))

    return Promise.all(deletePromises.concat(createPromises))
  }

  private extendedGroupInfo (userGroup: IUserGroup) {
    const info = this.UserAuth.getGroupDetails(userGroup)
    return Object.assign(
      { displayName: `${info.section}_${info.access}` }, info, userGroup
    )
  }

  private getOperations (
    currentUserGroupUsers: Array<IUserGroupUser>,
    userGroups: Array<IExtendedUserGroup>,
    userId: string): IUpdateOps {
    const creatableGroups = userGroups
      .filter(userGroup => !currentUserGroupUsers.some(ugu => ugu.groupName === userGroup.groupName))

    return {
      creatable: creatableGroups.map(group => ({
        groupName: group.groupName,
        userId
      })),
      deletable: currentUserGroupUsers.filter(ugu => !userGroups.some(ug => ug.groupName === ugu.groupName))
    }
  }
}
