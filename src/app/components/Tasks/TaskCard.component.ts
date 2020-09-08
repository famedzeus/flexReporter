import { Component, EventEmitter, Input, Output } from '@angular/core'
import { TaskComponent } from './Task.component'
import { ITask } from 'entities'
export interface ITaskCardTask extends ITask {
  description: string           // Description for task
  additionalInformation: string // Further info (after progress indicator)
}
@Component({
  selector: 'task-card',
  styleUrls: ['./TaskCard.component.scss'],
  template: `
    <mat-card class="eases">
      <div [ngSwitch]="task.state">
        <mat-card-title>
          {{ 'Task' | translate }}:
          {{ 'task_state_' + task.state.toLowerCase() | translate }} {{ task.name }}
        </mat-card-title>
        <mat-card-subtitle>{{ task.progress | translate }}</mat-card-subtitle>

        <span class="sub-subtitle">({{ 'Started' | translate }} {{ timeAgo(task.started) }})</span>
        <div *ngSwitchCase="'RUNNING'" class="task-content">

          <progress-donut
            [title]="'Complete' | translate"
            bgColor="#ddd"
            [progressWidth]="10"
            [radius]="64"
            [percent]="task.percentComplete"></progress-donut>
          <p>
            {{ task.description | translate }}
          </p>

          <p>{{ task.additionalInformation | translate }}</p>

          <button mat-raised-button color="warn"
            [matTooltip]="'cancel_task' | translate"
            (click)="onCancelTask.emit(task)">
            <i class="fa fa-warning"></i>
            {{ 'Stop' | translate }}
          </button>
        </div>
        <div *ngSwitchCase="'STOPPING'" class="task-content"></div>
        <ng-content style="height:160px"></ng-content>
      </div>
    </mat-card>
  `
})
export class TaskCardComponent extends TaskComponent {
  @Output() onCancelTask = new EventEmitter<ITask>()
  @Input() task: ITask
}
