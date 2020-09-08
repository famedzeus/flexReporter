import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IPenaltyFunction } from './interface'

const { fieldNames } = entitySpec

@EntityName('PenaltyFunction')
@EntityMeta(entitySpec)
@Uri(`penaltyFunctions/:${fieldNames.penaltyFunctionName}`)
class PenaltyFunctionResource extends Resource<IPenaltyFunction> {
  meta = entitySpec

  @ActionUri('penaltyFunctions')
  @Action('POST')
  save (response) {
    return super.save(response)
  }
}

interface IPenaltyFunctionResource extends IResource<IPenaltyFunction> {}

/**
 * @description
 * Provides a ResourceService for access to PenaltyFunctionSet.
 */
@Injectable()
export class PenaltyFunctionService extends makeResourceService<PenaltyFunctionResource, IPenaltyFunctionResource>(PenaltyFunctionResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
