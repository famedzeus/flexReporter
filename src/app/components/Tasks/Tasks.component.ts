import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { MatDialog } from '@angular/material'
import { ConfirmationDialogComponent } from '../core/ConfirmationDialog'
import { TaskEffectService } from 'effects'
import { TaskService, ITask } from 'entities'
import * as moment from 'moment'

const { TaskState } = TaskService.meta.fieldNames

/**
 * Presentational component for a list of tasks.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tasks',
  styleUrls: ['./Tasks.component.scss'],
  template: `
  <mat-list *ngIf="tasks">
    <h3 mat-subheader>
      <i class="fa fa-tasks"></i>{{ titleLocale | translate }}
      <a
        *ngIf="tasks.length > 0"
        [matTooltip]="'clear_inactive_tasks' | translate"
        (click)="onClearInactiveTasks.emit()"><i class="fa fa-ban"></i></a>
    </h3>
    <warning-card
      *ngIf="requestIssueNotification"
      titleLocale="task_manager_request_errors_title"
      [warningList]="['task_manager_request_errors_content']"
      contentSuffixKey="contact_helpdesk"></warning-card>

    <task
      (onCancelTask)="confirmTaskCancel($event)"
      [task]="task"
      *ngFor="let task of tasks; trackBy: trackBy"></task>
    <mat-list-item *ngIf="tasks.length === 0">
      {{ 'no_tasks' | translate }}
    </mat-list-item>
  </mat-list>
  `
})
export class TasksComponent {
  @Output() onCancelTask = new EventEmitter<ITask>()
  @Output() onClearInactiveTasks = new EventEmitter()
  @Input() tasks: Array<ITask> = []
  @Input() titleLocale = 'tasks_heading'
  @Input() requestIssueNotification = false

  constructor (
    private dialog: MatDialog
  ) {}

  trackBy (index: number, task: ITask) {
    if (task) return task.taskId

    return index
  }

  /**
   * Opens confirm dialog and emits on cancel output if user chooses to continue
   * @param task
   */
  confirmTaskCancel (task: ITask) {
    this.dialog
      .open(ConfirmationDialogComponent)
      .afterClosed()
      .filter((confirm: boolean) => confirm === true)
      .subscribe(() => this.onCancelTask.emit(task))
  }
}
