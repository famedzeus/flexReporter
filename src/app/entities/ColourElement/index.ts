import entitySpec from './fields'
import { makeResourceService, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IColourElement } from './interface'

const { fieldNames } = entitySpec

@EntityName('ColourElement')
@EntityMeta(entitySpec)
@Uri(`colourElements/:${fieldNames.colourCode}/:${fieldNames.colourTypeCode}/:${fieldNames.colourGroupCode}/:${fieldNames.carSeries}`)
class ColourElementResource extends Resource<IColourElement> {
  meta = entitySpec

  @ActionUri(`colourElements`)
  save (response) {
    return super.save(response)
  }

}

interface IColourElementResource extends IResource<IColourElement> {}

/**
 * @description
 * Provides a $resource for access to ColourElement entity
 */
@Injectable()
export class ColourElementService extends makeResourceService<ColourElementResource, IColourElementResource>(ColourElementResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
