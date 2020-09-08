import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { TasksManagerService } from './TasksManager.service'

@Component({
  selector: 'task-management',
  styleUrls: ['./TaskManagement.component.scss'],
  template: `
  <a href=""
    [matMenuTriggerFor]="tasks"
    [class.tasks-active]="tasksAreActive"
    [matTooltip]="getTooltipLocale() | translate"
    (click)="$event.preventDefault(); dismiss()">
    <i class="fa fa-tasks"></i>
    <i class="fa fa-cog"></i>
  </a>

  <div class="task-completion-alert" *ngIf="tasksCompleted && alertDismissed === false">
    <div class="button-pointer"></div>
    <h6>
      <i class="fa fa-info-circle"></i>
      {{ 'task_finished_running' | translate }}
    </h6>

    <button mat-raised-button (click)="dismiss()" color="accent">
      {{ 'Ok' | translate }}
    </button>
  </div>

  <mat-menu #tasks>
    <tasks-container class="tasks-management-container"></tasks-container>
  </mat-menu>
  `
})

export class TaskManagementComponent implements OnDestroy, OnInit {
  subscriptions: Array<Subscription> = []
  tasksCompleted = false
  alertDismissed = true
  tasksAreActive = false

  constructor(
    private tasksManager: TasksManagerService
  ) {}

  ngOnInit () {
    // Setup state based upon current task information
    this.subscriptions = this.subscriptions
      .concat([
        this.tasksManager
          // Failed/completed taasks
          .completedTasks$
          .subscribe(tasks => {
            this.tasksCompleted = tasks.length > 0
            this.alertDismissed = false
          }),

        this.tasksManager
          .activeTasks$
          .subscribe(activeTasks => {
            this.tasksAreActive = activeTasks.length > 0
          })
      ])
  }

  ngOnDestroy () {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  dismiss () {
    this.alertDismissed = true

    this.tasksManager.persistStoreLocal()
  }

  getTooltipLocale () {
    if (this.tasksAreActive) {
      return 'tasks_tooltip_active'
    }

    return 'tasks_tooltip'
  }
}