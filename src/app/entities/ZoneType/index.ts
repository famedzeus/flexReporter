import { makeResourceService, EntityMeta, EntityName,
  IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'

interface IZoneType {
  zoneTypeCode: string
}

@EntityName('ZoneType')
@EntityMeta({ fields: [], constraints: {}, fieldNames: [] })
@Uri(`zones/zoneTypes`)
class ZoneTypeResource extends Resource<IZoneType> {
  query (response: Response) {
    return response.json()
      .then(r => {
        return { data: r.map(typeName => ({ zoneTypeCode: typeName })), headers: () => ({}) }
      })
  }
}

interface IZoneTypeResource extends IResource<IZoneType> {}

/**
 * @description
 * Provides a ResourceService for access to ZoneTypes.
 */
@Injectable()
export class ZoneTypeService extends makeResourceService<ZoneTypeResource, IZoneTypeResource>(ZoneTypeResource) {
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}
