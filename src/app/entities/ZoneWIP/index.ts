import entitySpec from './fields'
import { makeResourceService, EntityMeta, EntityName, ActionUri, Action, ResourceMethod3,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IZoneWIP } from './interface'

const { fieldNames } = entitySpec
const baseUri = `zoneWIPs/:${fieldNames.zoneCode}/:${fieldNames.shiftCode}`

@EntityName('ZoneWIP')
@EntityMeta(entitySpec)
@Uri(baseUri)
class ZoneWIPResource extends Resource<IZoneWIP> {
  meta = entitySpec

  @Action('PUT')
  @ActionUri(`${baseUri}/rollForward`)
  rollForward(response: Response) {
    return response
  }
}

interface IZoneWIPResource extends IResource<IZoneWIP> {
  rollForward: ResourceMethod3<IZoneWIP, Response>
}

// Replace decorated handlers with methods which implement API calls
/**
 * @description
 * Provides a ResourceService for access to ZoneWIP.
 */
@Injectable()
export class ZoneWIPService extends makeResourceService<ZoneWIPResource, IZoneWIPResource>(ZoneWIPResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) {
    super(HttpHelper)
  }
}

export * from './interface'
