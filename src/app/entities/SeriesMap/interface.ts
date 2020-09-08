export interface ISeriesMap {
  active: boolean
  carSeriesCode: string
  carSeriesMapColour?: string  // Field still exists but is not needed
  lineMapId: string
  seriesMapGroupId: number
  seriesMapName: string
}

export type SeriesMaps = Array<ISeriesMap>
