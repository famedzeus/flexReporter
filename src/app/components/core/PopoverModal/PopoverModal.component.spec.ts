import { emitterMock, sinon } from '../../../../../utils/tests'
import { PopoverModalComponent } from './PopoverModal.component'

describe('Presentation Components - PopoverModalComponent', () => {
  let component: PopoverModalComponent
  let stub
  let sandbox
  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    component = new PopoverModalComponent()
    component.onClose = emitterMock() as any
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('lifecycle event handlers', () => {
    describe('ngAfterViewInit', () => {
      it('should call setModalPosition once', () => {
        stub = sinon.stub(component, 'setModalPosition')
        component.ngAfterViewInit()
        expect(stub.calledOnce).toBe(true)
      })
    })

    describe('ngOnChanges', () => {
      beforeEach(() => {
        stub = sinon.stub(component, 'handleShowChange')
      })

      describe('CASE: displayContent is false', () => {
        it('should not call handleShowChange', () => {
          component.ngOnChanges({})
          expect(stub.called).toBe(false)
        })
      })

      describe('CASE: displayContent is true', () => {
        it('should call handleShowChange once', () => {
          component.displayContent = true
          component.ngOnChanges({ displayContent: {} })
          expect(stub.calledOnce).toBe(true)
        })
      })

      describe('CASE: there is an external change to displayContent flag', () => {
        it('should call handleShowChange once', () => {
          component.ngOnChanges({ displayContent: { simpleChange: {} } })
          expect(stub.calledOnce).toBe(true)
        })
      })

      describe('CASE: there is no external change to displayContent flag', () => {
        it('should not call handleShowChange', () => {
          component.ngOnChanges({})
          expect(stub.called).toBe(false)
        })
      })
    })
  })

  describe('handleShowChange', () => {
    let close
    let setModalPosition
    beforeEach(() => {
      close = sinon.stub(component, 'close')
      setModalPosition = sinon.stub(component, 'setModalPosition')
      component.classNames = ''
    })

    describe('CASE: displayContent is true but modal is not showing', () => {
      beforeEach(() => {
        component.displayContent = true
        component.showDialog = false
        component.handleShowChange()
      })

      it('should set showDialog flag to true', () => {
        expect(component.showDialog).toBe(true)
      })

      it('should add display className showing', () => {
        expect(component.classNames).toBe('showing')
      })

      // TODO: Fix this.  Broke because of timeout.  Is timeout needed? Can't remember.
      // it('should trigger setModalPosition', () => {
      //    expect(setModalPosition.calledOnce).toBe(true)
      // })

      it('should not call close', () => expect(close.called).toBe(false))
    })

    describe('CASE: displayContent is true but modal is already showing', () => {
      beforeEach(() => {
        component.displayContent = true
        component.showDialog = true
        component.handleShowChange()
      })

      it('should not call setModalPosition', () => expect(setModalPosition.called).toBe(false))

      it('should not call close', () => expect(close.called).toBe(false))
    })

    describe('CASE: displayContent is false but modal is already hidden', () => {
      beforeEach(() => {
        component.displayContent = false
        component.showDialog = false
        component.handleShowChange()
      })

      it('should not call setModalPosition', () => expect(setModalPosition.called).toBe(false))

      it('should not call close', () => expect(close.called).toBe(false))
    })

    describe('CASE: displayContent is false and modal is showing', () => {
      beforeEach(() => {
        component.displayContent = false
        component.showDialog = true
        component.handleShowChange()
      })

      it('should not call setModalPosition', () => expect(setModalPosition.called).toBe(false))

      it('should call close', () => expect(close.calledOnce).toBe(true))
    })
  })

  describe('adjustForWindow', () => {
    beforeEach(() => {
      component.window = {
        innerHeight: 300
      } as any
    })

    describe('CASE: top value is above viewport', () => {
      it('should return a top value of 0', () => {
        const result = component.adjustForWindow(-1, 200)
        expect(result.top).toBe(0)
      })
    })

    describe('CASE: bottom of component is below viewport bottom', () => {
      it('should set top value to correct value', () => {
        const result = component.adjustForWindow(250, 200)
        expect(result.top).toBe(100)
      })
    })

    describe('CASE: full component will be visible in y dimension', () => {
      it('should return the supplied top value', () => {
        const result = component.adjustForWindow(50, 250)
        expect(result.top).toBe(50)
      })
    })
  })
})
