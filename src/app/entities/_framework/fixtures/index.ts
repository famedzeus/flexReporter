import {
  EntityMeta,
  Uri,
  ActionUri
} from '../decorators'
import { sinon, emitterMock } from '../../../../../utils/tests'
import { Resource } from '../resource'
import { HttpHelper } from 'services'

export const MockHttp = (fetchMock) => {

  class MockFetchHttp extends HttpHelper {
    successCallback
    errorCallback
    protected fetchMethod = fetchMock

    constructor () {
      super(emitterMock() as any, {
        mockURL: sinon.stub().returns('mockUrl/'),
        URL: sinon.stub().returns('url/')
      } as any,
      { addRequest: sinon.stub(), requestSuccess: sinon.stub(), requestFailure: sinon.stub() } as any)
    }
  }

  const http = new MockFetchHttp()

  sinon.stub(http, 'successInterceptor', (request, response) => request.successTransformHandler(response))
  sinon.stub(http, 'errorInterceptor', (request, response) => request.errorHandler(response))

  return http
}

@EntityMeta({
  constraints: {},
  fieldNames: {
    fieldName: 'fieldName'
  },
  fields: []
})
@Uri('tests/:testParam/multi/:testParam2/:testParam3')
export class TestResource extends Resource<any> {

  @ActionUri('tests/customUri')
  getCustom (r) {
    return r
  }
}
