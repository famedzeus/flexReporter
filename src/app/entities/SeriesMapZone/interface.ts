export interface ISeriesMapZone {
  actualZoneCode?: string
  additionalSeconds: number
  seriesMapName: string
  pullForwardBy: number
  zoneCode: string
  minimumSpacing: number
  position: number
  ignorePattern?: boolean
}

export type SeriesMapZones = Array<ISeriesMapZone>
