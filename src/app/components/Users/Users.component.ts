import { Component, Input, OnInit, Output, ViewEncapsulation } from '@angular/core'
import { EntityCRUDStore } from '../core/EntityCRUD'
import { MatDialog } from '@angular/material'
import { Log } from 'services'
import { UserEffectService } from 'effects'
import { UserEditComponent } from './UserEdit.component'
import { UserService, UserGroupUserService, IUser } from 'entities'
import { UserRoleService } from './UserRole.service'
const { fieldNames } = UserService.meta

@Component({
  selector: 'users',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./Users.component.scss'],
  template: `
    <user-profile (onChangeLanguage)="updateLanguage($event)"></user-profile>
    <filtered-table
      *ngIf="dataView"
      [dataset]="dataView.viewCollection"
      [title]="title"
      [rowClass]="datatableRowClass"
      [rowEditDisabled]="datatableRowEditDisabled"
      [rowsReorderable]="itemsReorderable"
      [filters]="dataView.initialFilters"
      [fields]="extendedViewFields || viewFields"
      [options]="state.crudConfig"
      [filterDisabled]="hideFilter"
      [filterFormExpansion]="filterFormExpansion"
      [filterResetEnabled]="filterResetEnabled"
      [externalTable]="externalTable"
      [tableHeight]="tableHeight"
      [filterButton]="dataView.serverPaginated"
      [totalItems]="dataView.serverPaginated ? state.totalItems : dataView.totalItems"
      [selectedItem]="dataView.selectedItem"
      [pageSizes]="pageSizes"
      [tableWidth]="tableOptions.width"
      [loadingIndicator]="state.isUpdatePending"
      [sort]="pagination.sort"
      [pageSize]="pagination.size"
      [fieldValueMetadata]="fieldValueMetadata"
      [sizeColumnsToFit]="sizeColumnsToFit"
      [suppressFieldDotNotation]="suppressDatatableFieldDotNotation"
      (onFilterChange)="updateFilters($event)"
      (onSelectItem)="setSelected($event)"
      (onSelectAction)="onActionRequest($event)"
      (onPaginationChange)="paginationChange($event)">
    </filtered-table>
  `
})
export class UsersComponent extends EntityCRUDStore<IUser> implements OnInit {
  @Input() relation: IUser
  @Output() onSelected
  collection: Array<IUser>
  pageSizes = []
  title = 'Users'
  viewFieldNames = [
    fieldNames.userId,
    fieldNames.userName,
    fieldNames.emailAddress]

  constructor (
    log: Log,
    dialog: MatDialog,
    private userEffects: UserEffectService,
    private userRoleHelper: UserRoleService
  ) {
    super(log, dialog, userEffects)
  }

  ngOnInit () {
    super.ngOnInit()

    return this.getCollection()
  }

  updateLanguage (languageCode) {
    this.userEffects
      .activeUser$
      .first()
      .subscribe((currentUser) => {
        const updatedUser = Object.assign({}, currentUser, { language: languageCode })

        return this.userEffects
          .update(updatedUser, currentUser)
      })
  }

  create (userInfo) {
    const { user, userGroups, userGroupUsers } = userInfo

    return new Promise((resolve, reject) => {
      super
        .create(user)
        .then(() => {
          this.userRoleHelper
            .updateUserGroupUsers(
              userGroupUsers,
              userGroups,
              user.userId
            )
            .then(resolve)
            .catch(reject)

        })
        .catch(reject)

    })
  }

  update (userInfo) {
    const { currentRecord, user, userGroups, userGroupUsers } = userInfo
    return new Promise((resolve, reject) => {
      super
        .update(user, currentRecord)
        .then(() => {
          this.userRoleHelper
            .updateUserGroupUsers(
              userGroupUsers,
              userGroups,
              user.userId
            )
            .then(resolve)
            .catch(reject)

        })
        .catch(reject)

    })
  }

  openModal ($event, Component ?: any) {
    const { actionName } = $event
    const value = $event.value
    super.openModal($event, UserEditComponent, { customTitles: { Create: 'add_user' } })
  }
}
