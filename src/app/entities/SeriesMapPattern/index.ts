import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { ISeriesMapPattern } from './interface'

const { fieldNames } = entitySpec

@EntityName('SeriesMapPattern')
@EntityMeta(entitySpec)
@Uri(`seriesMapPatterns/:${fieldNames.patternName}`)
class SeriesMapPatternResource extends Resource<ISeriesMapPattern> {
  meta = entitySpec

  @ActionUri('seriesMapPatterns')
  @Action('POST')
  save (response) {
    return super.save(response)
  }
}

interface ISeriesMapPatternResource extends IResource<ISeriesMapPattern> {}

/**
 * @description
 * Provides a ResourceService for access to SeriesMapPattern.
 */
@Injectable()
export class SeriesMapPatternService extends makeResourceService<SeriesMapPatternResource, ISeriesMapPatternResource>(SeriesMapPatternResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
