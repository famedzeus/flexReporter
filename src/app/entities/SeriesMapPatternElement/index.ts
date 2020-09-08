import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { ISeriesMapPatternElement } from './interface'

const { fieldNames } = entitySpec

@EntityName('SeriesMapPatternElement')
@EntityMeta(entitySpec)
@Uri(`seriesMapPatternElements/:${fieldNames.patternName}/:${fieldNames.sequence}`)
class SeriesMapPatternElementResource extends Resource<ISeriesMapPatternElement> {
  meta = entitySpec

  @ActionUri('seriesMapPatternElements')
  query (response) {
    return super.query(response)
  }

  @ActionUri('seriesMapPatternElements')
  @Action('POST')
  save (response) {
    return super.save(response)
  }
}

interface ISeriesMapPatternElementResource extends IResource<ISeriesMapPatternElement> {}

/**
 * @description
 * Provides a ResourceService for access to SeriesMapPatternElement.
 */
@Injectable()
export class SeriesMapPatternElementService extends makeResourceService<SeriesMapPatternElementResource, ISeriesMapPatternElementResource>(SeriesMapPatternElementResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
