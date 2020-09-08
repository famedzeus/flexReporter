import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { ISeriesMapGroupPattern } from './interface'

const { fieldNames } = entitySpec

@EntityName('SeriesMapGroupPattern')
@EntityMeta(entitySpec)
@Uri(`seriesMapGroupPatterns/:${fieldNames.sequence}/:${fieldNames.name}`)
class SeriesMapGroupPatternResource extends Resource<ISeriesMapGroupPattern> {
  meta = entitySpec

  @ActionUri('seriesMapGroupPatterns')
  @Action('POST')
  save (response) {
    return super.save(response)
  }
}

interface ISeriesMapGroupPatternResource extends IResource<ISeriesMapGroupPattern> {}

/**
 * @description
 * Provides a ResourceService for access to SeriesMapGroupPattern.
 */
@Injectable()
export class SeriesMapGroupPatternService extends makeResourceService<SeriesMapGroupPatternResource, ISeriesMapGroupPatternResource>(SeriesMapGroupPatternResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
