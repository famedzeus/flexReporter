import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IZonePattern } from './interface'

const { fieldNames } = entitySpec

@EntityName('ZonePattern')
@EntityMeta(entitySpec)
@Uri(`zonePatterns/:${fieldNames.id}`)
class ZonePatternResource extends Resource<IZonePattern> {
  meta = entitySpec

  @ActionUri('zonePatterns')
  @Action('POST')
  save (response) {
    return super.save(response)
  }

}

interface IZonePatternResource extends IResource<IZonePattern> {}

// Replace decorated handlers with methods which implement API calls
/**
 * @description
 * Provides a ResourceService for access to ZonePatternSet.
 */
@Injectable()
export class ZonePatternService extends makeResourceService<ZonePatternResource, IZonePatternResource>(ZonePatternResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
