export interface IZoneWIP {
  zoneCode: string,
  shiftCode: number,
  targetWip: number
}

export type ZoneWIPs = Array<IZoneWIP>
