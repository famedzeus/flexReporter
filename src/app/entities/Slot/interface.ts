export interface ISlot {
  zoneCode: string
  entryTime: Date | string
  exitTime: Date | string
  entrySequence?: number
  exitSequence?: number
  routeNumber: number
  schedulePeriod: string
  previousZoneCode?: string
  // previousShopLineId: number
  extendedLeadTime: boolean
  lineId: string
  taktMultiplier?: number
  taktTime?: number
  status: string
  wip: number
  shiftCode: number
  scheduleDate: Date | string
  actualZoneCode: string
  id: string
  previousSlotLineId: string
}

export type Slots = Array<ISlot>
