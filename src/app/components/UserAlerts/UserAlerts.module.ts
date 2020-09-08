import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatSnackBarModule, MatListModule, MatTooltipModule } from '@angular/material'
import { IntlModule } from '../../intl'
import { ServicesModule } from '../../services/module'
import { EffectsModule } from '../../store/effects.module'
import { UserAlertComponent } from './UserAlert.component'
import { UserAlertsComponent } from './UserAlerts.component'
import { UserAlertNotificationsComponent } from './UserAlertNotifications.component'
import { UserAlertsService } from './UserAlerts.service'
import { UserNotificationService } from './UserNotification.service'

const components = [
  UserAlertComponent,
  UserAlertsComponent,
  UserAlertNotificationsComponent]
@NgModule({
  imports: [
    CommonModule,
    EffectsModule,
    IntlModule,
    MatListModule,
    MatSnackBarModule,
    MatTooltipModule,
    ServicesModule
  ],
  declarations: components,
  entryComponents: components,
  providers: [UserAlertsService, UserNotificationService],
  exports: [components]
})
export class UserAlertsModule {}
