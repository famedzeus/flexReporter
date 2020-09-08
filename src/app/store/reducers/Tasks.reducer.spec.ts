import { ITaskState, tasks, TasksActionType } from './Tasks.reducer'
import { TaskService } from 'entities'
import { deepFreezeReducer } from '../utils'
import {
  mergeListAction,
  mergeMappedListAction,
  removeTaskAction,
  setFailedAction } from './Tasks.reducer.fixtures'
const { TaskState } = TaskService.meta.fieldNames
const reducer = deepFreezeReducer(tasks)

/**
 * Use of recursive property freezing (deepFreeze) is to
 * ensure that no mutation is occuring.
 */
describe('Stores: Tasks reducer', () => {
  let state: ITaskState

  describe('initialisation reduce', () => {
    it('should return the default state', () => {
      state = reducer(undefined, { type: null })
      expect(state)
        .toEqual({
          failCount: 0,
          previousTaskStates: {},
          tasks: []
        })
    })
  })

  describe(TasksActionType.MergeTasks, () => {
    beforeEach(() => {
      state = reducer(undefined, { type: null })
    })

    describe('First merge', () => {
      it('should set initial list of tasks as they are provided', () => {
        state = reducer(state, mergeListAction)

        expect(state)
          .toEqual({
            failCount: 0,
            previousTaskStates: {},
            tasks: mergeListAction.tasks
          })
      })
    })

    describe('Next merges', () => {
      beforeEach(() => {
        state = reducer(state, mergeListAction)
        state = reducer(state, mergeMappedListAction)
      })

      it('should correctly merge in same task with new status', () => {
        const expected = mergeMappedListAction.tasks.slice(0,4)
        expect(state.tasks)
          .toEqual(expected)
      })

      it('should correctly record previous task state', () => {
        expect(state.previousTaskStates)
          .toEqual({
            333399993243242: TaskState.Running,
            3243243242: TaskState.Complete,
            3243224598242: TaskState.Cancelled,
            320002298242: TaskState.Queued,
            32432298242: TaskState.Stopping,
            32777998242: TaskState.Failed
          })
      })
    })
  })

  describe(TasksActionType.RemoveTask, () => {
    let previousState: ITaskState
    beforeEach(() => {
      state = [
        { type: null },
        mergeListAction
      ].reduce<ITaskState>(tasks as any, undefined)
      previousState = state
    })

    it('should remove correct task from next state', () => {
      state = reducer(state, removeTaskAction)
      expect(state.tasks).toEqual(
        previousState.tasks.filter(task => task.taskId !== '3243224598242')
      )
    })

    it('should not change the current state', () => {
      expect(state).toEqual(previousState)
    })
  })

  describe(TasksActionType.SetUpdateFailed, () => {
    it('should increment counter', () => {
      const initialState = reducer(undefined, { type: null })

      state = reducer(initialState, setFailedAction)

      expect(state)
        .toEqual({
          ...initialState,
          failCount: 1
        })
    })
  })
})
