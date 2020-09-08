import { Injectable } from '@angular/core'
import { TaskService, TaskState, ITask } from 'entities'
import { TaskEffectService, UserAlertEffectService } from 'effects'
import * as moment from 'moment'

const POLL_INTERVAL_MIN = 5000
const POLL_INTERVAL_MAX = 20000

@Injectable()
export class TasksManagerService {
  private pollInterval = 5000
  private pollTimeoutId: number = null

  constructor (
    private taskEffects: TaskEffectService,
    private userAlerts: UserAlertEffectService
  ) {
    this.createSubscriptions()
  }

  createSubscriptions () {
    /**
     * For each completed or failed task
     * find if their state has changed and if so dispatch alert for each
     */
    this.completedTasks$
      .subscribe(tasks => {

        tasks.forEach(task => this.alertTaskCompletion(task))
      })

    this.taskEffects
      .failCount$
      .distinctUntilChanged()
      .subscribe(failCount => {
        if (failCount === 1) {
          this.taskEffects.resetTasks()
        }
      })
  }

  get anyStoppedTasks$ () {
    return this.taskEffects
      .tasksChangedState$
      .map(tasks => tasks.filter(
        task =>
          task.state === TaskState.Complete
          || task.state === TaskState.Cancelled
          || task.state === TaskState.Failed))
      .filter(tasks => tasks.length > 0)
  }

  get completedTasks$ () {
    return this.taskEffects
      .tasksChangedState$
      .map(tasks => tasks.filter(
        task =>
          task.state === TaskState.Complete
          || task.state === TaskState.Failed))
      .filter(tasks => tasks.length > 0)
  }

  cancelTask (task: ITask) {
    return this.taskEffects.cancelTask(task)
  }

  /**
   * Makes request to remove tasks via taskEffects for each inactive task in store
   */
  clearInactiveTasks () {
    this.taskEffects
      .inactiveTasks$
      .first()
      .subscribe(tasks =>
        tasks.forEach(task => this.taskEffects.removeTask(task))
      )
  }

  start () {
    if (this.pollTimeoutId !== null) return void 0

    this.tasks$
      .subscribe(tasks => {
        const someActiveTasks = tasks.some(task => task.state === TaskState.Running)
        if (someActiveTasks) {

          this.pollInterval = this.pollInterval <= 1000 ? 500 : (this.pollInterval - 1000)
        } else {
          this.pollInterval = POLL_INTERVAL_MIN
        }
      })

    this.triggerNext(this.pollInterval)
  }

  stop () {
    clearTimeout(this.pollTimeoutId)
    this.pollTimeoutId = null
  }

  /**
   * Invokes task effects to updateTasks
   */
  pollTasks () {
    this.taskEffects
      .updateTasks()
      .then(() => {
        this.pollTimeoutId = null
        this.triggerNext(this.pollInterval)
      })
      .catch((e) => {
        const pollInterval = this.pollInterval + 1000
        this.pollInterval = pollInterval < POLL_INTERVAL_MAX ? pollInterval : POLL_INTERVAL_MAX
        this.pollTimeoutId = null
        this.triggerNext(this.pollInterval)

      })
  }

  /**
   * Nudge the poller to increase frequency.  Useful if the app thinks a
   * task is about to start processing.
   */
  spikePolling () {
    clearTimeout(this.pollTimeoutId)
    this.pollInterval = 500;
    this.pollTasks()
  }

  persistStoreLocal () {
    this.taskEffects
      .store$
      .first()
      .subscribe(storeState => {
        localStorage.setItem('tasks', JSON.stringify(storeState))
      })
  }

  /**
   * Invokes alert effects service's addAlert message
   * @param task Task which has been completed or failed
   */
  alertTaskCompletion (task: ITask) {
    // Only mark alerts as important if complete and fairly recently completed.
    // -> This will prevent issue with notification redisplay
    const isImportant = task.completed
      ? (new Date()).getTime() - moment(task.completed).toDate().getTime() < 30000
      : false

    switch (task.state) {
      case TaskState.Complete:
        return this.userAlerts
          .addAlert({
            scopeId: 'global',
            alertType: 'success',
            titleLocale: `task_state_complete`,
            messageLocale: task.name,
            isImportant
          })

      case TaskState.Failed:

        return this.userAlerts
          .addAlert({
            scopeId: 'global',
            alertType: 'error',
            titleLocale: `task_state_failed`,
            messageLocale: task.name,
            isImportant
          })

      default: return void 0
    }
  }

  get failCount$ () {
    return this.taskEffects.failCount$
  }

  get tasks$ () {
    return this.taskEffects.tasks$
  }

  get activeTasks$ () {
    return this.taskEffects.activeTasks$
  }

  private triggerNext (pollInterval: number) {
    if (this.pollTimeoutId) return void 0

    this.pollTimeoutId = setTimeout(() => this.pollTasks(), pollInterval)
  }
}
