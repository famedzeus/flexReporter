import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { ILineMap } from './interface'

const { fieldNames } = entitySpec

@EntityName('LineMap')
@EntityMeta(entitySpec)
@Uri(`lineMaps/:${fieldNames.id}`)
class LineMapResource extends Resource<ILineMap> {
  meta = entitySpec

  @ActionUri('lineMaps')
  @Action('POST')
  save (response) {
    return super.save(response)
  }
}

interface ILineMapResource extends IResource<ILineMap> {}

/**
 * @description
 * Provides a ResourceService for access to LineMapSet.
 */
@Injectable()
export class LineMapService extends makeResourceService<LineMapResource, ILineMapResource>(LineMapResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
