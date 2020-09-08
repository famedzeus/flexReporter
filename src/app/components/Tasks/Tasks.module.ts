import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule, MatListModule, MatDialogModule, MatCardModule, MatMenuModule,
  MatProgressBarModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material'
import { IntlModule } from '../../intl'
import { CoreComponentsModule } from '../core/core.module'
import { TasksManagerService } from './TasksManager.service'
import { TaskComponent } from './Task.component'
import { TasksComponent } from './Tasks.component'
import { TasksContainerComponent } from './TasksContainer.component'
import { TasksPanelComponent } from './TasksPanel.component'
import { TaskCardComponent } from './TaskCard.component'
import { EffectsModule } from '../../store/effects.module'
import { ProgressDonutComponent } from '../SVGComponents/cSVGProgressDonut/ProgressDonut.component'
import { TaskCardsComponent } from './TaskCards.component'

import { TaskManagementComponent } from './TaskManagement.component'

const components = [
  
  ProgressDonutComponent,
  TaskCardComponent,
  TaskCardsComponent,
  TaskComponent,
  TasksComponent,
  TasksContainerComponent,
  TasksPanelComponent,
  TaskManagementComponent
]
/**
 * Angular module to handle and display tasks.
 * Reactive so depends on external storage/effects module.
 */
@NgModule({
  imports: [
    CommonModule,
    CoreComponentsModule,
    EffectsModule,
    IntlModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  declarations: components,
  exports: components,
  entryComponents: components,
  providers: [TasksManagerService]
})
export class TasksModule {}
