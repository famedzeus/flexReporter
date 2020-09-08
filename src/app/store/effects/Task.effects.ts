import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { orderBy } from 'lodash'
import { TaskService, ITask } from 'entities'
import { ITaskState, TasksActionType } from '../reducers/Tasks.reducer'
import { modelContextStringToArray } from './Task.utils'

const { TaskState, started } = TaskService.meta.fieldNames
const INACTIVE_TASK_ENUMS = [TaskState.Cancelled, TaskState.Failed, TaskState.Complete]
const ACTIVE_TASK_ENUMS = [TaskState.Running, TaskState.Stopping]

@Injectable()
export class TaskEffectService {
  constructor (
    private Task: TaskService,
    private store: Store<{ tasks: ITaskState}>
  ) {}

  mergeTasks (tasks: Array<ITask>) {
    this.store
      .dispatch({
        type: TasksActionType.MergeTasks,
        tasks
      })
  }

  setFailed () {
    this.store
      .dispatch({
        type: TasksActionType.SetUpdateFailed
      })
  }

  resetTasks () {
    this.store
      .dispatch({
        type: TasksActionType.ResetTasks
      })
  }

  cancelTask (task: ITask): Promise<any> {
    return this.Task.cancelTask(task)
      // We don't care if the request fails - fire and forget.  This catch prevents error in console
      .catch(() => {})
  }

  removeTask (task: ITask) {
    return this.Task
      .delete(task)
      .then(() => {
        this.store
          .dispatch({
            type: TasksActionType.RemoveTask,
            task
          })
      })
  }

  updateTasks () {
    return this.Task
      .query()
      .then(response => {
        this.mergeTasks(response.data)
      })
      .catch(e => {
        this.setFailed()
        throw e
      })
  }

  get tasks$ () {
    return this.store.select(state => state.tasks.tasks)
      .map(tasks => orderBy(tasks, [started], ['desc']))
      .map(tasks => tasks.map(task => ({ ...task, contextArr: modelContextStringToArray(task.modelContexts) })))
  }

  /**
   * Observable of tasks which have a new state
   */
  get tasksChangedState$ () {
    return this.previousStates$
      .flatMap(previousStates => {
        return this.tasks$
          .first()
          .map(tasks => tasks.filter(task => previousStates[task.taskId] !== task.state))
      })
  }

  get store$ () {
    return this.store.select(state => state.tasks)
  }

  get previousStates$ () {
    return this.store.select(state => state.tasks.previousTaskStates)
  }

  get activeTasks$ () {
    return this.tasks$
      .map(tasks => {
        return tasks.filter(task => ACTIVE_TASK_ENUMS.some(taskState => taskState === task.state))
      })
  }

  /**
   * Failed task api request count
   */
  get failCount$ () {
    return this.store
      .select(state => state.tasks.failCount)
  }

  get inactiveTasks$ () {
    return this.tasks$
      .map(tasks => {
        return tasks.filter(task => INACTIVE_TASK_ENUMS.some(taskState => taskState === task.state))
      })
  }
}
