import 'reflect-metadata'
import { HttpMethodType } from '../../services/http'

type NumStrHash = { [errorCode: number]: string }
export interface EntitySpec {
  constraints: any
  fieldNames: any
  constants?: {
    [key: string]: any
  }
  fields: any,
  requestErrorLocaleCodes?: {
    GET?: NumStrHash,
    PUT?: NumStrHash,
    POST?: NumStrHash,
    DELETE?: NumStrHash
  }
}

/**
 * Class decorators
 * @decorators
 * Collection of decorators which can be used for resource repo declarations
 */

/**
 * Use decorator to add metadata for entity
 */
export function EntityMeta (info: EntitySpec) {
  return function (constructor: Function) {
    return Reflect.defineMetadata('Entity', info, constructor, 'metadata')
  }
}

export function EntityName (entityName: string) {
  return function (constructor: Function) {
    return Reflect.defineMetadata('Entity', entityName, constructor, 'entityName')
  }
}

/**
 * Use decorator to declare a default uri to use when making a query, save, delete, update request.
 * Uri will be interpolated if needed by provided request arguments using colon to declare interpolated paramter.
 *
 * Example - `api/users/:id`
 * @param uri General resource uri string for Entity persistance
 */
export function Uri (uri: string) {
  return function (constructor: Function) {
    return Reflect.defineMetadata('Entity', uri, constructor, 'uri')
  }
}

/**
 * Declare that all persistance requests should use a separate mock API endpoint
 */
export function Mock () {
  return (constructor: Function) =>
    Reflect.defineMetadata('Entity', true, constructor, 'mock')
}

/**
 * Prevent automatic use of user alerts for persistance success
 */
export function NoSuccessAlerts () {
  return (constructor: Function) =>
    Reflect.defineMetadata('Entity', true, constructor, 'NoSuccessAlerts')
}

/**
 * Method decorators
 */

/**
 * Http method type.  GET, POST etc
 */
export function Action (method: HttpMethodType = 'GET') {
  return Reflect.metadata('UriMeta:Action', method)
}
/**
 * Data type to be expected
 * @param type
 */
export const Data = (type: 'text' | 'json' = 'json') => {
  return Reflect.metadata('UriMeta:ActionData', type)
}
/**
 * Attatches uri metadata to class method for a custom request
 * @param uri Uri to make request with. Example `users/adminOnly`
 */
export const ActionUri = (uri: string) => {
  return Reflect.metadata('UriMeta:ActionUri', uri)
}

/**
 * Decorator to declare that no success user alert events should be emitted for a successful request.
 *
 * A scenario for this would be if custom alerts might be needed.
 */
export const SuppressSuccessAlert = () => {
  return Reflect.metadata('UriMeta:SuppressSuccessAlert', true)
}

/**
 * Decorator for a custom success aleart
 */
export const CustomSuccessAlertMessage = (messageLocale: string) => {
  return Reflect.metadata('UriMeta:CustomSuccessAlertMessage', messageLocale)
}

/**
 * Declare which errors you would like to be 'suppressed'. (not show user alert for)
 * @param statusCodes A list of status codes for which no user alert events should be dispatched
 */
export const SuppressErrors = (statusCodes: Array<number>) => {
  return Reflect.metadata('UriMeta:SuppressErrors', statusCodes)
}
/**
 * Declare that you would like to
 */
export const MockUri = () => {
  return Reflect.metadata('UriMeta:MockUri', true)
}
export const ActionParams = (params) => {
  return Reflect.metadata('UriMeta:ActionParams', params)
}
