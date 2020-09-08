import { TaskEffectService } from './Task.effects'
import { expectOnceWith, fetchMock, sinon, StoreMock } from '../../../../utils/tests'
import { TaskService, ITask } from 'entities'
import { MockHttp } from '../../entities/_framework/fixtures'
import { TasksActionType, ITaskState } from '../reducers/Tasks.reducer'
import { Observable } from 'rxjs'
import { modelContextStringToArray } from './Task.utils'

const { TaskState } = TaskService.meta.fieldNames
const proto = TaskEffectService.prototype
describe('Stores: Task Effects Service', () => {
  let service: TaskEffectService
  let taskService: TaskService
  let fetch
  let fetchPromise
  let mockHttp
  let store

  beforeEach(() => {
    const mockFetch = fetchMock()
    fetch = mockFetch.mock
    fetchPromise = mockFetch.promise
    mockHttp = MockHttp(fetch)
    taskService = new TaskService(mockHttp)
    store = new StoreMock(Observable.from([1]))
    service = new TaskEffectService(taskService, store as any)
  })

  describe('modelContextStringToArray', () => {
    const nullCtxt = '[null]'
    const validCtxt = '[Shift [201609211], Shift [201609212/pretend key]]'
    describe(`modelContexts is ${nullCtxt}`, () => {
      it('should just return an empty array', () => {
        expect(modelContextStringToArray(nullCtxt)).toEqual([])
      })
    })

    describe(`modelContexts is ${validCtxt}`, () => {
      it('should produce an array of objects in expected format', () => {
        const expected = [{
          entityName: 'Shift',
          primaryKeyString: '201609211',
          primaryKeys: ['201609211']
        }, {
          entityName: 'Shift',
          primaryKeyString: '201609212/pretend key',
          primaryKeys: ['201609212', 'pretend key']
        }]
        expect(modelContextStringToArray(validCtxt)).toEqual(expected)
      })
    })
  })

  describe(proto.mergeTasks.name, () => {
    it('should dispatch correct message to store', () => {
      service.mergeTasks([])
      expectOnceWith(store.dispatch, {
        type: TasksActionType.MergeTasks,
        tasks: []
      })
    })
  })

  describe(proto.setFailed.name, () => {
    it('should dispatch correct message to store', () => {
      service.setFailed()
      expectOnceWith(store.dispatch, {
        type: TasksActionType.SetUpdateFailed
      })
    })
  })

  describe(proto.cancelTask.name, () => {
    it('should just act as a proxy method for TaskService.cancelTask', () => {
      const prom = Promise.resolve(void 0)
      taskService.cancelTask = sinon.stub(taskService, 'cancelTask').returns(prom)
      const result = service.cancelTask('a task' as any)

      expectOnceWith(taskService.cancelTask, 'a task')
    })
  })

  describe(proto.removeTask.name, () => {
    it('should call dispatch on then callback', () => {
      service.removeTask('a task' as any).catch()
      fetchPromise.thenCB()
      expectOnceWith(store.dispatch, {
        type: TasksActionType.RemoveTask,
        task: 'a task'
      })
    })
  })

  describe(proto.updateTasks.name, () => {
    let mergeTasks
    let setFailed
    beforeEach(() => {
      mergeTasks = sinon.stub(service, 'mergeTasks')
      setFailed = sinon.stub(service, 'setFailed')
      service.updateTasks()
    })

    it('should call mergeTasks method when then callback is triggered', () => {
      fetchPromise.thenCB({ data: 'test' })

      expectOnceWith(mergeTasks, 'test')
    })

    // TODO: Figure out if this is a legit failure
    // it('should call setFailed method when catch callback is invoked', () => {
    //   fetchPromise.catchCB()
    // })
  })

  describe('Getters (store queries)', () => {
    let task
    let task2
    let task3
    let storeState: ITaskState
    beforeEach(() => {
      task = {
        modelContexts: '',
        state: TaskState.Cancelled,
        progress: 10,
        taskId: '1'
      }
      task2 = {
        state: TaskState.Complete,
        modelContexts: '',
        progress: 100,
        taskId: '2'
      }
      task3 = {
        state: TaskState.Failed,
        modelContexts: '',
        progress: 75,
        taskId: '3'
      }

      storeState = {
        failCount: 0,
        tasks: [task, task2, task3],
        previousTaskStates: {
          1: TaskState.Running,
          2: TaskState.Complete,
          3: TaskState.Stopping
        }
      }
      store = new StoreMock(Observable.from([{ tasks: storeState }]))
      service = new TaskEffectService(taskService, store as any)
    })

    describe('tasks$', () => {
      it('should provide next list of tasks on subscribe', () =>
        service.tasks$
          .subscribe(tasks =>
            expect(tasks).toEqual(storeState.tasks.map(task => ({ ...task, contextArr: [] })))))
    })

    describe('previousStates$', () => {
      it('should provide next list of previous task states on subscribe',
        () => service.previousStates$.subscribe(states => expect(states).toEqual(storeState.previousTaskStates)))
    })
    const taskById = (id: string) => (task: ITask) => task.taskId === id
    describe('activeTasks$', () => {
      beforeEach(() => {
        storeState.tasks = storeState.tasks.concat([{
          taskId: '4',
          modelContexts: '',
          state: TaskState.Running
        } as any, {
          taskId: '5',
          modelContexts: '',
          state: TaskState.Stopping
        } as any])
      })

      it('should should not contain task 1 on subscribe', () => {
        service.activeTasks$
          .subscribe(tasks => expect(!!tasks.find(taskById('1'))).toBe(false))
      })

      it('should should not contain task 2 on subscribe', () => {
        service.activeTasks$
          .subscribe(tasks => expect(!!tasks.find(taskById('2'))).toBe(false))
      })

      it('should should not contain task 3 on subscribe', () => {
        service.activeTasks$
          .subscribe(tasks => expect(!!tasks.find(taskById('3'))).toBe(false))
      })

      it('should should contain task 4 on subscribe', () => {
        service.activeTasks$
          .subscribe(tasks => expect(!!tasks.find(taskById('4'))).toBe(true))
      })

      it('should should contain task 4 on subscribe', () => {
        service.activeTasks$
          .subscribe(tasks => expect(!!tasks.find(taskById('4'))).toBe(true))
      })
    })

    describe('inactiveTasks$', () => {
      beforeEach(() => {
        storeState.tasks.push({
          taskId: '4',
          modelContexts: '',
          state: TaskState.Running
        } as any)
      })

      it('should should contain task 1 on subscribe', () => {
        service.inactiveTasks$
          .subscribe(tasks => expect(!!tasks.find(taskById('1'))).toBe(true))
      })

      it('should should contain task 2 on subscribe', () => {
        service.inactiveTasks$
          .subscribe(tasks => expect(!!tasks.find(taskById('2'))).toBe(true))
      })

      it('should should contain task 3 on subscribe', () => {
        service.inactiveTasks$
          .subscribe(tasks => expect(!!tasks.find(taskById('3'))).toBe(true))
      })

      it('should should not contain task 4 on subscribe', () => {
        service.inactiveTasks$
          .subscribe(tasks => expect(!!tasks.find(taskById('4'))).toBe(false))
      })
    })

    describe('taskChangedState$', () => {
      it('should include task 1 on subscribe', () => {
        service.tasksChangedState$
          .subscribe(tasks => expect(!!tasks.find(task => task.taskId === '1')).toBe(true))
      })

      it('should include task 3 on subscribe', () => {
        service.tasksChangedState$
          .subscribe(tasks => expect(!!tasks.find(task => task.taskId === '3')).toBe(true))

      })

      it('should not include task 2 on subscribe', () => {
        service.tasksChangedState$
          .subscribe(tasks => expect(!!tasks.find(task => task.taskId === '2')).toBe(false))
      })
    })
  })
})
