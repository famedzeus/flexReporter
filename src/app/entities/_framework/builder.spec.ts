import { expectOnceWith, fetchMock } from '../../../../utils/tests'
import {
  makeResourceService
} from './builder'
import { MockHttp, TestResource } from './fixtures'
import { isFunction } from 'lodash'

describe('makeResourceService', () => {
  let fetch
  let resource
  beforeEach(() => {
    fetch = fetchMock().mock
    interface Ignore {}
    class Test extends makeResourceService<TestResource, Ignore>(TestResource) {}
    resource = new Test(MockHttp(fetch))
  })

  describe('Default methods derived from abstract Resource class', () => {

    const testDefaultMethod = (methodName, method = 'GET', body = undefined, dataType = 'json') => {
      describe(`${methodName} method`, () => {
        it('should exist as a function', () => {
          expect(isFunction(resource[methodName])).toBe(true)
        })

        it('should make fetch call to correct url', () => {
          resource[methodName]({})
          expectOnceWith(fetch, 'url/tests')
        })

        it('should make fetch call to correct url', () => {
          resource[methodName]({
            testParam: 1,
            testParam2: 'pie',
            testParam3: 2,
            params: {
              testParam: 1,
              testParam2: 'pie',
              testParam3: 2
            }
          })
          expectOnceWith(fetch, 'url/tests/1/multi/pie/2?testParam=1&testParam2=pie&testParam3=2', {
            credentials: 'include',
            body: JSON.stringify(body),
            method,
            headers: {
              'content-type': `application/` + dataType
            }
          })
        })
      })
    }

    [ ['delete', 'DELETE'],
      ['query', 'GET'],
      ['update', 'PUT', {}],
      ['save', 'POST', {}]
    ].forEach((args) => testDefaultMethod(args[0], args[1] as any, args[2]))

    describe(`custom get method`, () => {
      it('should exist as a function', () => {
        expect(isFunction(resource.getCustom)).toBe(true)
      })

      it('should make fetch call to correct url', () => {
        resource.getCustom({})
        expectOnceWith(fetch, 'url/tests/customUri')
      })

      it('should make fetch call to correct url', () => {
        resource.getCustom({
          params: {
            testParam: 1,
            testParam2: 'pie',
            testParam3: 2
          }
        })
        expect(fetch.calledOnce).toBe(true)
        expectOnceWith(fetch, 'url/tests/customUri?testParam=1&testParam2=pie&testParam3=2', {
          credentials: 'include',
          body: undefined,
          method: 'GET',
          headers: {
            'content-type': `application/json`
          }
        })
      })
    })

  })
})
