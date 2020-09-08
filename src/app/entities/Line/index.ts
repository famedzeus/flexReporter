import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { ILine } from './interface'

const { fieldNames } = entitySpec

@EntityName('Line')
@EntityMeta(entitySpec)
@Uri(`lines/:${fieldNames.id}`)
class LineResource extends Resource<ILine> {
  meta = entitySpec

  @ActionUri('lines')
  @Action('POST')
  save (response) {
    return super.save(response)
  }
}

interface ILineResource extends IResource<ILine> {
  queryByLine (params): Promise<{ data: Array<ILine>, headers: Function }>
}

/**
 * @description
 * Provides a ResourceService for access to Line.
 */
@Injectable()
export class LineService extends makeResourceService<LineResource, ILineResource>(LineResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
