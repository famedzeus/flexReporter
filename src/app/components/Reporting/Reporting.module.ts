import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { MaterialModule } from '../app/Material.module'
import { HttpModule } from '@angular/http'
import { CdkTableModule} from '@angular/cdk/table'
import { GenerateComponent } from './generate/Generate.component'
import { PrototypeComponent } from './prototype/Prototype.component'
import { DashboardsComponent } from './dashboards/Dashboards.component'
import { DashboardComponent } from './dashboard/Dashboard.component'
import { DashboardSaveGuard } from '../Reporting/dashboard/DashboardSave.component'
import { FeedsComponent } from './YourFeeds/Feeds.component'
import { YourFeedsComponent } from './YourFeeds/YourFeeds.component'
import { ViewComponent } from './view/View.component'
import { FlexReporterComponent } from '../core/FlexReporter/FlexReporter.component'
import { FlexReporter } from '../core/FlexReporter'
import { FieldConvertersModule } from './fieldConverters/fieldConverters.module'
import { CoreComponentsModule } from '../core/core.module'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { Dialog } from './dialogues/dialogues.component'
import { AgGridModule } from 'ag-grid-angular'
import { ActionsCellComponent} from './dashboards/Dashboards.component'
import { NgUploaderModule } from 'ngx-uploader'
import { FileUploadWizardComponent } from '../Reporting/fileUploadWizard/FileUploadWizard.component'

import { ViewService } from './view/View.service'

const components = [ FileUploadWizardComponent, ActionsCellComponent, FeedsComponent, YourFeedsComponent, GenerateComponent, PrototypeComponent, 
                    DashboardsComponent, DashboardComponent, FlexReporterComponent, ViewComponent, Dialog, DashboardSaveGuard]

@NgModule({
    imports: [
      CommonModule,
      CoreComponentsModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
      MaterialModule,
      CdkTableModule,
      NgxDatatableModule,
      HttpModule,
      AgGridModule,
      FieldConvertersModule,
      NgUploaderModule
    ],
    declarations: components,
    entryComponents: components,
    providers: [ ViewService ],
    exports: components
})
export class ReportingModule {

}
