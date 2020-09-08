import { Routes } from '@angular/router'
// import { EmptyComponent} from '../Sequencing'
import { GeneralAuthGuard } from '../Auth'
import { UnauthorisedComponent } from '../Auth/Unauthorised'
import { UsersComponent } from '../Users'
import { AuthenticationComponent } from '../Auth'
import { RouteNotFoundComponent } from '../404Page'
import { DashboardsComponent } from '../Reporting/dashboards/Dashboards.component'
import { DashboardComponent } from '../Reporting/dashboard/Dashboard.component'
import { YourFeedsComponent } from '../Reporting/YourFeeds/YourFeeds.component'
import { DashboardSaveGuard } from '../Reporting/dashboard/DashboardSave.component'
import { FileUploadWizardComponent } from '../Reporting/fileUploadWizard/FileUploadWizard.component'

export const appRoutes: Routes = [
  {
    path: 'authenticate',
    component: AuthenticationComponent
  }, {
    path: 'unauthorised',
    // canActivate: [GeneralAuthGuard],
    component: UnauthorisedComponent
  }, {
    path: 'users',
    canActivate: [GeneralAuthGuard],
    component: UsersComponent
  }, {
    path: 'page-not-found',
    component: RouteNotFoundComponent
  }, {
    path: 'dashboards',
    canActivate: [GeneralAuthGuard],
    component: DashboardsComponent,
  }, {
    path: 'dashboard/:name/:userId',
    component: DashboardComponent,
    canActivate: [GeneralAuthGuard],
    canDeactivate: [DashboardSaveGuard]
  }, {
    path: 'admin',
    canActivate: [GeneralAuthGuard],
    component: FileUploadWizardComponent,
  }, {
    canActivate: [GeneralAuthGuard],
    path: 'yourFeeds/:selectedDashboardName',
    component: YourFeedsComponent
  } , {
    path: '**',
    canActivate: [GeneralAuthGuard],
    redirectTo: 'dashboards'
  }
]
