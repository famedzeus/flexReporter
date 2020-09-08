import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IZone } from './interface'

const { fieldNames } = entitySpec

@EntityName('Zone')
@EntityMeta(entitySpec)
@Uri(`zones/:${fieldNames.zoneCode}`)
class ZoneResource extends Resource<IZone> {
  meta = entitySpec

  @ActionUri('lines/:id/zones')
  @Action('GET')
  queryByLine (response) {
    return super.query(response)
  }

  @ActionUri('zones')
  @Action('POST')
  save (response) {
    return super.save(response)
  }

  @ActionUri('zones/offlineZoneForSeriesMap/seriesMapName')
  @Action('GET')
  getOfflineZoneForSeriesMap (response) {
    return super.query(response)
  }
}

interface IZoneResource extends IResource<IZone> {
  queryByLine (params): Promise<{ data: Array<IZone>, headers: Function }>,
  getOfflineZoneForSeriesMap (params): Promise<{ data: Array<IZone>, headers: Function }>
}

/**
 * @description
 * Provides a ResourceService for access to ZoneSet.
 */
@Injectable()
export class ZoneService extends makeResourceService<ZoneResource, IZoneResource>(ZoneResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
