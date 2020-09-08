import entitySpec from './fields'
import { makeResourceService, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IColour } from './interface'

const { fieldNames } = entitySpec

@EntityName('Colour')
@EntityMeta(entitySpec)
@Uri(`colours/:${fieldNames.colourCode}/:${fieldNames.colourTypeCode}`)
class ColourResource extends Resource<IColour> {
  meta = entitySpec

  @ActionUri(`colours`)
  save (response) {
    return super.save(response)
  }

}

interface IColourResource extends IResource<IColour> {}

/**
 * @description
 * Provides a $resource for access to Colour entity
 */
@Injectable()
export class ColourService extends makeResourceService<ColourResource, IColourResource>(ColourResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
