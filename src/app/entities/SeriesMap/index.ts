import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { ISeriesMap } from './interface'

const { fieldNames } = entitySpec

@EntityName('SeriesMap')
@EntityMeta(entitySpec)
@Uri(`seriesMaps/:${fieldNames.seriesMapName}`)
class SeriesMapResource extends Resource<ISeriesMap> {
  meta = entitySpec

  @ActionUri('seriesMaps')
  @Action('POST')
  save (response) {
    return super.save(response)
  }

  @Action('GET')
  @ActionUri(`seriesMaps/thatOffline/:lineId`)
  queryByOffline (response) {
    return super.query(response)
  }

  @Action('GET')
  @ActionUri(`seriesMaps/containingZone/:zoneCode`)
  queryWithZone (response) {
    return super.query(response)
  }

  @Action('GET')
  @ActionUri(`seriesMaps/containingELTZone`)
  queryWithELTZone (response) {
    return super.query(response)
  }
}
interface IQueryResponse<T> {
  data: Array<T>, headers: Function
}
type QueryPromise<T> = Promise<IQueryResponse<T>>

type SMQueryPromise = QueryPromise<ISeriesMap>
interface ISeriesMapResource extends IResource<ISeriesMap> {
  queryByOffline (params): SMQueryPromise
  queryWithZone (params): SMQueryPromise
  queryWithELTZone (): SMQueryPromise
}

/**
 * @description
 * Provides a ResourceService for access to SeriesMap.
 */
@Injectable()
export class SeriesMapService extends makeResourceService<SeriesMapResource, ISeriesMapResource>(SeriesMapResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
