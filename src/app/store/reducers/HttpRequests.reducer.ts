export enum HttpRequestActionType {
  AddRequest = 'HTTP_REQUEST_ADD',
  SetRequestFailed = 'HTTP_REQUEST_FAILURE',
  SetRequestSuccess = 'HTTP_REQUEST_SUCCESS'
}

export interface HttpRequestAction {
  type: HttpRequestActionType
}
export interface HttpRequests {
  failCount: number,
  pendingRequestCounter: number,
  totalRequestCounter: number
}
const defaultState: HttpRequests = {
  failCount: 0,
  pendingRequestCounter: 0,
  totalRequestCounter: 0
}

/**
 * Reducer for an global activity state message.  More boilerplate but leads to more
 * discrete and type controlled code.
 */
export const httpRequests = (state = defaultState, action: HttpRequestAction): HttpRequests => {
  switch (action.type) {
    case HttpRequestActionType.AddRequest:
      return {
        ...state,
        pendingRequestCounter: state.pendingRequestCounter + 1,
        totalRequestCounter: state.totalRequestCounter + 1
      }

    case HttpRequestActionType.SetRequestSuccess:
      return {
        ...state,
        pendingRequestCounter: state.pendingRequestCounter - 1,
      }

    case HttpRequestActionType.SetRequestFailed:
      return {
        ...state,
        failCount: state.failCount + 1,
        pendingRequestCounter: state.pendingRequestCounter - 1,
      }

    default:
      return state
  }
}
