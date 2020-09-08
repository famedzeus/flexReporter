import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName, SuppressErrors, NoSuccessAlerts,
         IResource, ResourceMethod, Resource, ResourceMethod2, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { IShift } from './interface'

const { fieldNames } = entitySpec

const shiftsUrl = 'shifts'
const shiftRangeUrl = `${shiftsUrl}/from/:startShiftDate/:startShiftNumber/to/:endShiftDate/:endShiftNumber`
const generateSlotsUrl = `${shiftRangeUrl}/generateEmptySlotsAndRoutes`
const defaultUrl = `${shiftsUrl}/:${fieldNames.shiftCode}`

@EntityName('Shift')
@EntityMeta(entitySpec)
@NoSuccessAlerts()
@Uri(defaultUrl)
class ShiftResource extends Resource<IShift> {
  meta = entitySpec

  @ActionUri(shiftsUrl)
  @Action('POST')
  save (response) {
    return super.save(response)
  }

  @ActionUri('shifts/:shiftCode/link')
  @Action('PUT')
  link (response) {
    return response
  }

  @SuppressErrors([410])
  @ActionUri(`${shiftsUrl}/:${fieldNames.shiftCode}/previousIncompleteSlots`)
  @Action('GET')
  getPreviousIncompleteSlots (response) {
    return super.find(response)
  }

  @ActionUri(`${generateSlotsUrl}`)
  @Action('POST')
  processRoutesAndSlots (response) {
    return response
  }
  @ActionUri(`${generateSlotsUrl}/preCheck`)
  @Action('GET')
  @SuppressErrors([409])
  preCheckGeneration (response) {
    return response
  }

  @ActionUri(`${shiftRangeUrl}/slots/count`)
  @Action('GET')
  getShiftRangeSlotCount (response) {
    return super.find(response)
  }

  @ActionUri(`${defaultUrl}/next`)
  getNextNonWorkingShift (response) {
    return super.find(response)
  }
}

interface IShiftResource extends IResource<IShift> {
  preCheckGeneration: ResourceMethod<any>
  processRoutesAndSlots: ResourceMethod<any>
  getPreviousIncompleteSlots: ResourceMethod<{ count: number }>
  getShiftRangeSlotCount: ResourceMethod<{ count: number }>
  link: ResourceMethod<any>
  getNextNonWorkingShift: ResourceMethod<IShift>
}

/**
 * @description
 * Provides a ResourceService for access to Shifts.
 */
@Injectable()
export class ShiftService extends makeResourceService<ShiftResource, IShiftResource>(ShiftResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
