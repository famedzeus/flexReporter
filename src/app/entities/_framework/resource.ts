import {
  Action
} from './decorators'
import { takeWhile } from 'lodash'
import { IRecordField, IResourceQuery } from '../entity.types'

/**
 * Boilerplate default response handlers for a resource service
 *
 * Intended to be extended to create domain specific resource Repos
 */
export abstract class Resource<T> {
  constraints
  fields
  fieldNames
  /** Provide entity name as string to be used as unique identity of a resource.  As a string so it's minification proof. **/
  readonly entityName: string

  constructor (public HttpHelper) {}

  @Action('POST')
  save (response): Promise<T> {
    return response.json()
  }

  @Action('DELETE')
  delete (response): Promise<any> {
    return response.text()
  }

  @Action('GET')
  find (response): Promise<T> {
    return response.json()
  }

  @Action('PUT')
  update (response): Promise<void> {
    // No content returned here
    return response
  }

  @Action('GET')
  query (response): Promise<{ data: Array<T>, headers: Function }> {
    // provide headers as function like $resource for now
    return response
      .json()
      .then(response => {
        return response
      })
      .then((data) => ({ data, headers: () => ({
          'x-total-count': response.headers.get('x-total-count')
        })
      }))
      .catch(e => {
        return e
      })
  }
}

interface Params extends IResourceQuery {
  [key: string]: any
}

/**
 * Resource interface/method types
 */
export type ResourceMethod<T> = (params ?: Params) => Promise<T>
export type ResourceMethodAny<T> = (params ?: Params) => Promise<any>
export type ResourceMethod2<T> = (params: Params, data: T) => Promise<T>
export type ResourceMethod3<T, U> = (params: Params, data: T) => Promise<U>
export type ResourceMethodQuery<T> = (params ?: Params) => Promise<{ headers: any, data: Array<T> }>

export interface IResource<T> {
  meta
  constraints
  entityName: string
  fields: { [fieldName: string]: IRecordField }
  fieldList: Array<IRecordField>
  fieldNames
  save: ResourceMethod2<T>
  find: ResourceMethod<T>
  update: ResourceMethod2<T>
  query: ResourceMethodQuery<T>
  delete: ResourceMethod<T>
}

/**
 * Helper function to take a url like users/:id and
 * sinterpolate param values for example:
 *  CASE params has a prop id of 4
 *    => users/4
 *  CASE params has an undefined id prop
 *    => users
 * @param uri
 * @param params
 */
export const interpolateUri =
  (uri: string, params: {}) =>
    // Separate uri to strings -> swap template params with values -> rejoin as string
    takeWhile(
      uri
      .split('/')
      .map(part => {
        if (part.match(/:(.*)/ig)) {
          const str = part.substr(1, part.length - 1)
          const segment = params[str]
          return segment === undefined || segment === null
            ? segment
            : encodeURIComponent(segment)
        }

        return part
      }),
      val => val !== undefined && val !== null
    ).join('/')
