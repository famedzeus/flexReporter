import { emitterMock, expectOnceWith, sinon, promiseMock } from '../../../utils/tests'
import { HttpHelper, IRequestInformation } from './http'
import { ServerInfo } from '../services/ServerInfo'

const requestInfo: IRequestInformation = {
  entityName: 'ScheduleScope',
  isMock: true,
  created: new Date(),
  descriptorValue: 'Test 1',
  url: 'scheduleScopes',
  dataType: 'json',
  method: 'POST',
  body: {
    scheduleScopeName: 'Test 1'
  },
  query: {
    mockParam: 1,
    testParam: 'string'
  },
  successTransformHandler: sinon.stub(),
  errorHandler: sinon.stub()
}
describe('services.HttpHelper', () => {
  let instance: HttpHelper
  let emitter
  let prom
  let fetch
  let mockUrl = 'localhost:8091/'
  let serverInfo: ServerInfo
  beforeEach(() => {
    emitter = emitterMock()
    prom = promiseMock()
    serverInfo = new ServerInfo()
    fetch = sinon.stub()
    // Extend helper with stub fetch method
    class MockFetchHttp extends HttpHelper {
      protected fetchMethod = fetch
    }

    serverInfo.mockURL = () => mockUrl
    instance = new MockFetchHttp(emitter, serverInfo, { addRequest: sinon.stub(), requestSuccess: sinon.stub(), requestFailure: sinon.stub() } as any)
  })

  describe('Request Handling Functions', () => {
    let successTransformHandler
    let errorHandler

    beforeEach(() => {
      successTransformHandler = sinon.stub()
      errorHandler = sinon.stub()
      Object.assign(requestInfo, {
        successTransformHandler, errorHandler
      })
    })

    describe('fetch (fetch api wrapper)', () => {

      it('should call fetch with expected url & params', () => {
        const expectedUrl = mockUrl + 'scheduleScopes' + `?mockParam=1&testParam=string`
        const expectedParams = {
          credentials: void 0,
          body: `{"scheduleScopeName":"Test 1"}`,
          method: 'POST',
          headers: {
            'content-type': `application/json`
          }
        }

        instance.fetch(requestInfo)
        expectOnceWith(fetch, expectedUrl, expectedParams)
      })

      describe('successInterceptor', () => {
        let response: Response
        let errorInterceptor

        beforeEach(() => {
          errorInterceptor = sinon.stub()
          instance.errorInterceptor = errorInterceptor
          response = {
            ok: true
          } as Response
        })

        describe('Method: POST, alertsEnabled', () => {
          beforeEach(() => {
            instance.successInterceptor(requestInfo, response)
          })

          it('should emit alert with correct locale key and params', () => {
            expectOnceWith(emitter.emit, {
              messageLocale: 'success_POST2::ScheduleScope::Test 1',
              scopeId: 'global',
              messageType: 'http',
              alertType: 'success',
              titleLocale: ''
            })
          })

          it('should call success handler with response', () => {
            expectOnceWith(successTransformHandler, response)
          })

          it('should not call the errorInterceptor', () => {
            expect(errorInterceptor.called).toBe(false)
          })
        })

        describe('Method: POST, alertsDisabled', () => {
          beforeEach(() => {
            instance.successInterceptor(requestInfo, response, true)
          })

          it('should not emit alert', () => {
            expect(emitter.emit.called).toBe(false)
          })

          it('should call success handler with response', () => {
            expectOnceWith(successTransformHandler, response)
          })

          it('should not call the errorInterceptor', () => {
            expect(errorInterceptor.called).toBe(false)
          })
        })

        describe('Method: GET, alertsEnabled', () => {
          beforeEach(() => {
            requestInfo.method = 'GET'
            instance.successInterceptor(requestInfo, response)
          })

          it('should not emit alert', () => {
            expect(emitter.emit.called).toBe(false)
          })

          it('should call success handler with response', () => {
            expectOnceWith(successTransformHandler, response)
          })

          it('should not call the errorInterceptor', () => {
            expect(errorInterceptor.called).toBe(false)
          })
        })

      })

      describe('errorInterceptor', () => {
        let response: Response
        let stashError
        let getErrorMessageKey

        beforeEach(() => {
          stashError = sinon.stub()
          getErrorMessageKey = sinon.stub().returns('error_locale')
          Object.assign(instance, { getErrorMessageKey, stashError })
        })

        describe('Response is an Error - uh oh (CORS etc)', () => {
          beforeEach(() => {
            response = new Error('fetch error test') as any
            instance.errorInterceptor(requestInfo, response)
          })

          it('should stash error', () => {
            expectOnceWith(stashError, requestInfo, { statusText: 'Fetch error' })
          })

          it('should emit error alert', () => {
            expectOnceWith(emitter.emit, {
              messageLocale: 'fetch_error',
              scopeId: 'global',
              messageType: 'http',
              alertType: 'error',
              titleLocale: '',
              rawMessage: undefined,
              validationFailures: undefined
            })
          })

          it('should call error handler with empty body (feed error forward)', () => {
            expectOnceWith(errorHandler, {
              body: {}, status: null
            })
          })
        })

        describe('Response is not an error', () => {
          let json
          let jsonPromise
          beforeEach(() => {
            jsonPromise = promiseMock()
            json = sinon.stub().returns(jsonPromise)
            response = {
              status: 500,
              json
            } as any
            instance.errorInterceptor(requestInfo, response)
          })

          // it('should emit error alert', () => {
          //   expectOnceWith(emitter.emit, {
          //     messageLocale: 'error_locale::',
          //     scopeId: 'global',
          //     messageType: 'http',
          //     alertType: 'error',
          //     titleLocale: ''
          //   })
          // })

          it('should attempt to convert body to json', () => {
            expect(json.calledOnce).toBe(true)
          })

          // it('should add then handler', () => {
          //   const body = { errorBody: true }
          //   jsonPromise['thenCB'](body)
          //   expectOnceWith(errorHandler, {
          //     body, status: 500
          //   })
          //   expectOnceWith(stashError, requestInfo, response, body)
          // })

          // it('should add catch handler', () => {
          //   const body = null
          //   jsonPromise['catchCB'](body)
          //   expectOnceWith(errorHandler, {
          //     body, status: 500
          //   })
          //   expectOnceWith(stashError, requestInfo, response, body)
          // })
        })
      })
    })
  })

})
