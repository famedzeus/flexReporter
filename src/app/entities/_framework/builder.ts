import { flatten } from './utils'
import { HttpMethodType, HttpHelper, IRequestInformation } from '../../services/http'
import {
  EntitySpec,
  Action
} from './decorators'
import { IRecordField } from '../entity.types'
import { interpolateUri } from './resource'

// A constructor type
type Constructor<T> = new (...args) => T

/**
 * Provide resource class with function calls
 * The type declarations acheive this in a type safe manner.
 *
 * Uses reflection API to extract decorated information from provided constructor so
 * that it can hook in requests and handlers automatically.
 *
 * @param Entity: A class which can extend the abstract Resource which annotated response handlers
 */
export function makeResourceService<T, U> (Entity: Constructor<any>): Constructor<U & T> {
  if (!Reflect.hasOwnMetadata('Entity', Entity, 'metadata')) {
    throw new Error('Required meta data not provideded for ' + Entity)
  }
  if (!Reflect.hasOwnMetadata('Entity', Entity, 'uri')) {
    throw new Error('Required meta data uri not provideded for ' + Entity)
  }

  // Collect metadata associated with provided Entity class
  const useMock = Reflect.hasOwnMetadata('Entity', Entity, 'mock')
  const uri: string = Reflect.getMetadata('Entity', Entity, 'uri')
  const entityName: string = Reflect.getMetadata('Entity', Entity, 'entityName')
  const metadata: EntitySpec = Reflect.getMetadata('Entity', Entity, 'metadata')
  const disableSuccessAlerts: boolean = Reflect.getMetadata('Entity', Entity, 'NoSuccessAlerts')

  // Add metadata as static properties on class
  Object.assign(Entity.prototype, {
    constraints: metadata.constraints || {},
    fields: metadata.fields,
    fieldNames: metadata.fieldNames,
    entityName
  })

  // Make fields accessible as an object map
  if (metadata.fields) {
    const fieldConstraints = Entity.prototype['constraints']
    Entity.prototype['fields'] = metadata.fields.reduce(
      (acc, field) => {
        const constraints = fieldConstraints[field.fieldName]
        // Mix constraints into field object
        const fieldWithConstraints = Object.assign({ constraints }, field)
        return Object.assign(acc, { [field.fieldName]: fieldWithConstraints })
      }, {}
    )
    Entity.prototype.fieldList = metadata.fields
  }

  // Make list of meta @decorated methods
  const methodNames = []
  for (let name in Entity.prototype) {
    if (typeof Entity.prototype[name] === 'function' && (
        Reflect.hasMetadata('UriMeta:ActionUri', Entity.prototype, name) ||
        Reflect.hasMetadata('UriMeta:Action', Entity.prototype, name)
      )
    ) {
      methodNames.push(name)
    }
  }

  // Gather all meta info about decorated API methods which will be used to create request methods
  const actions = methodNames
    .map((propName) => ({
      methodName: propName,
      method: Entity.prototype[propName],
      suppressSuccessAlerts: Reflect.getMetadata('UriMeta:SuppressSuccessAlert', Entity.prototype, propName),
      uri: Reflect.getMetadata('UriMeta:ActionUri', Entity.prototype, propName) || uri,
      actionName: Reflect.getMetadata('UriMeta:Action', Entity.prototype, propName) || 'GET',
      params: Reflect.getMetadata('UriMeta:ActionParams', Entity.prototype, propName),
      useMock: Reflect.getMetadata('UriMeta:MockUri', Entity.prototype, propName) || false,
      dataType: Reflect.getMetadata('UriMeta:ActionData', Entity.prototype, propName) || 'json',
      errorSuppressionCodes: Reflect.getMetadata('UriMeta:SuppressErrors', Entity.prototype, propName) || [],
      customSuccessMessage: Reflect.getMetadata('UriMeta:CustomSuccessAlertMessage', Entity.prototype, propName)
    }))

  // Field key to potentially be used for resource description
  const descriptorFields: Array<IRecordField> = metadata.fields.filter(field => field.isDescriptor === true)

  /**
   * Programmatically modifiying prototype of the class we are transforming
   *  => Hooks in http calls for all annotated urls/methods in place of hanlding methods
   *  => Chucks in whichever http helper.response interceptors are injected into the provided class
   *  => Clanks in the handling methods on response from async calls
   */
  actions.forEach((action) => {
    const isMock = useMock || action.useMock
    const method = action.actionName

    if (isMock) {
      console.warn(`Still using Mock API for ${method}: ${action.uri}`)
    }
    /**
     * Hook in http method handlers based upon provided class metadata
     */
    Entity.prototype[action.methodName] = function (params = {}, data = {}) {
      const interpolatedUri = interpolateUri(action.uri, params)
      const { actionName, dataType, errorSuppressionCodes } = action
      const HttpHelper: HttpHelper = this.HttpHelper

      // Make the http request using Fetch API
      try {
         // Flatten filters
        const parameters = flatten(params as any)
        // Creates extended request information which is required for HttpHelper interface
        const request: IRequestInformation = {
          created: new Date(),
          entityName: Entity.prototype.entityName,
          url: interpolatedUri,
          isMock,
          dataType,
          method,
          body: data,
          query: {
            ...parameters['params'],
            // Select only filter params for neater url
            filter: parameters.filter,
            page: parameters.page,
            size: parameters.size,
            sort: parameters.sort
          },
          // TODO: Translate displayNames
          descriptorValue: descriptorFields
            .filter(field => (data[field.fieldName] !== undefined || params[field.fieldName] !== undefined))
            .map(field => field.displayName + ': ' + (data[field.fieldName] || params[field.fieldName]))
            .join(', '),
          successTransformHandler: response => action.method.bind(this)(response),
          errorHandler: errorInfo => errorInfo
        }

        const { requestErrorLocaleCodes = {} } = metadata
        const customErrorLocales = requestErrorLocaleCodes[action.actionName]
        const prom = this.HttpHelper
          .fetch(request)
          // Fetch API doesn't throw catch if response code not ok
          // -> It only throws an exception if there is a request failed by network etc
          .then(response => {
            if (!response.ok) {
              // Force catch handler
              return Promise.reject(response)
            }
            return response
          })
          .then(response => HttpHelper.successInterceptor(request, response, disableSuccessAlerts || action.suppressSuccessAlerts, action.customSuccessMessage))
          .catch(response => HttpHelper.errorInterceptor(request, response, customErrorLocales, errorSuppressionCodes))

        return prom
      } catch (e) {
        // TODO: This was added as a just in case.  Make a decision on whether it's needed and if so do something more clever
        console.error('err', e)
      }

    }
  })

  return Entity as Constructor<U & T>
}
