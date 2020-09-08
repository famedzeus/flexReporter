import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, NoSuccessAlerts, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { ISeriesMapZone } from './interface'

const { fieldNames } = entitySpec

@EntityName('SeriesMapZone')
@EntityMeta(entitySpec)
@NoSuccessAlerts()
@Uri(`seriesMapZones/:${fieldNames.position}/:${fieldNames.seriesMapName}`)
class SeriesMapZoneResource extends Resource<ISeriesMapZone> {
  meta = entitySpec

  @ActionUri('seriesMapZones')
  @Action('POST')
  save (response) {
    return super.save(response)
  }
}

interface ISeriesMapZoneResource extends IResource<ISeriesMapZone> {}

/**
 * @description
 * Provides a ResourceService for access to SeriesMapZone.
 */
@Injectable()
export class SeriesMapZoneService extends makeResourceService<SeriesMapZoneResource, ISeriesMapZoneResource>(SeriesMapZoneResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
