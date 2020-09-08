import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IZonePatternElement } from './interface'

const { fieldNames } = entitySpec

@EntityName('ZonePatternElement')
@EntityMeta(entitySpec)
@Uri(`zonePatternElements/:${fieldNames.zonePatternId}/:${fieldNames.sequence}`)
class ZonePatternElementResource extends Resource<IZonePatternElement> {
  meta = entitySpec

  @ActionUri('zonePatternElements')
  @Action('POST')
  save (response) {
    return super.save(response)
  }

}

interface IZonePatternElementResource extends IResource<IZonePatternElement> {}

// Replace decorated handlers with methods which implement API calls

/**
 * @description
 * Provides a ResourceService for access to ZonePatternElementSet
 */
@Injectable()
export class ZonePatternElementService extends makeResourceService<ZonePatternElementResource, IZonePatternElementResource>(ZonePatternElementResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
