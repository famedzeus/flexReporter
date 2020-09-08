import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { ISeriesMapGroup } from './interface'

const { fieldNames } = entitySpec

@EntityName('SeriesMapGroup')
@EntityMeta(entitySpec)
@Uri(`seriesMapGroups/:${fieldNames.id}`)
class SeriesMapGroupResource extends Resource<ISeriesMapGroup> {
  meta = entitySpec

  @ActionUri('seriesMapGroups')
  @Action('POST')
  save (response) {
    return super.save(response)
  }
}

interface ISeriesMapGroupResource extends IResource<ISeriesMapGroup> {}

/**
 * @description
 * Provides a ResourceService for access to SeriesMapGroup.
 */
@Injectable()
export class SeriesMapGroupService extends makeResourceService<SeriesMapGroupResource, ISeriesMapGroupResource>(SeriesMapGroupResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
