import entitySpec from './fields'
import { makeResourceService, ActionUri, EntityMeta, ResourceMethod, EntityName,
         IResource, Resource, Uri, ResourceMethodQuery } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IAttributeValue, IVehicle, VehiclesWithAttributeValues } from 'entities'

const { fieldNames } = entitySpec

@EntityName('Vehicle')
@EntityMeta(entitySpec)
@Uri(`vehicles/:${fieldNames.vehicleId}`)
class VehicleResource extends Resource<IVehicle> {
  meta = entitySpec

  @ActionUri('vehicles')
  save (response) {
    return super.save(response)
  }

  @ActionUri(`scheduleScopes/:${fieldNames.scheduleScopeName}/vehicles`)
  getWithAttributeValues (response) {
    return response.json()
  }

  @ActionUri(`vehicles/attributeValues`)
  getListWithAttributeValues (response) {
    return response.json()
  }

  @ActionUri(`vehicles/:${fieldNames.vehicleId}/attributeValues`)
  getAttributeValues (response) {
    return response.json()
  }
}

interface IVehicleResource extends IResource<IVehicle> {
  getWithAttributeValues: ResourceMethod<VehiclesWithAttributeValues>
  getAttributeValues: ResourceMethod<Array<IAttributeValue>>
}

// Replace decorated handlers with methods which implement API calls
@Injectable()
export class VehicleService extends makeResourceService<VehicleResource, IVehicleResource>(VehicleResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
