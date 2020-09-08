import { NgModule } from '@angular/core'
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatSidenavModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatCommonModule,
  MatIconModule,
  MatLineModule,
  MatOptionModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatGridListModule,
  MatTableModule,
  MatStepperModule,
  MatRadioModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatToolbarModule,
  MatTabsModule,
  MatExpansionModule,
  MatSelectModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatMenuModule
} from '@angular/material'

const imports = [
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatSidenavModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatGridListModule,
  MatTableModule,
  MatStepperModule,
  MatPaginatorModule,
  MatCommonModule,
  MatLineModule,
  MatOptionModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatToolbarModule,
  MatTabsModule,
  MatExpansionModule,
  MatSelectModule,
  MatNativeDateModule,
  MatIconModule,
  MatCheckboxModule,
  MatMenuModule
]

@NgModule({
  imports,
  exports: imports
})
export class MaterialModule {

}
