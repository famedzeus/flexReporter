import { ExtendedSolutionSlots, IExtendedScheduleSolutionSlot } from '../ScheduleSolutionSlot/interface'
import { IRoute } from '../Route/interface'
import { IVehicle } from '../Vehicle/interface'
import { IAttributeValue } from '../AttributeValue/interface'

export interface IScheduleSolutionRoute {
  scheduleScopeName: string
  scheduleSolutionName: string
  schedulePeriod: string
  routeNumber: number
  vehicleId: string
  offlineTime: string
  userAllocated: boolean
}

export type ScheduleSolutionRoutes = Array<IScheduleSolutionRoute>

export interface IExtendedScheduleSolutionRoute extends IScheduleSolutionRoute {
  route: IRoute
  slots: ExtendedSolutionSlots
  vehicle: IVehicle
  attributeValues: Array<IAttributeValue>
}

export interface IExtendedScheduleSolutionRouteSlot extends IScheduleSolutionRoute {
  route: IRoute
  slot: IExtendedScheduleSolutionSlot
  vehicle: IVehicle
  attributeValues: Array<IAttributeValue>
  colourElements: Array<any>
}
