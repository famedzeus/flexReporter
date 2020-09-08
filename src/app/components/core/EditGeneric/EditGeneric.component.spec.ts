import * as sinon from 'sinon/pkg/sinon'
import { EditGenericComponent } from './EditGeneric.component'
import { logMock, promiseMock } from '../../../../../utils/tests'

describe('component: EditGenericComponent', () => {
  let component: EditGenericComponent
  let $log
  let close
  let dismiss
  beforeEach(() => {
    $log = logMock()
    close = sinon.stub()
    dismiss = sinon.stub()
    component = new EditGenericComponent($log, {
      close
    } as any)

    Object.assign(component, {
      mode: 'Edit',
      fields: [],
      record: {
        fieldName: 'name'
      }
    })
  })

  describe('commitAction', () => {
    let promise
    let action
    beforeEach(() => {
      promise = promiseMock()
      action = sinon.stub().returns(promise)
      Object.assign(component, {
        action
      })
      component.ngOnInit()
      component.commitAction()
    })

    it('should invoke action with correct arg', () => {
      expect(action.calledWith({
        data: component.record,
        currentRecord: component.initialRecord
      })).toBe(true)
    })

    it('should add a then handler',
      () => expect(promise.then.calledOnce).toBe(true))

    it('should add a catch handler',
      () => expect(promise.catch.calledOnce).toBe(true))
  })

  describe('cancel', () => {
    it('should call instance.close', () => {
      component.cancel()
      expect(close.calledOnce).toBe(true)
    })
  })
})
