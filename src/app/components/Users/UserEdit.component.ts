import { Component, EventEmitter, OnDestroy, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { MatDialogRef } from '@angular/material'
import { orderBy, take } from 'lodash'
import { Observable, Subscription } from 'rxjs'
import { EditGenericComponent } from '../core/EditGeneric'
import { Log } from 'services'
import { UserEffectService, UserGroupEffectService, UserGroupUserEffectService } from 'effects'
import { UserService, UserGroupUserService, IUserGroupUser, IResourceFilterOption } from 'entities'
import { UserRoleService, IExtendedUserGroup } from './UserRole.service'

@Component({
  selector: 'user-edit',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./UserEdit.component.scss'],
  templateUrl: './UserEdit.component.html'
})
export class UserEditComponent extends EditGenericComponent implements AfterViewInit, OnDestroy {
  @ViewChild('form') form
  hideFields = false
  controlsAdded = false
  options = []
  searchMethod = 'lastName'
  selectedGroupName = ''
  sectionAdminRoles: Array<string> = []
  lookupSubscription: Subscription = null
  activeUsersGroups: Array<IExtendedUserGroup> = []
  userGroups: Array<IExtendedUserGroup> = []
  permittedUserGroups: Array<IExtendedUserGroup> = []
  currentUserGroups: Array<IExtendedUserGroup> = []
  currentUserGroupUsers: Array<IUserGroupUser> = []
  roleOptions: {
    [sectionName: string]: Array<IResourceFilterOption>
  }
  constructor (
    protected Log: Log,
    public instance: MatDialogRef<any>,
    private User: UserService,
    private userRoleHelper: UserRoleService,
    private userGroupEffects: UserGroupEffectService,
    private userGroupUserEffects: UserGroupUserEffectService,
    private userEffects: UserEffectService
  ) {
    super(Log, instance)
    this.setUserOptions = this.setUserOptions.bind(this)
  }

  setUserOptions (val) {
    this.searchUsers(val)
      .then(users => this.options = take(users, 20))
      .catch(() => {
        // TODO: Handle this
      })
  }

  addUserRoleControls (form: FormGroup) {

    this.sectionAdminRoles
      .forEach(sectionName => {
        form.addControl(`${sectionName}Access`, new FormControl())
      })
  }

  ngOnInit () {
    super.ngOnInit()

    if (this.mode === 'Edit') {
      // Set user groupUsers
      this.userRoleHelper
        .setRoles(this.record.userId).catch()

      Observable
        .combineLatest(
          this.userGroupUserEffects.collection$,
          this.userRoleHelper.userGroups,
          this.userRoleHelper.currentUserGroups
        )
        .subscribe((next) => {
          const [userGroupUsers, userGroups, activeUserGroups] = next
          this.currentUserGroupUsers = userGroupUsers
          this.activeUsersGroups = activeUserGroups
          this.userGroups = userGroups

          this.currentUserGroups = userGroupUsers
            .map(ugu => userGroups.find(ug => ugu.groupName === ug.groupName))
            .map(userGroup => ({
              ...userGroup,
              editable: activeUserGroups.some(userGroupN => userGroupN.accessRight === 'A' && userGroupN.section === userGroup.section)
            }))
          this.setPermittedUserGroups()
        })

    } else if (this.mode === 'Create') {
      this.hideFields = true
      Observable
        .combineLatest(
          this.userRoleHelper.userGroups,
          this.userRoleHelper.currentUserGroups
        )
        .subscribe(latest => {
          this.userGroups = latest[0]
          this.activeUsersGroups = latest[1]
          this.setPermittedUserGroups()
        })
    }
  }

  ngAfterViewInit () {
    if (this.mode === 'Delete' || this.mode === 'Edit') return
    const form: FormGroup = this.form.form
    const { options, User } = this

    // Delay things that will cause a new change check
    setTimeout(() => {

      this.lockAutoFields()
      form.addControl('surnameLookup', new FormControl())
      this.lookupSubscription = form.controls['surnameLookup']
        .valueChanges
        .filter(val => val.length > 3)
        .debounceTime(200)
        .subscribe(this.setUserOptions)

      this.addUserRoleControls(form)
      this.controlsAdded = true
    }, 0)
  }

  /**
   * Find all user types which are addable and set them to property
   */
  setPermittedUserGroups () {
    this.permittedUserGroups = this.userGroups.filter(
      userGroup => (
        this.activeUsersGroups.some(userGroupN => userGroupN.accessRight === 'A' && userGroupN.section === userGroup.section) &&
        !this.currentUserGroups.some(userGroupN => userGroupN.section === userGroup.section)
      ))
  }

  ngOnDestroy () {
    if (this.lookupSubscription !== null) {
      this.lookupSubscription.unsubscribe()
    }
  }

  /**
   * Locks/unlocks the auto populated fields
   * @param shouldLock Whether to disable a field or not
   */
  lockAutoFields (shouldLock = true) {
    const form: FormGroup = this.form.form
    const { fieldNames} = this.User.meta
    const disabledFields = [
      fieldNames.emailAddress,
      fieldNames.userId,
      fieldNames.userName
    ]

    disabledFields.forEach(fieldName => {
      if (shouldLock) {
        form.controls[fieldName].disable()
      } else {
        form.controls[fieldName].enable()
      }
    })
  }

  addGroup (userGroupName) {
    this.currentUserGroups = this.currentUserGroups.concat(
      this.permittedUserGroups.find(ug => ug.groupName === userGroupName)
    )
    this.setPermittedUserGroups()
  }

  removeGroup (userGroup: IExtendedUserGroup) {
    this.currentUserGroups = this.currentUserGroups.filter(ug => ug.groupName !== userGroup.groupName)
    this.setPermittedUserGroups()
  }

  /**
   * Searches for a list of users either by last name of user id
   * @param val String value taken from user input
   */
  searchUsers (val: string) {
    if (this.searchMethod === 'lastName') {
      return this.User.queryByLastName({ lastName: val })
    }

    return this.User.queryById({ userId: val })
  }

  selectUser (user) {
    const form: FormGroup = this.form.form
    const { fields, fieldNames } = this.User.meta
    // Copy user details to form
    this.hideFields = false
    this.lockAutoFields(false)
    fields.forEach(field => {
      const { fieldName } = field
      const control = form.controls[fieldName]
      const value = fieldName === fieldNames.userName ? user.displayName : user[fieldName]
      if (value) {
        control.setValue(value)
      } else if (fieldName === this.User.meta.fieldNames.enabled) {
        control.setValue('Y')
      }
    })
    this.lockAutoFields()
  }

  /**
   * Clears current user search values
   */
  clearSearchField () {
    const form: FormGroup = this.form.form
    form.controls['surnameLookup'].setValue('')
    this.options = []
  }

  commitAction (user) {
    if (this.mode === 'Delete') {
      return super.commitAction()
    }

    return super.commitAction({
      currentRecord: this.initialRecord,
      user,
      userGroups: this.currentUserGroups,
      userGroupUsers: this.currentUserGroupUsers
    })

  }

}
