import { Injectable } from '@angular/core'
import { AlertEmitter } from './alert-emitter'
import { ServerInfo } from './ServerInfo'
import { BbssApiErrorBody } from '../entities/entity.types'
import { isArray, pick } from 'lodash'
import { HttpRequestEffectService } from '../store/effects/HttpRequest.effects'

/**
 * Transforms an object object to query string
 * Does not handle nested objects
 */
const objToQuery = (obj: any = {}) => Object.keys(obj).reduce((acc, key) => {
  const val = obj[key]
  if (!val) return acc
  if (isArray(val)) {
    return acc.concat(val.map(subVal => `${encodeURIComponent(key)}=${encodeURIComponent(subVal as string)}`))
  }
  return acc.concat([`${key}=${val}`])
}, []).join('&')

export type HttpMethodType = 'GET' | 'POST' | 'PUT' | 'DELETE'
export interface IRequestInformation {
  created: Date
  descriptorValue: number | string | undefined
  entityName: string
  url: string
  isMock?: boolean
  dataType: 'text' | 'json'
  method: HttpMethodType
  body: { [prop: string]: any }
  query: { [prop: string]: any }
  successTransformHandler: (response: Response) => void
  errorHandler: (errResponse: { body: any, status: number }) => void
}

/**
 * @description
 * Factory which will produce a generic error emitter
 */
@Injectable()
export class HttpHelper {
  errors = []
  responseFailed = false
  protected fetchMethod = fetch.bind(window)

  constructor (
    private alertEmitter: AlertEmitter,
    private ServerInfo: ServerInfo,
    private httpRequestEffects: HttpRequestEffectService
  ) {}

  /**
   * Wrapper for fetch API request
   */
  fetch (request: IRequestInformation) {
    const url: string = request.isMock ? this.ServerInfo.mockURL() : this.ServerInfo.URL()
    const body = ['GET', 'DELETE'].some(m => m === request.method) ? undefined : JSON.stringify(request.body)
    const queryString = objToQuery(request.query)
    const query = queryString ? `?${queryString}` : ``

    this.httpRequestEffects.addRequest(request.entityName)

    return this.fetchMethod(`${url}${request.url}${query}`, {
      credentials: request.isMock ? void 0 : 'include',
      body,
      method: request.method,
      headers: {
        'content-type': `application/${request.dataType}`
      }
    })
  }
  /**
   * Parses and handles a success response
   * @param request Request details
   * @param response Fetch response object
   */
  successInterceptor (request: IRequestInformation, response: Response, disableAlert = false, customSuccessMessage?: string) {
    this.httpRequestEffects.requestSuccess(request.entityName)

    this.responseFailed = false
    if (this.alertEmitter && disableAlert !== true && request.method !== 'GET') {
      this.alertEmitter
        .emit({
          scopeId: 'global',
          messageType: 'http',
          alertType: 'success',
          titleLocale: '',
          messageLocale: customSuccessMessage
            ? this.addDescriptionToCustomMessage(customSuccessMessage, request)
            : this.getSuccessMessageKey(request)
        })
    }

    return request.successTransformHandler(response)
  }

  /**
   *
   * @param request Request details
   * @param response Fetch response object
   */
  errorInterceptor (request: IRequestInformation, response: Response, customErrorLocaleCodes = {}, errorSuppressionCodes: Array<number> = []) {
    this.httpRequestEffects.requestFailure(request.entityName)

    const handleError = body => {
      if (request.errorHandler) {
        request.errorHandler({ body, status: response.status })
      }
      this.stashError(request, response, body)
      return body
    }

    if (response instanceof Error) {
      const resp: Error = response

      this.stashError(request, { statusText: 'Fetch error' } as Response, {})
      if (this.responseFailed === false) {
        this.emitErrorAlert('fetch_error')
        this.responseFailed = true
      }

      return Promise.reject(request.errorHandler({ body: {}, status: null }))
        // Prevent Zone.js error in console if error not handled elsewhere
        .catch(r => { throw r })
    }

    // Get promise body as json for error then reject so that catch can be used with server data
    if (response.status === 401) {
      // this.UserAuth.navigateUnauth()
    }


    // Attempt to get json message body from error but reject both scenarios
    return  response.json()
      .then((errorInfo: BbssApiErrorBody) => {
        if (!errorSuppressionCodes.includes(response.status)) {
          // const errorMessageKey = customErrorLocaleCodes[response.status] || (this.getErrorMessageKey(request, response) + `::${request.entityName}`)
          this.emitErrorAlert(errorInfo.message, errorInfo.rawMessage, errorInfo.validationFailures)
        }
        throw errorInfo

      })
      .catch(errorInfo => { throw handleError(errorInfo || {}) })
  }

  private addDescriptionToCustomMessage (messageKey: string, request: IRequestInformation) {
    return [messageKey, request.descriptorValue as string].join('::')
  }

  private getSuccessMessageKey (request: IRequestInformation) {
    const params = [request.entityName]
      .concat([request.descriptorValue as any].filter(val => val !== undefined  && val !== ""))
    return [`success_${request.method}${params.length}`].concat(params).join('::')
  }

  private getErrorMessageKey (request: IRequestInformation, response: Response) {
    switch (response.status) {
      case 409:
        return 'http_error_409'
      case 410:
        return 'http_error_410'
      case 500:
        return 'http_error_500'
      default:
        return 'http_request_error'
    }
  }

  private stashError (request: IRequestInformation, response: Response, body) {
    const stashed = new Date()

    const errorInfo = {
      stashed: stashed.toISOString(),
      requestDuration: stashed.getTime() - request.created.getTime(),
      response: Object.assign(pick(response, [
        'status', 'statusText', 'type'
      ]), { body }),
      request: Object.assign({}, request, {
        created: request.created.toISOString(),
        successTransformHandler: null,
        errorHandler: null
      })
    }

    this.errors.push(errorInfo)
  }

  private emitErrorAlert (messageKey: string, rawMessage?: string, validationFailures?: Array<any>) {
    this.alertEmitter
      .emit({
        scopeId: 'global',
        messageType: 'http',
        alertType: 'error',
        titleLocale: '',
        messageLocale: messageKey,
        rawMessage,
        validationFailures
      })
  }
}
