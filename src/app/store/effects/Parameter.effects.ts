import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { EntityCRUDService } from './Entity.effects.base'
import { Log } from 'services'
import { ParameterService, IParameter } from 'entities'
import { IBaseStoreDictionary, DefaultAction } from '../'
import { DataViewEffectService } from './DataView.effects'
import { ParameterActions, IParameterStoreMap } from '../reducers/Parameters.reducer'
import { merge } from 'lodash'

const getValue = (param: IParameter) => {
  try {
    return JSON.parse(param.value as string)
  } catch (e) {
    return {}
  }
}

@Injectable()
export class ParameterEffectService extends EntityCRUDService<IParameter, null> {
  private appNamespace = 'VSUI'
  private delimeter = '.'
  constructor (
    private Parameter: ParameterService,
    private paramStore: Store<IParameterStoreMap>,
    log: Log,
    DataViewEffect: DataViewEffectService
  ) {
    super(Parameter, paramStore, log, DataViewEffect, 'parameters')
  }

  /**
   * Get a an Observable for changes in store metadata for specific entity such as CarSeries etc.
   * @param entityName Name of the entity which metadata should be attached to
   */
  getMetadata$ (entityName: string) {
    return this.paramStore
      .select(store => store.parameters.metadata)
      .map(metadata => metadata[entityName] === void 0 ? {} : metadata[entityName])
  }

  paramToObject (param: IParameter) {
    const [, entityName, fieldName, ...fieldValue] = param.parameter.split(this.delimeter)

    return {
      [entityName]: {
        [fieldName]: {
          [fieldValue.join(this.delimeter)]: getValue(param)
        }
      }
    }
  }

  paramsToObject (params: Array<IParameter>) {
    return params.reduce((acc, param) => {
      if (!param.parameter) return acc
      return merge(acc, this.paramToObject(param))
    }, {})
  }

  setMetadata (entityName: string, fieldName: string, fieldValue: string, metadata, userId = 'Default') {
    const parameter = [this.appNamespace, entityName, fieldName, fieldValue].join(this.delimeter)
    const parameterObj: IParameter = {
      parameter,
      value: metadata,
      userId,
      parameterType: 'Metadata'
    }
    const paramData = Object.assign({}, parameterObj, { value: JSON.stringify(parameterObj.value)})

    this.collection$
      .first()
      .map(params => params.find(param => param.parameter === parameter))
      .subscribe(existingParam => {
        if (existingParam) {
          this.Parameter
            .update(existingParam, paramData)
            .then(() => {
              this
                .paramStore
                .dispatch({
                  type: DefaultAction.UpdateItem,
                  payload: {
                    updatedItem: parameterObj,
                    originalItem: existingParam,
                    storePartition: this.partitionName
                  }
                })
              this.setMetadataValue(entityName, fieldName, fieldValue, metadata)
            })
            .catch(() => {
              // TODO: Handle this
            })

        } else {
          this.Parameter
            .save({}, paramData)
            .then(param => {
              this
                .paramStore
                .dispatch({
                  type: DefaultAction.AddItem,
                  payload: {
                    data: param,
                    storePartition: this.partitionName
                  }
                })

              this.setMetadataValue(entityName, fieldName, fieldValue, metadata)
            })
            .catch(() => {
              // TODO: Handle this
            })
        }

      })
  }

  getCollection (pagination, filters) {
    return super.getCollection(pagination, filters)
      .then(params => {
        this.paramStore
          .dispatch({
            type: ParameterActions.SetMetadataValues,
            payload: {
              data: this.paramsToObject(params)
            }
          })
        return params
      })
  }

  /**
   * Set store metadata action
   * @param entityName
   * @param fieldName
   * @param fieldValue
   * @param metadata
   */
  private setMetadataValue (entityName: string, fieldName: string, fieldValue: string, metadata) {
    this
      .paramStore
      .dispatch({
        type: ParameterActions.SetMetadataValue,
        payload: {
          entityName,
          fieldName,
          fieldValue,
          data: metadata
        }
      })
  }
}
