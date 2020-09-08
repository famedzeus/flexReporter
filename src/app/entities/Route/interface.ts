export interface IRoute {
  id: number
  carSeries: string
  lineId: number
  schedulePeriod: string
  routeNumber: number
  scheduleDate: string
  shiftCode: number
  offlineTime: string
  routeStatus: number
  seriesMapName: string
  allocatedByEltRule: boolean
}

export type Routes = Array<IRoute>
