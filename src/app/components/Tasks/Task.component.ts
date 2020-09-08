import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { TaskEffectService } from 'effects'
import { TaskService, ITask } from 'entities'
import * as moment from 'moment'

const { TaskState } = TaskService.meta.fieldNames

/**
 * Presentational component for display of a Task
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'task',
  styleUrls: ['./Task.component.scss'],
  template: `
    <mat-list-item>
      <div mat-list-icon class="flex list-icon-large">
        <mat-spinner [diameter]="25" *ngIf="task.state === 'RUNNING'"></mat-spinner>
        <i *ngIf="task.state !== 'RUNNING'"
          class="fa"
          [matTooltip]="'task_state_' + task.state.toLowerCase() | translate"
          [class.fa-check-circle]="task.state === 'COMPLETE'"
          [class.fa-users]="task.state === 'QUEUED'"
          [class.fa-stop-circle]="task.state === 'STOPPING'"
          [class.fa-times-circle]="task.state === 'CANCELLED'"
          [class.fa-exclamation-circle]="task.state === 'FAILED'"></i>
      </div>
      <div mat-line>
        {{ task.name }} - {{ task.progress }}
      </div>

      <mat-progress-bar
        mat-line
        mode="determinate"
        [color]="getProgressColour(task)"
        [value]="task.percentComplete"></mat-progress-bar>
      <span mat-line *ngIf="task.completed">
        {{taskTimeLocale(task) | translate}} {{ timeAgo(task.completed) }}
      </span>
      <span mat-line *ngIf="task.state === 'RUNNING'">
        {{'started' | translate }} {{ timeAgo(task.started) }}
      </span>
      <div>
        <button color="warn"
          *ngIf="hideCancelButton !== true && isTaskInProgress(task)"
          [matTooltip]="'cancel_task' | translate"
          (click)="onCancelTask.emit(task)"
          mat-mini-fab>
          <i class="fa fa-times"></i>
        </button>
      </div>
    </mat-list-item>
  `
})
export class TaskComponent {
  @Output() onCancelTask = new EventEmitter<ITask>()
  @Output() onClearTask = new EventEmitter<ITask>()
  @Input() task: ITask
  @Input() hideCancelButton = false

  getProgressColour (task: ITask) {
    switch (task.state) {
      case TaskState.Failed:
        return 'warn'
      case TaskState.Running:
        return 'primary'
      case TaskState.Stopping:
        return 'warn'
      default:
        return 'accent'
    }
  }

  timeAgo (time: string) {
    return moment(time).fromNow()
  }

  isTaskInProgress (task: ITask) {
    return task.state === TaskState.Running || task.state === TaskState.Queued
  }

  taskTimeLocale (task: ITask) {
    switch (task.state) {
      case TaskState.Complete:
        return 'completed'
      case TaskState.Cancelled:
        return 'cancelled'
      default:
        return 'failed'
    }
  }
}
