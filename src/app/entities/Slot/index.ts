import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
        ResourceMethod, ResourceMethodQuery, NoSuccessAlerts,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { ISlot } from './interface'

const { fieldNames } = entitySpec

@EntityName('Slot')
@EntityMeta(entitySpec)
@NoSuccessAlerts()
@Uri(`slots/:${fieldNames.id}`)
class SlotResource extends Resource<ISlot> {
  meta = entitySpec

  @ActionUri('slots/fromShift/:fromDate/:fromShift/toShift/:toDate/:toShift/count')
  @Action('GET')
  getNumberOfSlots (response) {
    return response.json()
  }

  @ActionUri('slots/slots/statuses')
  @Action('GET')
  getStatuses (response) {
    return super.query(response)
  }

  @ActionUri('fileExports/pcSlots/:fromDateTime/:toDateTime')
  @Action('GET')
  exportPCSlots (response) {
    return super.query(response)
  }

  @ActionUri('slots/from/:fromDate/:fromShift/to/:toDate/:toShift/:by/:lineId/:csv')
  @Action('GET')
  getVolumeSummary (response) {
    return super.query(response)
  }

}



interface ISlotResource extends IResource<ISlot> {
  getNumberOfSlots: ResourceMethod<{count: number }>
  exportPCSlots: ResourceMethod<string>
  getVolumeSummary: ResourceMethod<string>
  getStatuses: ResourceMethodQuery<string>
}

/**
 * @description
 * Provides a Resource Service for access to Slot
 */
@Injectable()
export class SlotService extends makeResourceService<SlotResource, ISlotResource>(SlotResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
