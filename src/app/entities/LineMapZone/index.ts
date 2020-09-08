import entitySpec from './fields'
import { makeResourceService, ActionUri, NoSuccessAlerts, EntityMeta, EntityName,
  IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { ILineMapZone } from './interface'

const { fieldNames } = entitySpec

@EntityName('LineMapZone')
@EntityMeta(entitySpec)
@NoSuccessAlerts()
@Uri(`lineMapZones/:${fieldNames.lineMapId}/:${fieldNames.zoneCode}`)
class LineMapZoneResource extends Resource<ILineMapZone> {
  meta = entitySpec

  @ActionUri(`lineMapZones`)
  save (r) {
    return super.save(r)
  }
}

interface ILineMapZoneResource extends IResource<ILineMapZone> {}

/**
 * @description
 * Provides a $resource for access to LineMapZones.
 */
@Injectable()
export class LineMapZoneService extends makeResourceService<LineMapZoneResource, ILineMapZoneResource>(LineMapZoneResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
