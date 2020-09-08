import { NgModule } from '@angular/core'
import { FormsModule} from '@angular/forms'
import { CommonModule } from '@angular/common'
import { MatSidenavModule, MatCardModule, MAT_DATE_LOCALE } from '@angular/material'
import { RouterModule } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser'
import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CoreComponentsModule } from '../core/core.module'
import { ServerInfo } from '../../services/ServerInfo'
import { ServicesModule } from '../../services/module'
import { Log } from '../../services/log'
import { EntitiesModule } from 'entities'
// import { PlantModule } from '../Plant'
// import { SequencingModule } from '../Sequencing'
import { SVGComponentsModule } from '../SVGComponents/SVGComponents.module'
import { AppComponent } from './App.component'
import { AppContentComponent } from '../AppContent'
import { AppFooterComponent } from '../AppFooter'
import { AppHeaderComponent } from '../AppHeader'
import { AuthModule } from '../Auth/auth.module'
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { HttpHelper } from '../../services/http'
import { UsersModule } from '../Users'
// import { RoutesModule } from '../cRoutes/Routes.module'
// import { EmptyComponent } from '../Sequencing/Empty.component'
import { RouteNotFoundComponent } from '../404Page'
import { UserAuth } from '../Auth/user-auth'
import { appRoutes } from '../app/App.routes'
import { reducers } from '../../store'
import { AlertBrokerService } from './AlertBroker.service'
import { EffectsModule } from '../../store/effects.module'
import { UserAlertsModule } from '../UserAlerts'
import { IntlModule } from '../../intl'
import { TasksModule } from '../Tasks'
import { MaterialModule } from './Material.module'
import { ReportingModule } from '../Reporting/Reporting.module'
import { DashboardSaveGuard } from '../Reporting/dashboard/DashboardSave.component'
import { FieldConvertersModule } from '../Reporting/fieldConverters/fieldConverters.module'

// // TODO: Remove hack when upgrading material to version with fix
// MatAutocompleteTrigger.prototype._handleBlur = function (newlyFocusedTag) {
//   this._onTouched()
//   if (newlyFocusedTag == null) {
//     newlyFocusedTag = document.activeElement.className.indexOf('mat-option') >= 0 ? 'MD-OPTION' : ''
//   }
//     // Only emit blur event if the new focus is *not* on an option.
//   if (newlyFocusedTag !== 'MD-OPTION') { // newlyFocusedTag !== 'MD-OPTION'
//     this._blurStream.next(null)
//   }
// }
const components = [
  AppComponent, AppContentComponent, AppFooterComponent,
  AppHeaderComponent, RouteNotFoundComponent
]
@NgModule({
  imports: [
    FormsModule,
    MaterialModule,
    StoreModule.forRoot(reducers),
    EffectsModule,
    ServicesModule,
    BrowserAnimationsModule,
    AuthModule,
    CoreComponentsModule,
    BrowserModule,
    IntlModule,
    NgxDatatableModule,
    MatCardModule,
    MatSidenavModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    EntitiesModule,
    FieldConvertersModule,
    // RoutesModule,
    // SequencingModule,
    SVGComponentsModule,
    // PlantModule,
    TasksModule,
    ReportingModule,
    
    // StoreDevtoolsModule.instrument({
    //   maxAge: 50
    // }),
    UserAlertsModule,
    UsersModule
  ],
  bootstrap: [AppComponent],
  declarations: components,
  entryComponents: components,
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    AlertBrokerService,
    HttpHelper,
    Log,
    ServerInfo,
    UserAuth,
    DashboardSaveGuard
  ]
})
export class AppModule {

}
