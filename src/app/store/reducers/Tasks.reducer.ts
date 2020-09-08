import { partition, isEqual } from 'lodash'
import { ITask } from 'entities'

type Tasks = Array<ITask>

export enum TasksActionType {
  ResetTasks = 'RESET_TASKS',
  MergeTasks = 'MERGE_TASKS',
  RemoveTask = 'REMOVE_TASK',
  SetUpdateFailed = 'TASKS_UPDATE_FAILED'
}

export interface ITasksAction {
  type: TasksActionType
  tasks?: Tasks
  task?: ITask
}

export interface ITaskState {
  tasks: Tasks
  previousTaskStates: {
    [taskId: string]: string
  }
  failCount: number
}

const initialState: ITaskState = {
  failCount: 0,
  previousTaskStates: {},
  tasks: []
}

let previousState = {}
try {
  previousState = JSON.parse(window.localStorage.getItem('tasks') || "{}")
} catch (e) {}

const getListMerger = comparitor => (old: Tasks, next: Tasks) => {

  const [existing, newTasks] = partition(next, task => old.some(comparitor(task)))

  return old
    .map(task => {
      const updatedTask = existing.find(comparitor(task))

      if (updatedTask === undefined) return null

      if (isEqual(updatedTask, task)) {
        return task
      }

      return updatedTask
    })
    .filter(task => task !== null)
    .concat(newTasks)
}

export const tasks = (state: ITaskState = Object.assign(initialState, previousState), action: ITasksAction): ITaskState => {
  switch (action.type) {
    case TasksActionType.ResetTasks:
      return {
        ...state,
        previousTaskStates: {},
        tasks: []
      }

    case TasksActionType.MergeTasks: {
      return {
        ...state,
        failCount: 0,
        tasks: getListMerger(task => taskN => taskN.taskId === task.taskId)(state.tasks, action.tasks),
        previousTaskStates: state.tasks.reduce((acc, task) => ({ ...acc, [task.taskId]: task.state }), {})
      }
    }

    case TasksActionType.RemoveTask: {
      const { taskId } = action.task
      return {
        ...state,
        tasks: state.tasks.filter(task => task.taskId !== taskId)
      }
    }

    case TasksActionType.SetUpdateFailed: {
      return {
        ...state,
        failCount: state.failCount + 1
      }
    }

    default:
      return state
  }
}
