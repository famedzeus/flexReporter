import { TaskService, ITask } from 'entities'
import { ITasksAction, TasksActionType } from './Tasks.reducer'
const { TaskState } = TaskService.meta.fieldNames

export const taskList: Array<ITask> = [{
  modelContexts: '',
  percentComplete: 40,
  state: TaskState.Running,
  taskId: '333399993243242',
  progress: 'Creating Routes and Slots',
  name: '',
  started: (new Date(((new Date()).getTime() - 35504))).toISOString(),
  completed: '',
  cancelled: false
}, {
  modelContexts: '',
  percentComplete: 100,
  state: TaskState.Complete,
  taskId: '3243243242',
  progress: 'Slot Generation Completed',
  name: '',
  started: (new Date(((new Date()).getTime() - 35504))).toISOString(),
  completed: (new Date(((new Date()).getTime() - 3559))).toISOString(),
  cancelled: false
}, {
  modelContexts: '',
  percentComplete: 39.4,
  state: TaskState.Cancelled,
  taskId: '3243224598242',
  progress: 'Solution 1 Cancelled',
  name: '',
  started: '',
  completed: '',
  cancelled: true
}, {
  modelContexts: '',
  percentComplete: 0,
  state: TaskState.Queued,
  taskId: '320002298242',
  progress: 'Solution 4 is in a queue',
  name: '',
  started: (new Date(((new Date()).getTime() - 35504))).toISOString(),
  completed: (new Date(((new Date()).getTime() - 3559))).toISOString(),
  cancelled: false
}, {
  modelContexts: '',
  percentComplete: 0,
  state: TaskState.Stopping,
  taskId: '32432298242',
  progress: 'Solution 7 is stopping',
  name: '',
  started: '',
  completed: '',
  cancelled: false
}, {
  modelContexts: '',
  percentComplete: 87,
  state: TaskState.Failed,
  taskId: '32777998242',
  progress: 'There was an issue completing this task',
  name: '',
  started: (new Date(((new Date()).getTime() - 35504))).toISOString(),
  completed: (new Date(((new Date()).getTime() - 3559))).toISOString(),
  cancelled: true
}]

export const defaultAction = {

}

export const mergeListAction: ITasksAction = {
  type: TasksActionType.MergeTasks,
  tasks: taskList
}

export const mergeMappedListAction: ITasksAction = {
  type: TasksActionType.MergeTasks,
  tasks: taskList
    .map(task => {
      if (task.state === TaskState.Running) {
        return {
          ...task,
          percentComplete: 46,
          progress: 'I am updated'
        }
      }

      return task
    })
    .slice(0, 4)
}

export const removeTaskAction = {
  type: TasksActionType.RemoveTask,
  task: taskList[2]
}

export const removeInvalidTaskAction = {
  type: TasksActionType.RemoveTask,
  task: {
    ...taskList[2],
    taskId: '234525'
  }
}

export const setFailedAction = {
  type: TasksActionType.SetUpdateFailed
}
