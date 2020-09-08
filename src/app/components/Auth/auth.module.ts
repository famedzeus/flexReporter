import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MaterialModule } from '../app/Material.module'
import { ServicesModule } from '../../services/module'
import { AuthenticatingProgressComponent } from './AuthenticatingProgress'
import { UserAuth } from './user-auth'
import { UnauthorisedComponent } from './Unauthorised'
import { PlantsAuthGuard, SequencingAuthGuard, RoutesAuthGuard, GeneralAuthGuard } from './auth-guard'
import { IntlModule } from '../../intl'
import { CoreComponentsModule } from '../core/core.module'
import { AuthenticationComponent } from './Authentication.component'

const components: Array<any> = [
  AuthenticationComponent,
  AuthenticatingProgressComponent,
  UnauthorisedComponent
]
@NgModule({
  imports: [
    CommonModule,
    CoreComponentsModule,
    IntlModule,
    MaterialModule,
    RouterModule,
    ServicesModule
  ],
  providers: [UserAuth, PlantsAuthGuard, RoutesAuthGuard, SequencingAuthGuard, GeneralAuthGuard],
  bootstrap: components,
  declarations: components,
  exports: components
})
export class AuthModule {}
