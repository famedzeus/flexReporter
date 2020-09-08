import { emitterMock, expectOnceWith, eventMock, sinon } from '../../../../../utils/tests'
import { InlineInputComponent } from './InlineInput.component'

describe('component: InlineInputComponent', () => {
  let component: InlineInputComponent
  let bindings
  let onSave
  let onKeyDown
  beforeEach(() => {
    onKeyDown = emitterMock()
    onSave = emitterMock()
    component = new InlineInputComponent()
    bindings = {
      onKeyDown,
      onSave
    }
    Object.assign(component, bindings)
  })

  describe('ngOnChanges', () => {
    let changes
    let onPersisted
    beforeEach(() => {
      onPersisted = sinon.stub(component, 'onPersisted')
      changes = {
        isPersisting: {
          currentValue: false
        }
      }
    })

    it('should call onPersisted once', () => {
      component.ngOnChanges(changes)
      expect(onPersisted.calledOnce).toBe(true)
    })

    const expectFalse = () => {
      component.ngOnChanges(changes)
      expect(onPersisted.called).toBe(false)
    }

    it('should not call onPersisted', () => {
      component.editDisabled = true
      expectFalse()
    })

    it('should not call onPersisted', () => {
      delete changes.isPersisting
      expectFalse()
    })

    it('should not call onPersisted', () => {
      changes.isPersisting.currentValue = true
      expectFalse()
    })
  })

  describe('onPersisted', () => {
    beforeEach(() => {
      component.edited = false
      component.editing = true
      component.changed = true
      component.onPersisted()
    })

    it('should set edited flag to true',
      () => expect(component.edited).toBe(true))

    it('should set editing flag to false',
      () => expect(component.editing).toBe(false))

    it('should set changed flag to false',
      () => expect(component.changed).toBe(false))
  })

  describe('startEditing', () => {
    beforeEach(() => {
      component.editing = false
      component.editDisabled = true
    })

    it('should not set editing flag as true', () => {
      component.startEditing()
      expect(component.editing).toBe(false)
    })

    it('should set editing flag as true', () => {
      component.editDisabled = false
      component.startEditing()
      expect(component.editing).toBe(true)
    })
  })

  // TODO: Complete tests - work out significance of function return value
  describe('checkKey', () => {
    let $event
    let result
    beforeEach(() => {
      $event = eventMock()
      component.changed = false
    })

    const tabCursors = [9, 37, 39]

    describe('edit disabled is false', () => {
      describe('TabCursor key codes', () => {
        tabCursors.forEach(keyCode => {
          beforeEach(() => {
            $event.which = keyCode
            result = component.checkKey($event)
          })
          it(`should return true for keyCode: ${keyCode}`, () => {
            expect(result).toBe(true)
          })

          it('should not set changed flag to true',
            () => expect(component.changed).toBe(false))
        })
      })
    })
  })

  describe('onKeyPressDown', () => {
    let $event
    const callMethod = () => component.onKeyPressDown($event)
    beforeEach(() => {
      $event = eventMock()
      component.editDisabled = false
      component.changed = false
    })

    describe('editDisabled is false', () => {
      beforeEach(callMethod)
      it('should flag that the input has changed', () => {
        expect(component.changed).toBe(true)
      })

      it('should emit for onKeyDown', () => {
        expectOnceWith(onKeyDown.emit, $event)
      })
    })

    describe('editDisabled is not false', () => {
      it('should call preventDefault to stop input entry', () => {
        component.editDisabled = true
        callMethod()
        expect($event.preventDefault.calledOnce).toBe(true)
      })
    })
  })

  describe('commitChange', () => {
    it('should call emit for onSave', () => {
      component.field = { fieldName: 'test' }
      component.model = 2
      component.commitChange()
      expectOnceWith(onSave.emit, { test: 2 })
    })
  })

  describe('onBlurInput', () => {
    it('should edit editing flag to false', () => {
      component.editing = true
      component.onBlurInput()
      expect(component.editing).toBe(false)
    })
  })
})
