import entitySpec from './fields'
import { makeResourceService, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IColourType } from './interface'

const { fieldNames } = entitySpec

@EntityName('ColourType')
@EntityMeta(entitySpec)
@Uri(`colourTypes/:${fieldNames.colourTypeCode}`)
class ColourTypeResource extends Resource<IColourType> {
  meta = entitySpec

  @ActionUri(`colourTypes`)
  save (response) {
    return super.save(response)
  }
}

interface IColourTypeResource extends IResource<IColourType> {}

/**
 * @description
 * Provides a resource for access to ColourType entity
 */
@Injectable()
export class ColourTypeService extends makeResourceService<ColourTypeResource, IColourTypeResource>(ColourTypeResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
