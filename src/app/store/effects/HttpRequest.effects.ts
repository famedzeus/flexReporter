import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { HttpRequests, HttpRequestActionType, HttpRequestAction } from '../reducers/HttpRequests.reducer'

/**
 * Service to interact with the HttpRequest store
 */
@Injectable()
export class HttpRequestEffectService {
  ignoreList = ['Task', 'Vehicle']
  constructor (
    private store: Store<{ httpRequests: HttpRequests }>
  ) {}

  isOnIgnoreList (entityName: string) {
    return this.ignoreList.some(entityNameN => entityNameN === entityName)
  }

  // Action dispatchers

  addRequest (entityName: string) {
    if (this.isOnIgnoreList(entityName)) return void 0

    this.store
      .dispatch<HttpRequestAction>({
        type: HttpRequestActionType.AddRequest
      })
  }

  requestSuccess (entityName: string) {
    if (this.isOnIgnoreList(entityName)) return void 0

    this.store
      .dispatch<HttpRequestAction>({
        type: HttpRequestActionType.SetRequestSuccess
      })
  }

  requestFailure (entityName: string) {
    if (this.isOnIgnoreList(entityName)) return void 0

    this.store
      .dispatch<HttpRequestAction>({
        type: HttpRequestActionType.SetRequestFailed
      })
  }

  get pendingRequests$ () {
    return this.store.select(store => store.httpRequests.pendingRequestCounter).distinctUntilChanged()
  }

  get hasPendingRequests$ () {
    return this.store.select(store => store.httpRequests.pendingRequestCounter > 0).distinctUntilChanged()
  }
}
