import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ITask } from 'entities'
import { Observable, Subscription } from 'rxjs'
import { TaskState } from '../../entities/Task/constants'
import { TasksManagerService } from './TasksManager.service'

@Component({
  selector: 'tasks-container',
  template: `
    <tasks
      [requestIssueNotification]="requestIssues"
      [tasks]="tasks"
      [titleLocale]="titleLocale"
      (onCancelTask)="cancelTask($event)"
      (onClearInactiveTasks)="clearInactiveTasks()"></tasks>
  `
})
export class TasksContainerComponent {
  @Input() taskNameMatch = ''
  @Input() titleLocale = 'tasks_heading'
  @Output() onTaskStopped = new EventEmitter<ITask>()
  tasks: Array<ITask> = []
  taskSubscriptions: Array<Subscription> = []
  stoppedTasks: { [taskId: number]: boolean } = {}
  requestIssues = false
  constructor (
    public tasksManager: TasksManagerService
  ) {}

  ngOnInit () {
    // Output task when task is completed
    this.taskSubscriptions = this.taskSubscriptions
      .concat(
        this.tasksManager
          .failCount$
          .subscribe(failCount => {
            this.requestIssues = failCount > 0
          }),

        this
        .tasks$
        .subscribe(tasks => {
          this.tasks = tasks
          tasks
            // Only emit completed tasks once
            .filter(task => (
              !this.stoppedTasks[task.taskId]) &&
              (task.state === TaskState.Complete || task.state === TaskState.Cancelled || task.state === TaskState.Failed)
            )
            .forEach(task => {
              this.stoppedTasks[task.taskId] = true
              this.onTaskStopped.emit(task)
            })
        })
      )
  }

  ngOnDestroy () {
    this.taskSubscriptions
      .forEach(subscription => subscription.unsubscribe())
  }

  cancelTask (task: ITask) {
    return this.tasksManager.cancelTask(task)
  }

  clearInactiveTasks () {
    this.tasksManager.clearInactiveTasks()
  }

  protected applyNameMatchFilter (tasks$: Observable<Array<ITask>>) {
    if (this.taskNameMatch) {

      return tasks$.map(tasks => {
        const regex = new RegExp(this.taskNameMatch, 'ig')
        return tasks.filter(task => task.name.match(regex))
      })
    }

    return tasks$
  }

  get tasks$ () {
    return this.applyNameMatchFilter(this.tasksManager.tasks$)
  }
}
