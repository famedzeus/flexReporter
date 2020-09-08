import { Injectable } from '@angular/core'
import { ParameterService, IParameter, EqualityOperator, IResourceFilter } from 'entities'
import { ParameterEffectService } from 'effects'
import { merge } from 'lodash'

/**
 * A middle man service for user UserSettings
 *
 * Should be injected at app root level so that the initial API call can be made and promise can be
 * returned to any component which need parameter information
 *
 */
@Injectable()
export class UserSettings {
  private settingParameters: Promise<Array<IParameter>> = null
  private appNamespace = 'VSUI'
  private defaultUserId = 'Default'
  private delimeter = '.'
  private _userId = this.defaultUserId
  private paramObject = {}

  constructor (
    private Parameter: ParameterService
  ) {
    const filters: Array<IResourceFilter> = [{
      name: Parameter.meta.fieldNames.parameter,
      type: EqualityOperator.Match,
      value: 'VSUI'
    }]
    // Makes API request for all params with app namespace
    this.settingParameters = Promise.resolve([])
  }

  /**
   * Converts an array of parameters into an object tree
   * @example
   * this.delimiter = '.'
   * this.paramsToObject([{
   *  parameter: "VSUI.CarSeries.carSeriesCode.J111",
   *  value: { backgroundColour: 'red', textColour: 'white' }
   * }])
   *
   * >>>
   *
   * {
   *   CarSeries: {
   *     carSeriesCode: {
   *       J111: {
   *         backgroundColour: 'red', textColour: 'white'
   *       }
   *     }
   *   }
   * }
   */
  paramsToObject (params: Array<IParameter>) {
    params.reduce((acc, param) => {
      if (!param.parameter) return acc
      const [, entityName, fieldName, ...fieldValue] = param.parameter.split(this.delimeter)

      return merge(this.paramObject, {
        [entityName]: {
          [fieldName]: {
            [fieldValue.join(this.delimeter)]: param.value
          }
        }
      })
    }, {})
    return params
  }

  /**
   * Sets current user id for service use
   */
  set userId (userId: string) {
    this._userId = userId
  }

  /**
   * Returns the the requested parameter object when parameters query has resolved
   */
  async getMetadata (entityName: string): Promise<Array<IParameter>> {
    return new Promise<any>((resolve, reject) => {
      this.settingParameters
        .then(() => resolve(this.paramObject[entityName] || {}))
        .catch(res => reject(res))

    })
  }

  setMetadata (entityName: string, fieldName: string, fieldValue: string, metadata) {
    const parameter = [this.appNamespace, entityName, fieldName, fieldValue].join(this.delimeter)
    const parameterObj: IParameter = {
      parameter,
      value: metadata,
      userId: this._userId,
      parameterType: 'Metadata'
    }
    const paramData = Object.assign({}, parameterObj, { value: JSON.stringify(parameterObj.value)})
    return new Promise((resolve, reject) => {
      this.settingParameters
        .then((params) => {
          const existingParam = params.find(param => param.parameter === parameter)
          const prom = existingParam
                        ? this.Parameter.update(existingParam, paramData)
                        : this.Parameter.save({}, paramData)

          prom
            .then(() => {
              merge(this.paramObject, {
                [entityName]: {
                  [fieldName]: {
                    [fieldValue]: metadata
                  }
                }
              })
              resolve()
            })
            .catch(reject)
        }).catch(reject)
    })

  }
}
