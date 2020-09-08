import * as s from 'sinon/pkg/sinon'
import { Pipe, PipeTransform, NgModule } from '@angular/core'
import { assign } from 'lodash'
import { Observable } from 'rxjs'
import { SinonStub } from 'sinon'
export const sinon = s

export class StoreMock extends Observable<any> {
  dispatch = sinon.stub()
  constructor (public observable) {
    super(...observable)
    this.observable = observable
  }

  select (query) {
    if (typeof query === 'function') return this.observable.map(state => query(state))

    return this.observable.map(state => state[query])
  }
}

export type StubbedObject = { [key: string]: SinonStub }
const stubsFromKeys = (keys: Array<string>) =>
  keys
    .reduce<StubbedObject>((acc, key) => {
      return {
        ...acc,
        [key]: sinon.stub()
      }
    }, {})

export const stubsForInstance = obj =>
  stubsFromKeys(Object.keys(obj))

export const protoToSinonStubs = fn =>
  stubsFromKeys(Object.keys(fn.prototype))

@Pipe({ name: 'translate' })
export class TranslatorPipe implements PipeTransform {
  transform(value: any): any {
    // Do stuff here, if you want
    return value
  }
}

export const combineProtoStubs = (...all) => {
  return all.reduce<StubbedObject>((acc, next) => Object.assign(acc, protoToSinonStubs(next)), {})
}

/**
 * NOTE: I have created stubs outside of angular framework for a few reasons
 *        * I think that they are clearer & simpler than ngMocks to use
 *        * It makes no sense to couple tests with ng1 mocks due to the fact
 *           that these interfaces will become obsolute in near future
 *        * Some things that would be useful are not mocked by angular team anyway
 */
export const logMock = () => ({
  debug: sinon.stub(),
  error: sinon.stub(),
  info: sinon.stub(),
  log: sinon.stub()
})

export const eventMock = () => {
  const event = {
    currentTarget: {
      blur: sinon.mock()
    },
    preventDefault: sinon.stub()
  }
  return event
}

export const promiseMock = () => {
  const promise = {}
  const callbacks = ['then', 'catch', 'finally']
  callbacks.forEach(handlerName => {
    promise[handlerName] = cb => {
      promise[`${handlerName}CB`] = cb
      return promise
    }
    sinon.spy(promise, handlerName)
  })

  return promise as Promise<any>
}

export const dialogMock = () => {
  const close = sinon.stub()
  const open = sinon.stub()
  open.returns({
    close
  })
  return {
    open,
    close
  }
}

export const timeoutMock = (shouldInvoke) => {
  const promise = promiseMock()
  const timeout = {
    promise,
    callbacks: [],
    mock(cb) {
      if (shouldInvoke) {
        cb()
      } else {
        timeout.callbacks.push(cb)
      }
      return promise
    }
  }
  timeout.mock['cancel'] = sinon.stub()
  return timeout
}

export const cacheFactoryMock = () => {
  const instance = {
    get: sinon.stub(),
    put: sinon.stub(),
    info: sinon.stub()
  }
  const mock = function() { return instance } as any
  /* tslint:disable */
  mock.info = () => {}
  /* tslint:enable */
  mock.get = mock.info
  return {
    instance,
    mock
  }
}

export const scopeMock = () => {
  const $onCallbacks = {}
  const $on = (eventName, cb) => {
    $onCallbacks[eventName] = cb
  }
  const scope = {
    $broadcast: sinon.stub(),
    $emit: sinon.stub(),
    $on,
    $onCallbacks
  }
  const $onSpy = sinon.spy(scope, '$on')
  Object.assign(scope, { $onSpy })

  return scope
}

export const resourceMock = () => {
  const deletePromise = promiseMock()
  const queryPromise = promiseMock()
  const savePromise = promiseMock()
  const updatePromise = promiseMock()
  return {
    delete: sinon.stub().returns({
      $promise: deletePromise
    }),
    query: sinon.stub().returns({
      $promise: queryPromise
    }),
    save: sinon.stub().returns({
      $promise: savePromise
    }),
    update: sinon.stub().returns({
      $promise: updatePromise
    }),
    deletePromise,
    savePromise,
    queryPromise,
    updatePromise,
    constraints: {},
    fieldNames: {},
    fields: {}
  }
}

export const emitterMock = () => {
  const emitter = {
    emit: sinon.stub(),
    subscribe: null,
    subCB: null
  }
  emitter.subscribe = cb => emitter.subCB = cb
  sinon.spy(emitter, 'subscribe')
  return emitter
}
export const expectOnceWith = (stub, ...args) => {
  expect(stub.calledOnce).toBe(true)
  expect(stub.calledWith(...args)).toBe(true)
}

export const binder = (fn, bindings) => {
  fn.prototype = assign(fn.prototype, bindings)
  return fn
}

export const fetchMock = () => {
  const promise = promiseMock()
  const json = sinon.stub().returns(promise)
  const text = sinon.stub().returns(promise)

  const prom: any = {}

  prom.then = (cb) => {
    cb({ ...promise, json, text, ok: true })
    return promise
  }

  prom.catch = cb => {
    cb({ ...promise, json, text, ok: true })
    return promise
  }
  const mock = {
    mock(url, config) {
      return prom
    },
    promise
  }
  sinon.spy(mock, 'mock')
  return mock
}

@NgModule({
  declarations: [TranslatorPipe]
})
export class UnitTestMockModule {}
