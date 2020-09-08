import { NgModule } from '@angular/core'
import { AgGridModule } from 'ag-grid-angular'
import { CommonModule, DatePipe } from '@angular/common'
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { MaterialModule } from '../app/Material.module'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgUploaderModule } from 'ngx-uploader'
import { ChartComponent } from './Charts/Chart'
import { MaskInputComponent } from './MaskInput'
import { DateInputComponent } from './DateInput'
import { AlertsComponent } from './Alerts'
import { DateShiftInputComponent, DateShiftPipe, FormattedDateShiftComponent, FormattedDateShiftRangeComponent } from './DateShift'
import { ColorPickerModule } from 'ngx-color-picker'
import { ColourInputComponent } from './ColourInput'
import {
  DialogEditFormComponent,
  EditFormComponent, EditGenericComponent, FormService } from './EditGeneric'
import { ConfirmationDialogComponent } from './ConfirmationDialog'
import { ValidatableInputComponent } from './ValidatableInput'
import { FilterFormBasicComponent, ExpansionFilterFormComponent, FilterFormComponent } from './FilterForm'
import { InlineInputComponent } from './InlineInput'
import { CheckboxEditCellComponent,
  DateGridCellComponent,
  DateShiftGridCellComponent,
  DateTimeGridCellComponent,
  DefaultActionsCellComponent,
  DefaultGridHeaderComponent,
  DefaultGridCellComponent,
  DisabledCheckboxCellComponent,
  FilteredListComponent,
  FilteredTableComponent,
  DefaultColouredCellComponent} from './FilteredTable'
import { TreeComponent } from './Tree'
import { Log } from 'services'
import { PopoverModalComponent } from './PopoverModal'
import { NavBarComponent } from './NavBar'
import { RouterModule } from '@angular/router'
import { ColourMetadataComponent } from '../Metadata'
import { ProgressOverlayComponent } from './ProgressOverlay'
import { CustomDatePipe } from '../app/CustomDatePipe'
import { PanelToggleButtonComponent } from './PanelToggleButton'
import { ServicesModule } from '../../services/module'
import { MapEditorComponent } from './MapEditor'
import { SectionHeaderComponent } from './SectionHeader'
import { TourComponent, TourService } from './Tour'
import { UploadFormBasicComponent, UploadFormComponent } from './UploadForm'
import { WarningCardComponent } from './WarningCard'
import { SliderModule, SliderComponent } from './Slider'
import { IntlModule } from '../../intl'
import { CogActivityComponent, ActivityDialogService } from './LoadingDialog'

const components = [
  AlertsComponent,
  ValidatableInputComponent,
  ChartComponent,
  CheckboxEditCellComponent,
  CogActivityComponent,
  ColourInputComponent,
  ColourMetadataComponent,
  ConfirmationDialogComponent,
  DateGridCellComponent,
  DateShiftGridCellComponent,
  DateInputComponent,
  DateShiftInputComponent,
  DateTimeGridCellComponent,
  DefaultGridCellComponent,
  DefaultColouredCellComponent,
  DefaultGridHeaderComponent,
  DefaultActionsCellComponent,
  DialogEditFormComponent,
  DisabledCheckboxCellComponent,
  EditFormComponent,
  EditGenericComponent,
  ExpansionFilterFormComponent,
  FilterFormBasicComponent,
  FilterFormComponent,
  FilteredListComponent,
  FilteredTableComponent,
  FormattedDateShiftComponent,
  FormattedDateShiftRangeComponent,
  InlineInputComponent,
  MapEditorComponent,
  MaskInputComponent,
  NavBarComponent,
  PanelToggleButtonComponent,
  PopoverModalComponent,
  ProgressOverlayComponent,
  SectionHeaderComponent,
  TourComponent,
  TreeComponent,
  UploadFormBasicComponent,
  UploadFormComponent,
  WarningCardComponent
]

const pipes =  [
  CustomDatePipe,
  DateShiftPipe
]

const componentsWithPipes = [
  AlertsComponent,
  ValidatableInputComponent,
  ChartComponent,
  CheckboxEditCellComponent,
  CogActivityComponent,
  ColourInputComponent,
  ColourMetadataComponent,
  ConfirmationDialogComponent,
  DateGridCellComponent,
  DateShiftGridCellComponent,
  DateInputComponent,
  DateShiftInputComponent,
  DateTimeGridCellComponent,
  DefaultGridCellComponent,
  DefaultColouredCellComponent,
  DefaultGridHeaderComponent,
  DefaultActionsCellComponent,
  DialogEditFormComponent,
  DisabledCheckboxCellComponent,
  EditFormComponent,
  EditGenericComponent,
  ExpansionFilterFormComponent,
  FilterFormBasicComponent,
  FilterFormComponent,
  FilteredListComponent,
  FilteredTableComponent,
  FormattedDateShiftComponent,
  FormattedDateShiftRangeComponent,
  InlineInputComponent,
  MapEditorComponent,
  MaskInputComponent,
  NavBarComponent,
  PanelToggleButtonComponent,
  PopoverModalComponent,
  ProgressOverlayComponent,
  SectionHeaderComponent,
  TourComponent,
  TreeComponent,
  UploadFormBasicComponent,
  UploadFormComponent,
  WarningCardComponent,
  CustomDatePipe,
  DateShiftPipe
]

@NgModule({
  imports: [
    AgGridModule.withComponents([
      CheckboxEditCellComponent, DateGridCellComponent, DateShiftGridCellComponent, DateTimeGridCellComponent, DefaultColouredCellComponent,
      DefaultActionsCellComponent, DefaultGridCellComponent, DefaultGridHeaderComponent, DisabledCheckboxCellComponent]),
    ColorPickerModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    IntlModule,
    MaterialModule,
    NgxDatatableModule,
    ServicesModule,
    ReactiveFormsModule,
    RouterModule,
    SliderModule,
    NgUploaderModule
  ],
  declarations: componentsWithPipes,
  providers: [
    CustomDatePipe,
    DateShiftPipe,
    ActivityDialogService,
    DatePipe,
    Log,
    FormService,
    TourService
  ],
  entryComponents: components,
  exports: [
    AlertsComponent,
    ValidatableInputComponent,
    ChartComponent,
    CheckboxEditCellComponent,
    CogActivityComponent,
    ColourInputComponent,
    ColourMetadataComponent,
    ConfirmationDialogComponent,
    DateGridCellComponent,
    DateShiftGridCellComponent,
    DateInputComponent,
    DateShiftInputComponent,
    DateTimeGridCellComponent,
    DefaultGridCellComponent,
    DefaultColouredCellComponent,
    DefaultGridHeaderComponent,
    DefaultActionsCellComponent,
    DialogEditFormComponent,
    DisabledCheckboxCellComponent,
    EditFormComponent,
    EditGenericComponent,
    ExpansionFilterFormComponent,
    FilterFormBasicComponent,
    FilterFormComponent,
    FilteredListComponent,
    FilteredTableComponent,
    FormattedDateShiftComponent,
    FormattedDateShiftRangeComponent,
    InlineInputComponent,
    MapEditorComponent,
    MaskInputComponent,
    NavBarComponent,
    PanelToggleButtonComponent,
    PopoverModalComponent,
    ProgressOverlayComponent,
    SectionHeaderComponent,
    TourComponent,
    TreeComponent,
    UploadFormBasicComponent,
    UploadFormComponent,
    WarningCardComponent,
    CustomDatePipe,
    DateShiftPipe,
    SliderComponent
  ]
})
export class CoreComponentsModule {}
