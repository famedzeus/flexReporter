import { RouterModule } from '@angular/router'
import { CoreComponentsModule } from '../core/core.module'
import { MaterialModule } from '../app/Material.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IntlModule } from '../../intl'
import { UserInfoComponent } from './UserInfo.component'
import { UsersComponent } from './Users.component'
import { UserProfileComponent } from './UserProfile.component'
import { UserEditComponent } from './UserEdit.component'
import { UserRoleService } from './UserRole.service'
import { ServicesModule } from '../../services/module'

const components = [
  UserEditComponent,
  UserInfoComponent,
  UsersComponent,
  UserProfileComponent
]

@NgModule({
  imports: [
    CoreComponentsModule,
    CommonModule,
    FormsModule,
    IntlModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    ServicesModule
  ],
  providers: [UserRoleService],
  declarations: components,
  entryComponents: components,
  exports: components
})
export class UsersModule {}
