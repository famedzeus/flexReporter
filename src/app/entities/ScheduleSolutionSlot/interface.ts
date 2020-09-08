import { ISlot } from '../Slot/interface'
import { IVehicle } from '../Vehicle/interface'
import { IAttributeValue } from '../AttributeValue/interface'

export interface IScheduleSolutionSlot {
  scheduleScopeName: string
  scheduleSolutionName: string
  slotId?: string
  schedulePeriod: string
  routeNumber: number
}

export interface ISolutionSlotSummary extends IScheduleSolutionSlot {
  slot: ISlot
  vehicle: IVehicle
  attributeValues: Array<IAttributeValue>
}

export interface IExtendedScheduleSolutionSlot extends IScheduleSolutionSlot {
  slot: ISlot
}
export type ExtendedSolutionSlots = Array<IExtendedScheduleSolutionSlot>