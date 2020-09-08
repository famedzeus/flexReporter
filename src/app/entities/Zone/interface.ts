export interface IZone {
  lineId: number
  calendarCode: String
  zoneCode: string
  shopOrder: number
  zonePatternId: string
  zoneType: string
  active: boolean
  zoneName: string
  taskMultiplier: number
  linkedZones?: Array<ILinkedZone>
}

export interface ILinkedZone {
  description: string
  linkedZoneCode: string
  zoneCode: string
}
