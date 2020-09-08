import {
  sinon,
  emitterMock,
  timeoutMock } from '../../../../../utils/tests'
import { AlertsComponent } from './Alerts.component'
import { IAlert, IAlerts } from './Alert.types'

describe('components.Alerts', () => {
  let component: AlertsComponent
  let $timeout
  let toMock
  let emitter

  beforeEach(() => {
    toMock = timeoutMock(true)
    $timeout = toMock.mock
    component = new AlertsComponent()
    emitter = emitterMock()
    Object.assign(component, { emitter })
  })

  describe('ngOnInit', () => {
    let addAlert
    beforeEach(() => {
      addAlert = sinon.stub(component, 'addAlert')
      component.ngOnInit()
    })

    it('should subscribe to emitter events', () => {
      expect(emitter.subscribe.calledOnce).toBe(true)
    })

    // it('should call addAlert when subscribe callback is triggered', () => {
    //   const alert = { test: true }
    //   emitter.subCB(alert)
    //   expectOnceWith(addAlert, alert)
    // })
  })

  describe('addAlert', () => {
    let alert: IAlert
    let removeAlert
    beforeEach(() => {
      alert = { type: 'danger', message: 'pie', displayMilliseconds: 500 }
      removeAlert = sinon.stub(component, 'removeAlert')
    })
    describe('alerts are enabled', () => {
      beforeEach(() => component.addAlert(alert))

      it('should add alert to alerts array',
        () => expect(component.alerts).toEqual([alert]))

      // it('should trigger removeAlert',
      //   () => expectOnceWith(removeAlert, alert))
    })

    describe('alerts are disabled', () => {
      beforeEach(() => {
        component.alertsDisabled = true
        component.addAlert(alert)
      })

      it('should not add alert to alerts array',
        () => expect(component.alerts).toEqual([]))

      it('should not trigger removeAlert',
        () => expect(removeAlert.called).toBe(false))
    })
  })

  describe('clearAlerts', () => {
    it('should set alerts to empty array', () => {
      component.alerts = [null, null]
      component.clearAlerts()
      expect(component.alerts).toEqual([])
    })
  })

  describe('removeAlerts', () => {
    let alerts: IAlerts = [{
      type: 'success', message: 'm1', displayMilliseconds: 500
    }, {
      type: 'danger', message: 'm2', displayMilliseconds: 500
    }, {
      type: 'success', message: 'm3', displayMilliseconds: 500
    }]

    beforeEach(() => {
      component.alerts = alerts.concat()
    })

    it('should remove correct alert', () => {
      component.removeAlert(alerts[1])
      expect(component.alerts).toEqual([alerts[0], alerts[2]])
    })

    it('should not remove any alerts', () => {
      component.removeAlert(alerts[3])
      expect(component.alerts).toEqual(alerts)
    })

    it('should only remove 1 alert', () => {
      component.removeAlert(alerts[1])
      component.removeAlert(alerts[1])
      expect(component.alerts).toEqual([alerts[0], alerts[2]])
    })

    it('should remove 2 alerts', () => {
      component.removeAlert(alerts[1])
      component.removeAlert(alerts[0])
      expect(component.alerts).toEqual([alerts[2]])
    })

    // it('should call $timeout.cancel with provided timeout', () => {
    //   const mock = <angular.IPromise<any>>promiseMock()
    //   component.removeAlert(alerts[0], mock)
    //   expectOnceWith(toMock.mock.cancel, mock)
    // })
  })
})
