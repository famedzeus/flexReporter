import { makeResourceService, EntityMeta, EntityName, ActionUri, IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import entitySpec from './fields'
import { IParameter } from './interface'

const { fieldNames } = entitySpec

@EntityName('Parameter')
@EntityMeta(entitySpec)
@Uri(`parameters/:${fieldNames.userId}/:${fieldNames.parameter}/:${fieldNames.parameterType}`)
class ParameterResource extends Resource<IParameter> {

  @ActionUri('parameters')
  save (response) {
    return super.save(response)
  }
}

export interface IParameterResource extends IResource<IParameter> {}
/**
 * @name ParameterService
 *
 * @description
 * Provides a Resource for access to Parameter
 */
@Injectable()
export class ParameterService extends makeResourceService<ParameterResource, IParameterResource>(ParameterResource) {
  static meta = entitySpec
  meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
