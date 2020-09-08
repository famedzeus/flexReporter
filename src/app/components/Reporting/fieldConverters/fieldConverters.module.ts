import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HttpModule } from '@angular/http'
import { CdkTableModule} from '@angular/cdk/table'
import { CommonModule } from '@angular/common'
import { FieldConverterComponent } from './fieldConverter.component'
import { MaterialModule } from '../../app/Material.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { FieldConverter } from './fieldConverter.service'
import { ViewService } from '../view/View.service'

const components = [ FieldConverterComponent ]

@NgModule({
    imports: [
      CommonModule,
      RouterModule,
      CdkTableModule,
      HttpModule,
      MaterialModule,
      FormsModule
    ],
    declarations: components,
    entryComponents: components,
    providers: [FieldConverter, ViewService],
    exports: components
})
export class FieldConvertersModule {

}
